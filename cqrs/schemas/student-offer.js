const models = require('../../../models');
const studentQuery = require('../query/student');

module.exports = {
  model: models.StudentOffer,
  cast: {
    basic: `{
      id,
      receiveDate,
      position,
      salary,
      type,
      material1,
      material2,
      isOpen,
      isSatisfied,
      notSatisfiedReason,
      referral,
      Student,
      Company,
      resume,
      Achievements,
    }`,
  },
  parts: {
    Student: {
      build: Student,
      extra: (offer) => {
        offer.resume = offer.Student.resume;
        delete offer.Student.resume;
      }
    },
    Company: {
      build: Company,
    },
    Achievements: {
      build: Achievements,
    },
  },
  indexes: [
    [{
      id: 1
    }, {
      unique: true
    }],
    [{
      'Student.id': 1
    }]
  ]
};


async function Student(offer) {
  const cast = `{
    id,
    name,
    school,
    highestDegree,
    productCategory,
    created_at,
    resume,
    Consultant: {
      id,
      name
    },
    School: {
      id,
      name,
      Country: {
        id,
        name,
      }
    },
    educationExperiences: {
      id,
      degree,
      startDate,
      school,
    }
  }`;
  const result = await studentQuery.getDetail(offer.studentId, cast);
  delete result._id;
  return result;
}

function Company(offer) {
  return models.Company.findOne({
    attributes: [
      'id',
      'name',
      'nameExtend',
      'industryId',
      'companyLabel'
    ],
    where: {
      enabled: 1,
    },
    include: [{
      model: models.CompanyAssociation,
      where: {
        entityId: offer.id,
        entityType: 'student_offer',
      }
    }, {
      model: models.Industry,
      as: 'industry',
      attributes: [
        'id',
        'name'
      ]
    }]
  });
}

async function Achievements(offer) {
  const achievements = (await models.sequelize.select(`
    SELECT
      (
        SELECT student_offer_id
        FROM student_offer
        WHERE student_id = ${offer.studentId}
          AND job_type = 'internship'
          AND student_offer_id <= ${offer.id}
        ORDER BY offer_receive_date asc
        LIMIT 1
      ) AS firstInternship,
      (
        SELECT student_offer_id
        FROM student_offer
        WHERE student_id = ${offer.studentId}
          AND job_type = 'full-time'
          AND student_offer_id <= ${offer.id}
        ORDER BY offer_receive_date asc
        LIMIT 1
      ) AS firstFullTime,
      (
        SELECT student_offer_id
        FROM student_offer
        WHERE student_id = ${offer.studentId}
          AND job_type = 'internship'
          AND student_offer_id <= ${offer.id}
          AND internal_referral = 1
        ORDER BY offer_receive_date asc
        LIMIT 1
      ) AS firstBDInternship,
      (
        SELECT student_offer_id
        FROM student_offer
        WHERE student_id = ${offer.studentId}
          AND job_type = 'full-time'
          AND student_offer_id <= ${offer.id}
          AND internal_referral = 1
        ORDER BY offer_receive_date asc
        LIMIT 1
      ) AS firstBDFullTime;
    `))[0];
  return achievements;
}
