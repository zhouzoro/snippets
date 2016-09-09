var moment = require('moment');

function sortByPriority(students) {
  var zombies;
  var breakPoint;
  for (var i in students) {
    i = parseInt(i);
    var scheduleStartDate = moment(new Date(students[i].scheduleStartDate)).add(
      3, 'months');
    console.log(scheduleStartDate.toDate());
    var tillNow = scheduleStartDate.diff(
      moment());
    console.log(tillNow);
    if (moment(new Date(students[i].scheduleStartDate)).add(
        3, 'months').diff(
        moment()) > 0) {
      breakPoint = i;
      break;
    }
  }
  console.log(breakPoint);
  zombies = students.splice(0, breakPoint);
  zombies = zombies.reverse();
  return students.concat(zombies);
}

var a = ['2016-05-01 00:00:00', '2016-05-11 00:00:00', '2016-05-23 00:00:00',
  '2016-07-01 00:00:00', '2016-07-01 00:00:00', '2016-08-01 00:00:00',
  '2016-08-01 00:00:00', '2016-08-01 00:00:00',
  '2016-08-06 00:00:00', '2016-08-08 00:00:00', '2016-08-11 00:00:00',
  '2016-08-11 00:00:00', '2016-08-11 00:00:00', '2016-08-20 00:00:00',
  '2016-08-20 00:00:00', '2016-08-21 00:00:00',
];
var s = [];
for (var i in a) {
  i = parseInt(i);
  s.push({
    scheduleStartDate: a[i]
  });
}
console.log(sortByPriority(s));
