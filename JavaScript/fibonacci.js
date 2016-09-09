//'use strict';

var fi = fib(7);

function fib (n) {
  var arr = [];
  while(n--) {
    arr = getFib(arr);
    //console.log(arr);
  }
  return arr;
}

function getFib(arr) {
  if(arr.length < 2) {
    arr.push(1);
  }else {
    arr.push(arr[arr.length - 1] + arr[arr.length - 2]);
  }
  return arr;
}

console.log(fib(700));
