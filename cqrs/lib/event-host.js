const MI = require('../../../utils/module-iterator');

module.exports = EventHost;

function EventHost({
  taskManager,
  eventDir,
}) {
  this.taskManager = taskManager;
  this.EVENTS = {};
  this.initDir = initDir;
  this.register = register;
  this.trigger = trigger;
  this.triggerAsync = triggerAsync;
  if (eventDir) this.initDir(eventDir);
}

function triggerAsync(name, data) {
  return this.trigger(name, data, 1);
}

async function trigger(name, data, isAsync) {
  const evt = this.EVENTS[name];
  if (!evt) {
    throw new Error(`event not registered: ${name}`);
  }
  const tasks = evt.genTasks(data);
  const jobs = [];
  if (isAsync) {
    return new Promise((res, rej) => {
      const len = tasks.length;
      let rlen = 0;
      const tcb = () => {
        rlen++;
        if (rlen === len) res();
      };
      for (const t of tasks) {
        jobs.push(this.taskManager.addTask(t.name, t.data).then(tcb).catch(rej));
      }
    });
  }
  for (const t of tasks) {
    jobs.push(await this.taskManager.addTask(t.name, t.data));
  }
  return jobs;
}

function register({
  name,
  dataCheck,
  tasks,
}) {
  if (this.EVENTS[name]) {
    throw new Error(`event register duplicate: ${name}`);
  }
  const evt = {
    name,
    genTasks: GenTasks(name, dataCheck, tasks)
  };
  this.EVENTS[name] = evt;
}

function GenTasks(name, dataCheck, tasks) {
  return (data) => {
    if (dataCheck && !dataCheck(data)) {
      console.error(`event ${name} dataCheck failed`, data);
      throw new Error(`event ${name} dataCheck failed`);
    }
    return tasks.map(tname => ({
      name: tname,
      data,
    }));
  };
}

function initDir(dir) {
  setTimeout(() =>
    MI(dir, (file) => {
      try {
        const events = require(file);
        for (const evt of events) {
          this.register(evt);
        }
      } catch (e) {
        console.error(e);
      }
    }), 10);
}
