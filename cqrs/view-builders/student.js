const models = require('../../../models');
const schemas = require('../schemas');
const eventHost = require('../event-host');

const {
  objToMongoP
} = require('../../../utils/object-tailor');

module.exports = (taskType, data) => buildStudentView(taskType, data)
  .then((updated) => {
    // console.log('updatedupdatedupdatedupdated', updated);
    for (const one of [].concat(updated)) {
      eventHost.trigger('student/update_complete', one);
    }
  })
  .catch((e) => {
    console.error(e);
    return Promise.reject(e);
  });

if (require.main === module) {
  updateAll();
}

function buildStudentView(taskType, data) {
  switch (taskType) {
    case 'createOrupdate':
      return createOrupdate(data);
    case 'update_consultant_info':
      return updateConsultant(data);
    case 'update_school':
      return updateSchool(data);
    case 'merge_school':
      return mergeSchool(data);
      case 'update_industry':
        return updateIndustryName(data);
      case 'update_profession':
        return updateProfessionName(data);
    case 'update_location_tag':
      return updateLocationName(data);
    case 'update_statistics':
      return updatePart(data.id, 'Statistics');
    case 'update_activity':
      return updatePart(data.id, 'activityStats');
    case 'update_education_experience':
      return updatePart(data.id, 'educationExperiences');
    case 'update_consultant':
      return updatePart(data.id, 'Consultant');
    case 'update_sharers':
      return updatePart(data.id, 'Sharers');
    case 'update_all':
      return updateAll();
    default:
      console.error('taskType not found in buildStudentView', taskType, data);
      return Promise.reject('taskType not found in buildStudentView');
  }
}

// test()

async function test() {
  console.time('build');
  const r = await createOrupdate({
    studentId: 1189
  });
  console.timeEnd('build');
  console.time('update school');
  await schemas.Student.updatePart(1189, 'School');
  console.timeEnd('update school');

  console.time('find one project');
  const student = await schemas.Student.find(r.id);
  console.timeEnd('find one project');
  console.log(student);
  process.exit();
}

async function updateAll() {
  const students = await models.Student.findAll({
    attributes: ['id'],
    order: ['id']
  });
  for (const s of students) {
    await buildStudentView('createOrupdate', {
      id: s.id
    });
    console.log('build student complete: ', s.id);
  }
  return students.map(s => ({
    id: s.id
  }));
}

async function createOrupdate({
  id
}) {
  // console.log('createOrupdatecreateOrupdate');
  const student = await schemas.Student.build(id);
  // console.log('studentstudentstudentstudent', student);
  await schemas.Student.update(id, student);
  return {
    id
  };
}

async function updatePart(id, key) {
  // console.log('updatePart(id, key)', id, key);
  await schemas.Student.updatePart(Number(id), key);
  return {
    id
  };
}

async function updateSchool(school, schoolId) {
  school.id = Number(school.id);
  const $set = objToMongoP(school, 'School.');
  if (school.name) {
    $set.school = school.name;
  }

  return schemas.Student.findAndUpdate({
    'School.id': schoolId || school.id
  }, $set);
}

async function updateEduExpSchool(school, schoolId) {
  school.id = Number(school.id);
  const $set = objToMongoP(school, 'educationExperiences.$.school.');
  $set['educationExperiences.$.schoolId'] = school.id;
  return schemas.Student.findAndUpdate({
    'educationExperiences.school.id': schoolId || school.id
  }, $set);
}

async function mergeSchool({
  fromId,
  to
}) {
  const result1 = await updateSchool(to, fromId);
  const result2 = await updateEduExpSchool(to, fromId);
  return result1.concat(result2);
}

async function updateConsultant(Consultant) {
  Consultant.id = Number(Consultant.id);
  const $set = objToMongoP(Consultant, 'Consultant.');
  return schemas.Student.findAndUpdate({
    'Consultant.id': Consultant.id
  }, $set);
}

async function updateIndustryName(industry) {
  industry.id = Number(industry.id);
  return schemas.Student.findAndUpdate({
    'industries.id': industry.id
  }, {
    'industries.$.name': industry.name
  });
}

async function updateProfessionName(profession) {
  profession.id = Number(profession.id);
  return schemas.Student.findAndUpdate({
    'professions.id': profession.id
  }, {
    'professions.$.name': profession.name
  });
}

async function updateLocationName(locationTag) {
  locationTag.id = Number(locationTag.id);
  const updated1 = await schemas.Student.findAndUpdate({
    'targetLocations.id': locationTag.id
  }, {
    'targetLocations.$.name': locationTag.name
  });
  // updateCurrentLocationName
  const updated2 = await schemas.Student.findAndUpdate({
    'currentLocationTag.id': locationTag.id
  }, {
    currentLocation: locationTag.name,
    'currentLocationTag.name': locationTag.name
  });

  return updated1.concat(updated2);
}
