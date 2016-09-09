const fs = require('fs');
const Excel = require('exceljs');

process.argv.forEach((fname, idx) => {
  if(idx < 2) return;
  convertQA(fname)
})

function convertQA(filename) {
  var fname = filename.substring(filename.lastIndexOf('/'));
  fname = '.' + fname.substring(0, fname.lastIndexOf('.')) + '.xlsx';
  console.log(fname);
  var xlsWriter = new SheetWriter(['Q', 'A'], fname);
  function readStreamPromise(filename) {
    return new Promise((res, rej) => {
      var stream = fs.createReadStream(filename);
      var data;
      stream.on('data', chunk => {
        data = data + chunk.toString();
      })
      stream.on('end', () => {
        res(data);
      })
    })
  }

  readStreamPromise(filename)
  .then(data => {
    var Qs = data.split(/Q\d*[：:]/);
      console.log(Qs);
    Qs.forEach((QnA, i) => {
      if(i < 1) return;
      var breakPoint = QnA.indexOf('\r');
      var Q = QnA.substring(0, breakPoint);
      var A = QnA.substring(breakPoint + 1).replace(/\r/g, '');
      xlsWriter.writeRow([Q, A]);
      console.log('Q. ', Q);
      console.log('A. ', A);
    })
    xlsWriter.finish()
  }).catch(err => console.log(err))
}


function SheetWriter(headers, filename, sheetname) {
  headers = typeof headers === 'string' ? [headers] : headers;
  sheetname = sheetname ? sheetname : 'sheet1';
  var workbook = new Excel.Workbook();
  var worksheet = workbook.addWorksheet(sheetname);
  var rowNum = 1;
  writeRow(headers);
  function writeRow(rowData) {
    var row = worksheet.getRow(rowNum);
    var colNum = 1;
    rowData.forEach(col => {
      row.getCell(colNum).value = col;
      colNum++;
    })
    rowNum++;
  }
  function finish() {
    workbook.xlsx.writeFile(filename)
    .then(function() {
    });
  }

  this.writeRow = writeRow;
  this.finish = finish;
}
