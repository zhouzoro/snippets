function promiseQueue(values, promiseConstructor, limit) {
  var workerNum = limit || 3;
  var workingPs = [];
  var allPromises = [];
  var results = [];
  var gen = function*() {
    for(var i = workerNum; i < values.length; i++) {
      yield newPromise(i);
    }
  }();

  for(var i = 0; i < workerNum && i < values.length; i++) {
    workingPs.push(newPromise(i));
  }

  return Promise.all(workingPs).then(() => results);

  function nextPromise() {
    var next = gen.next();
    if(!next.done) {
      return next.value;
    }
  }

  function newPromise(idx) {
    var np = promiseConstructor(values[idx]).then(reult => {
      results[idx] = reult;
      return nextPromise();
    });
    allPromises.push(np);
    return np;
  }
}

// function* promiseGen(values) {
//   var i = 0;
//   for(let value of values) {
//     var newPromise = promiseConstructor.then((data) => {
//       return
//     })
//     yield new Promise((res, rej) => {
//       let index = i;
//       promiseConstructor
//       })
//
//     })
//   }
// }

var arr = [1,2,3,5,7,11];
function pcon(val) {
  return Promise.resolve(1).then(() => {
    console.log(val);
    return ++val;
  })
}
promiseQueue(arr, pcon)
.then(arr => console.log('result arr: ', arr))
.catch(err => console.log(err));
