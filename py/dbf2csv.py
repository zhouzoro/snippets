import arcpy
import csv
import os
import codecs
import cStringIO

def batch_convert_dbf_to_csv(input_dir, output_dir, rename_func=None):
    """Converts shapefiles and standalone DBF tables within the input directory
    input_dir to CSV files within the output directory output_dir. An
    optional function rename_func may be used to manipulate the output file
    name."""
    # Set workspace to input directory
    arcpy.env.workspace = input_dir

    # List shapefiles and standalone DBF tables in workspace
    tables = list_tables()

    # Only proceed if there actually exists one or more shapefiles or DBF tables
    if tables:
        # Create output directory structure
        make_output_dir(output_dir)

        # Loop over shapefiles and DBF tables
        for table in tables:
            # Generate output filename
            output_name = os.path.splitext(os.path.basename(table))[0]
            if rename_func:
                output_name = rename_func(output_name)
            output_csv_file = os.path.join(output_dir,
                output_name + os.extsep + 'csv')

            # List input fields
            fields = list_fields(table)

            # Open input table for reading
            rows = read_rows(table, fields)

            # Set flag indicating whether we are overwriting an existing file
            output_exists = os.path.isfile(output_csv_file)

            # Attempt to create output CSV file
            try:
                write_unicode_csv(output_csv_file, rows, fields)

                # Warn if we overwrite anything
                if output_exists:
                    print 'warning: overwrote {0}'.format(output_csv_file)
                else:
                    print 'wrote {0}'.format(output_csv_file)
            except IOError:
                print 'warning: unable to create output CSV file {0}'.format(
                    output_csv_file)
    else:
        print 'No DBF files found in workspace {0}'.format(input_dir)

def list_tables():
    """Returns a list of shapefiles and standalone DBF tables in the current
    workspace."""
    tables = arcpy.ListFeatureClasses('*.shp')
    tables.extend(arcpy.ListTables('*', 'dBASE'))
    return tables

def list_fields(table):
    """Returns a list of fields in the specified table, excluding the shape
    field if present."""
    desc = arcpy.Describe(table)
    shape_field_name = desc.shapeFieldName if hasattr(
        desc, 'shapeFieldName') else ''
    return [field.name for field in desc.fields
        if field.name != shape_field_name]

def read_rows(table, fields='*'):
    """Generator function that yields the rows of a table, including only the
    specified fields."""
    with arcpy.da.SearchCursor(table, fields) as rows:
        for row in rows:
            yield row

def write_unicode_csv(output_csv, rows, header_row=None):
    """Creates a UTF-8 encoded CSV file specified by output_csv containing the
    specified rows and the optional header_row."""
    with open(output_csv, 'wb') as f:
        f.write(codecs.BOM_UTF8) # Write Byte Order Mark character so Excel
                                 # knows this is a UTF-8 file
        csv_writer = UnicodeWriter(f, dialect='excel', encoding='utf-8')
        if header_row:
            csv_writer.writerow(header_row)
        csv_writer.writerows(rows)

def make_output_dir(path):
    """Creates the output directory structure if it does not already exist."""
    if not os.path.isdir(path):
        try:
            os.makedirs(path)
            print 'created dir {0}'.format(path)
        except OSError:
            if not os.path.isdir(path):
                raise

class UnicodeWriter:
    """
    A CSV writer which will write rows to CSV file 'f',
    which is encoded in the given encoding.
    Based on: https://docs.python.org/2/library/csv.html#examples
    """

    def __init__(self, f, dialect=csv.excel, encoding='utf-8', **kwds):
        # Redirect output to a queue
        self.queue = cStringIO.StringIO()
        self.writer = csv.writer(self.queue, dialect=dialect, **kwds)
        self.stream = f
        self.encoder = codecs.getincrementalencoder(encoding)()

    def writerow(self, row):
        self.writer.writerow([unicode(s).encode("utf-8") for s in row])
        # Fetch UTF-8 output from the queue ...
        data = self.queue.getvalue()
        data = data.decode('utf-8')
        # ... and reencode it into the target encoding
        data = self.encoder.encode(data)
        # write to the target stream
        self.stream.write(data)
        # empty queue
        self.queue.truncate(0)

    def writerows(self, rows):
        for row in rows:
            self.writerow(row)

if __name__ == '__main__':
    # Configure script here, or modify to take parameters/arguments
    input_dir = r'ArcGis/data'
    output_dir = r'ArcGis/data'

    # Customize this function to change renaming logic
    def rename_func(input_name, default='output'):
        # Strips non-digits from string
        output_name = ''.join((char for char in input_name if char.isdigit()))

        # Give filename a sensible default name if there are no digits
        return output_name or default

    # Run it
    batch_convert_dbf_to_csv(input_dir, output_dir, rename_func)