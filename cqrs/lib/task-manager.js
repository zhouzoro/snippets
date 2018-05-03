const Queue = require('bee-queue');
const redisConfig = require('config').redis;
const MI = require('../../../utils/module-iterator');

module.exports = TaskManager;

function TaskManager(dir, notWorker) {
  this.HANDLERS = {};
  this.isWorker = !notWorker;
  this.initDir = initDir;
  this.Queues = {};
  this.getQueue = getQueue;
  this.registerHandler = registerHandler;
  this.addTask = addTask;
  if (dir) this.initDir(dir);
}

async function addTask(taskName, data) {
  const ts = taskName.split('/');
  const Q = this.getQueue(ts[0]);
  // console.log('this.getQueue(name)', Q);

  const job = await Q.createJob({
    taskType: ts[1],
    data,
  }).retries(2).save();
  console.log('cqrs task added', taskName, data);
  return new Promise((res, rej) => {
    job.on('succeeded', res);
    job.on('failed', rej);
  });
}

function registerHandler(name, handler) {
  if (this.HANDLERS[name]) {
    throw new Error(`HANDLERS register duplicate: ${name}`);
  }
  const Q = this.getQueue(name);
  // console.log('this.getQueue(name)', Q);
  Q.process(10, async(job) => {
    console.log('job.data', job.data);
    const result = await handler(job.data.taskType, job.data.data);
    return result;
  });
  this.HANDLERS[name] = handler;
}


function getQueue(qname) {
  const name = qname.replace(/-/g, '_');
  let q = this.Queues[name];
  if (!q) {
    q = initQ(name, this.isWorker);
    this.Queues[name] = q;
  }
  return q;
}


function initQ(qname, isWorker) {
  return new Queue(qname, {
    redis: redisConfig,
    isWorker
  });
}

function initDir(dir) {
  const domainMatcher = /(\/)([a-z_-]+)(\.js)$/;
  setTimeout(() =>
    MI(dir, (file) => {
      try {
        const handler = require(file);
        const matched = file.match(domainMatcher);
        if (!matched) {
          throw new Error('task handler filename error:', file);
        }
        this.registerHandler(matched[2], handler);
      } catch (e) {
        console.error(e);
      }
    }), 10);
}
