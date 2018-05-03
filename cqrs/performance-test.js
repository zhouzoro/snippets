const moment = require('moment');
const studentQuery = require('./query/student');
const studentService = require('../student/student-service');

const variables = {
  // keyword: () => '张',
  pageNum: () => Math.ceil(Math.random() * 100) + 1,
  // // schoolId: () => Math.ceil(Math.random() * 10000),
  // is211: () => Math.random() > 0.8,
  // gradDateFrom: () => moment().add(Math.ceil(Math.random() * -1000), 'd').format('YYYY-MM-DD'),
  userId: () => (Math.random() > 0.8 ? 8 : 0)
};


function sleep(time) {
  const sleeptime = time || Math.floor((Math.random() ** 2) * 20);
  console.log('sleeptime', sleeptime);
  return new Promise(res => setTimeout(res, sleeptime));
}

// test(studentService.getStudentList);
// 4945
// 242.367
// 213.371
// 51848.47
test(studentQuery.getList);
// 20.038
// 15.949
// 14.854
// 4621.935

async function test(fn) {
  await sleep(1000);
  let counter = 0;
  let totalTime = 0;
  for (let i = 0; i < 1000; i++) {
    // const qs = Object.keys(variables).map(k => [k, variables[k]()])
    //   .reduce((o, n) => {
    //     o[n[0]] = n[1];
    //     return o;
    //   }, {});
    const qs = {
      userId: (Math.random() > 0.05 ? 8 : 0)
    };
    qs.pageNum = Math.ceil(Math.random() * (qs.userId === 0 ? 100 : 10));
    console.log('qsqsqsqs', qs);
    const timeStart = Date.now();
    console.log('qsqsqs', qs);
    fn(qs)
      .then((res) => {
        // console.log(res);
        const time = Date.now() - timeStart;
        counter++;
        totalTime += time;
        console.log('timeStart: ', timeStart);
        console.log('counter: ', counter);
        console.log('totalTime: ', totalTime);
        console.log('avgTime: ', totalTime / counter);
      });
    // await sleep();
  }
}
