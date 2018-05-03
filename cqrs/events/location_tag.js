module.exports = [{
  name: 'location_tag/update',
  dataCheck: profession => profession && profession.id,
  tasks: [
    'student/update_location_tag',
    // 'opportunity/update_profession',
  ],
}];
