const uuid = require('uuid');
const models = require('../../models');
const eventHost = require('./event-host');
const studentViewBuilder = require('./view-builders/student');
const Student = require('./schemas').Student;

// addTask();
// scaleData()
// test();
initData().catch(console.error);

function addTask() {
  const tl = uuid();
  console.time(`TTTT${tl}`);
  return eventHost.triggerAsync('industry/update', {
      industry: {
        id: 2,
        name: 'test'
      }
    })
    .then(() => {
      console.timeEnd(`TTTT${tl}`);
      console.log(111111);
    });
}

async function test() {
  for (var i = 0; i < 10; i++) {
    await sleep(10 + 300 * Math.random());
    addTask();
  }
}

function sleep(t) {
  return new Promise(res => setTimeout(res, t));
}

async function initData() {
  const studentIds = (await models.Student.findAll({
    attributes: ['id'],
    order: ['id']
  })).map(s => s.id);
  for (const id of studentIds) {
    await studentViewBuilder('createOrupdate', {
      id
    });
    console.log('student added:', id);
  }
  console.log('init data compalete!');
}

async function scaleData() {
  const studentIds = (await models.Student.findAll({
    attributes: ['id']
  })).map(s => s.id);
  for (const id of studentIds) {
    const s = (await Student.db.find({
      id
    }))[0];
    console.log(s);
    for (let i = 100; i < 200; i++) {
      delete s._id;
      await Student.db.insert(Object.assign(s, {
        id: Number(`${i}${id * 10000}`)
      }));
    }
  }
}

// const a =
