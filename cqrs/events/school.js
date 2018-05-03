module.exports = [
  // {
  //   name: 'school/create',
  //   dataCheck: student => student && student.id,
  //   tasks: [
  //     'school/createOrupdate',
  //   ],
  // },
  {
    name: 'school/update',
    dataCheck: school => school && school.id,
    tasks: [
      'student/update_school',
    ],
  },
  {
    name: 'school/merge',
    dataCheck: data => data.fromId && data.to && data.to.id,
    tasks: [
      'student/merge_school',
    ],
  }
];
