'use strict'
function* g(values) {
  var i =  0;
  for(let value of values) {
    var newPromise = new Promise((res, rej) => {
      res({
        value: value + 1,
        index: i
      })
    }).then(result => console.log(result));
    yield newPromise
       i++
  }
  // var i = 0;
  // while(i < values.length) {
  //   let value = values[i]
  //   yield (Promise.resolve(1).then(() => {
  //     console.log(value);
  //     return i + ': ' + value
  //   }))
  //   i++
  // }
}
var gen = g([1,2,3,5]);
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
// console.log(gen.next());
// console.log(gen.next());
