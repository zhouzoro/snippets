
function parseOrigin(originConfig){
  //get origin data, and its type
  var originData = originConfig.origin;
  var originType = typeof originData;
  //parse differs with types
  if(originType === 'string'){
    return {
      origin: parseOneOrigin(originData)//a single string can be parsed directly
    };
  }else if (originType === 'object') {
    var newOrigin = [];// an array would be parsed separatly to a new array
    for(var i = 0; i < originData.length; i++){
      newOrigin.push(parseOneOrigin(originData[i]));
    }
    return {
      origin: newOrigin//a single string can be parsed directly
    };
  }
}

//parse one origin string
function parseOneOrigin(origin){
  var checkReg = /^\/.*\/$/;
  //return RegExp if it is one, else return string
  if(checkReg.test(origin)){
    return new RegExp(origin.substring(1, origin.length - 1));
  }
  return origin;
}

var origin = [
  {origin: 'http://aa.scamdc'},
  {origin: '/test\.com\.cn/'},
  {origin: [
    'http:/aa.scamdc',
    '/test\\.com\\.cn/',
    '/careerfrog\\.com\\.cn/'
  ]},
  {origin: [
    '/consult-in\.com\.cn/',
    '/test\.com\.cn/',
    '/careerfrog\.com\.cn'
  ]},
]

for (var i = 0; i < origin.length; i++){
  var tempo = parseOrigin(origin[i]);
  console.log(tempo);
}
var newrg = new RegExp('test\\.com\\.cn');
console.log(newrg);
console.log(newrg.test('http://cors.test.com.cn'));
