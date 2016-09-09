'use strict';
const isPromise = obj => typeof obj !== 'undefined' && typeof obj.then === 'function';

function* main() {
  var a = yield promise1();
  yield promise2(a);
  // yield 1;
  // yield 3;
}

function promise1(){
  return Promise.resolve(1).then(() => 1);
}


function promise2(a){
  return Promise.resolve(2).then(() => a + 2);
}

function genAsync(gen) {
  var result;
  var genResult = {};
  return next();
  function next() {
    if(isPromise(genResult.value)) {
      return genResult.value.then(val => {
        genResult.value = val;
        return genext()
      })
    }else {
      return genext()
    }
    function genext() {
      if(genResult.done) return Promise.resolve(result);
      result = genResult.value;
      genResult = gen.next(genResult.value);
      return next();
    }
  }
}

var app = main();
var res =  genAsync(app);
res.then(result => console.log(result));
