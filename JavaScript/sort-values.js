//use fs and readline module;
const fs = require('fs');
const readLine = require('readline');
const dateRegex = /\d{4}-\d{1,2}-\d{1,2}/;

//create readStream from file and use it to create a readline interface
console.time('test1');
var lineReader = readLine.createInterface({ input: fs.createReadStream('./values.csv') });

//use an object to store the results
var report = {
    maxIncrement: 0,
    stock: {},
    validCount: 0,
    invalidCount: 0,
    validRecords: {},
    validSummary: [],
    invalidRecords: []
};
var metaData = [];
//all records with same name groupped, extract the key fields
function nameGroupedStock(obj) {
    this.Name = obj.Name;
    this.startDate = obj.Date;
    this.endDate = obj.Date;
    this.startValue = obj.Value;
    this.endValue = obj.Value;
    this.totalIncrement = 0;
    this.allRecords = [];
    this.allRecords.push(obj);
}
lineReader.on('line', function(line) {
    //console.log(count);
    // to array
    var vals = line.split(',');

    if (!metaData[0]) {
        //assume metaData data in first line, if not in report, create one
        metaData = vals;
    } else {
        var validation = validateRecord(vals);
        var tempRecord  = validation.obj;
        if (validation.valid) {
            // console.log(tempRecord);
            report.validCount++;

            //make date formated '0000-00-00'
            tempRecord.Date = regulateDate(tempRecord.Date);
            //check if record with the same name exsits
            var recordGroup = report.validRecords[tempRecord.Name];
            if (recordGroup) {
                var len = recordGroup.allRecords.length;
                while (len--) {
                    if (tempRecord.Date < recordGroup.allRecords[len].Date) {
                        recordGroup.allRecords.splice(len + 1, 0, tempRecord);
                        break;
                    }
                }

            } else {
                recordGroup = new nameGroupedStock(tempRecord);
            }
            report.validRecords[tempRecord.Name] = recordGroup;
        } else {
            report.invalidCount++;
            report.invalidRecords.push(tempRecord);
        }
    }
});
lineReader.on('close', function() {

    fs.mkdir('./validRecords', (err) => {});

    for (stockName in report.validRecords) {
        var stock = report.validRecords[stockName];
        var count = stock.allRecords.length;
        stock.startValue = stock.allRecords[count - 1].Value;
        stock.startDate = stock.allRecords[count - 1].Date;
        stock.endValue = stock.allRecords[(0)].Value;
        stock.endDate = stock.allRecords[(0)].Date;
        stock.totalIncrement = stock.endValue - stock.startValue;
        if (stock.totalIncrement > report.maxIncrement) {
            report.maxIncrement = stock.totalIncrement;
            report.stock = stock;
            //console.log('max increment:' + report.maxIncrement);
            //console.log('stock name:' + report.stock.Name);
        }
        writeCSV(stock.allRecords, './validRecords/' + stock.Name + '.csv');
        report.validSummary.push({
            Name: stockName,
            startDate: stock.startDate,
            endDate: stock.endDate,
            startValue: stock.startValue,
            endValue: stock.endValue,
            totalIncrement: stock.totalIncrement
        })
    }
    writeCSV(report.validSummary, './validSummary.csv');
    writeCSV(report.invalidRecords, './invalidRecords.csv');
    console.timeEnd('test1');
    console.log('The stock with the largest absolute increase is ' + report.stock.Name + '\nwith an increment of ' + report.maxIncrement);
})

function writeCSV(arr, fileName) {
    var keys = Object.keys(arr[0]);

    // Build header
    var csv = keys.join(",") + "\n";

    // Add the rows
    arr.forEach(function(obj) {
        keys.forEach(function(k, ix) {
            if (ix) csv += ",";
            csv += obj[k];
        });
        csv += "\n";
    });
    fs.writeFile(fileName, csv);
}

function regulateDate(date) {
    var arr = date.split('-');
    if (arr[1] < 10 && arr[1].length < 2) {
        arr[1] = '0' + arr[1];
    }
    if (arr[2] < 10 && arr[2].length < 2) {
        arr[2] = '0' + arr[2];
    }
    return arr[0] + '-' + arr[1] + '-' + arr[2];
}
//validate the record, return validated object or false
function validateRecord(stockRecordArray) {
    var stockRecord = {};
    var valid = true;
    for (var i = 0; i < stockRecordArray.length - 1; i++) {
        stockRecord[metaData[i]] = stockRecordArray[i];
        if (i === 0 && typeof(stockRecordArray[i]) !== 'string') valid = false;
        if (i === 1 && !dateRegex.test(stockRecordArray[i])) valid = false;
        if (i === 3 && !parseFloat(stockRecordArray[i])) {
            //console.log(stockRecordArray[i])
            valid = false;
        }
    }
    return {
        obj: stockRecord,
        valid: valid
    };
}