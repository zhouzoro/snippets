module.exports = [
  // {
  //   name: 'member/create',
  //   dataCheck: student => student && student.id,
  //   tasks: [
  //     'member/createOrupdate',
  //   ],
  // },
  {
    name: 'member/update',
    dataCheck: member => member && member.id,
    tasks: [
      'student/update_consultant_info',
    ],
  }
];
