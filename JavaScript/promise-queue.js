function promiseQueue(limit) {
  var Q = this
  Q.stack = [];
  Q.workerNum = limit || 3;
  Q.workers = [];
  Q.state = 0;
  Q.add = add;

  for(var i = 0; i < Q.workerNum; i++) {
    Q.workers[i] = new Worker();
  }

  function init() {
    Q.state = 1;
    for(var i = 0; i < Q.workerNum; i++) {
      if(!Q.workers[i].state) {
        Q.workers[i].do(newPromise());
      }
    }
    Promise.all(Q.workers.map(w => w.promise)).then(() => Q.state = 0)
  }

  function Worker() {
    var worker = this;
    worker.state;
    worker.promise = Promise.resolve(1);
    worker.do = function (work) {
      worker.state = 1;
      worker.promise = Promise.resolve(work).then(() => worker.state = 0);
    }
  }

  function add(vals, pmsConstructor) {
    vals.forEach(val => {
      Q.stack.push({
        value: val,
        func: pmsConstructor
      })
    });
    init();
  }

  function newPromise() {

    var newWork = Q.stack.shift();
    if(newWork) {
      return newWork.func(newWork.value).then(reult => {
        return newPromise();
      });
    }
  }
}

// function* promiseGen(Q.stack) {
//   var i = 0;
//   for(let value of Q.stack) {
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
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(val);
      }, 1000)
    });
  }).catch(err => console.log(err))
}


var pq = new promiseQueue();
pq.add(arr, pcon);
setTimeout(() => {
  console.log('there', pq.state);
  pq.add([13,17,19,23], pcon);
}, 300)

setTimeout(() => {
  console.log('done', pq.state);
}, 5000)
  console.log('here', pq.state);
