const path = require('path');
const EventHost = require('./lib/event-host');
const TaskManager = require('./lib/task-manager');

const taskManager = new TaskManager(path.join(__dirname, 'view-builders'));

const eventHost = new EventHost({
  taskManager,
  eventDir: path.join(__dirname, 'events'),
});

module.exports = eventHost;
