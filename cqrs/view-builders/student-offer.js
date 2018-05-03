const models = require('../../../models');
const schemas = require('../schemas');

const {
  objToMongoP
} = require('../../../utils/object-tailor');

module.exports = (taskType, data) => buildStudentOfferView(taskType, data)
  .catch((e) => {
    console.error(e);
    return Promise.reject(e);
  });

if (require.main === module) {
  buildStudentOfferView('update_all');
  // test().catch(console.error);
}

function buildStudentOfferView(taskType, data) {
  switch (taskType) {
    case 'createOrupdate':
      return createOrupdate(data);
    case 'update_student_info':
      return updateStudentInfo(data);
    case 'update_by_student':
      return updateStudentOffers(data);
    case 'update_all':
      return updateAll();
    default:
      console.error('taskType not found in buildStudentOfferView', taskType, data);
      return Promise.reject('taskType not found in buildStudentOfferView');
  }
}

// test()

async function test() {
  console.time('build');
  const r = await createOrupdate({
    id: 3655
  });
  console.log(r);
  console.timeEnd('build');
  // console.time('update school');
  // await StudentOffer.update(1189, 'School');
  // console.timeEnd('update school');
  //
  // console.time('find one project');
  // const student = await StudentOffer.find(r.id);
  // console.timeEnd('find one project');
  // console.log(student);
  process.exit();
}

async function updateAll() {
  const offers = await models.StudentOffer.findAll({
    attributes: ['id'],
    order: ['id'],
    // where: {
    //   id: 4333
    // }
  });
  for (const o of offers) {
    await buildStudentOfferView('createOrupdate', {
      id: o.id
    });
    console.log('buildStudentOfferView complete: ', o.id);
  }
}

async function createOrupdate({
  id
}) {
  const offer = await schemas.StudentOffer.build(id);
  // console.log('await schemas.StudentOffer.build(id)', offer);
  await schemas.StudentOffer.update(id, offer);
  return offer;
}

async function updateStudentInfo({
  id
}) {
  // console.log('updateStudentInfoupdateStudentInfo');
  const offers = (await schemas.StudentOffer.findAll({
    'Student.id': Number(id)
  }, {
    id: 1
  })).result;
  for (const o of offers) {
    await schemas.StudentOffer.updatePart(o.id, 'Student');
  }
}

async function updateStudentOffers({
  id,
}) {
  await schemas.StudentOffer.db.remove({
    'Student.id': Number(id)
  });
  const offers = await models.StudentOffer.findAll({
    attributes: ['id'],
    where: {
      studentId: Number(id)
    }
  });
  for (const o of offers) {
    try {
      await buildStudentOfferView('createOrupdate', {
        id: o.id
      });
    } catch (e) {
      console.error('buildStudentOfferView error: ', e);
    }
  }
}
