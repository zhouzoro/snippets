module.exports = [{
  name: 'student/create',
  dataCheck: student => student && student.id,
  tasks: [
    'student/createOrupdate',
  ],
}, {
  name: 'student/update',
  dataCheck: student => student && student.id,
  tasks: [
    'student/createOrupdate',
  ],
}, {
  name: 'student/update_complete',
  dataCheck: student => student && student.id,
  tasks: [
    'student_offer/update_student_info',
  ],
}, {
  name: 'student/course_update',
  dataCheck: student => student && student.id,
  tasks: [
    'student/update_statistics',
  ],
}, {
  name: 'student/activity',
  dataCheck: student => student && student.id,
  tasks: [
    'student/update_activity',
  ],
}, {
  name: 'student/update_education_experience',
  dataCheck: student => student && student.id,
  tasks: [
    'student/update_education_experience',
  ],
}, {
  name: 'student/transfer',
  dataCheck: student => student && student.id,
  tasks: [
    'student/update_consultant',
  ],
}, {
  name: 'student/share',
  dataCheck: student => student && student.id,
  tasks: [
    'student/update_sharers',
  ],
}, {
  name: 'student/update_offer',
  dataCheck: student => student && student.id,
  tasks: [
    'student_offer/update_by_student',
  ],
}];
