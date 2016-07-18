
string queryString = 
  "SELECT CustomerID, CompanyName FROM dbo.Customers";
SqlDataAdapter adapter = new SqlDataAdapter(queryString, connection);

DataSet customers = new DataSet();
adapter.Fill(customers, "Customers");

//TableAdapters are designer-generated components that improve upon the functionality of DataAdapters.
// TableAdapters typically contain Fill and Update methods to fetch and update data in a database.
NorthwindDataSet northwindDataSet = new NorthwindDataSet();

NorthwindDataSetTableAdapters.CustomersTableAdapter customersTableAdapter = 
    new NorthwindDataSetTableAdapters.CustomersTableAdapter();

customersTableAdapter.Fill(northwindDataSet.Customers);