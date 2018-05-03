module.exports = [{
  name: 'industry/update',
  dataCheck: industry => industry && industry.id,
  tasks: [
    'student/update_industry',
    // 'opportunity/update_industry',
  ],
}];
