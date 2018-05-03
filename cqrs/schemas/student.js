const moment = require('moment');
const models = require('../../../models');

module.exports = {
  model: models.Student,
  cast: {
    basic: `{
      id,
      name,
      serviceStatus,
      scheduleStatus,
      referralStatus,
      inviteSent,
      scheduleStartdate,
      email,
      gender,
      censusRegister,
      prefix_id,
      prefix_value,
      mobile,
      wechat,
      openid,
      password,
      graduateDate,
      school,
      School,
      major,
      highestDegree,
      consultant_id,
      productCategory,
      extraDemand,
      infoConfirmed,
      targetCompany,
      currentLocation,
      created_at,
      resume,
      professions,
      industries,
      Consultant,
      targetLocations,
      currentLocationTag,
    }`,
    detail: `{
      portrait,
      experiences,
      purchased,
      currentLocationId,
      paymentAmount,
      contractEndDate,
      comment,
      created_by,
      updated_by,
      updated_at,
      privateScheduleGranted,
      acceptInternOpp,
      acceptFulltimeOpp,
      attachments,
      Sharers,
      Statistics,
      educationExperiences,
      activityStats,
    }`
  },
  parts: {
    School: {
      build: School,
      format: `{
        id,
        name,
        level
      }`,
      extra: (student) => {
        student.school = student.School && student.School.name;
      }
    },
    educationExperiences: {
      build: educationExperiences,
      format: `{
          id,
          major,
          degree,
          school,
          startDate,
          endDate,
        }`,
    },
    professions: {
      build: professions,
      format: `{
        id,
        name,
        EntityProfession: {
          id,
          priority
        }
      }`,
    },
    industries: {
      build: industries,
      format: `{
        id,
        name,
        EntityIndustry: {
          id,
          priority
        }
      }`,
    },
    Consultant: {
      build: Consultant,
      format: `{
        id,
        name,
        email,
        prefix_value,
        mobile,
        Role: {
          id,
          name,
          department,
          titleCn,
          titleEn,
        },
      }`,
    },
    targetLocations: {
      build: targetLocations,
      format: `{
        id,
        name,
        StudentTargetLocationTag: {
          id
        }
      }`,
    },
    currentLocationTag: {
      build: currentLocationTag,
      format: `{
        id,
        name
      }`,
      extra: (student) => {
        student.currentLocation = student.currentLocationTag && student.currentLocationTag.name;
      }
    },
    attachments: {
      build: attachments,
      extra: (student) => {
        student.resume = student.attachments.sort((a, b) => (b.createdAt > a.createdAt) * 1)
          .find(a => a.type === 'resume');
      }
    },
    Sharers: {
      build: Sharers,
      format: `{
        id,
        name
      }`,
    },
    Statistics: {
      build: Statistics,
    },
    activityStats: {
      build: activityStats,
    },
  },
  indexes: [
    [{
      id: 1
    }, {
      unique: true
    }],
    [{
      consultant_id: 1
    }]
  ]
};

async function activityStats(student) {
  return (await models.sequelize.select(`
    SELECT
      student_id AS id,
      MAX(created_at) AS lastVisitAt,
      SUM(IF(resource_type = 'material' AND usage_type = 'view', 1, 0)) AS materialViewCount,
      SUM(IF(resource_type = 'opportunity' AND usage_type = 'view', 1, 0)) AS opoortunityViewCount,
      SUM(IF(resource_type = 'referral' AND usage_type = 'view', 1, 0)) AS referralViewCount,
      SUM(IF(resource_type = 'referral' AND usage_type = 'apply', 1, 0)) AS referralApplyCount
    FROM student_activity
    WHERE student_id = (${student.id})
    GROUP BY student_id
`))[0];
}

function School(student) {
  return models.School.findOne({
    where: {
      enabled: 1,
    },
    include: [{
      model: models.SchoolAssociation,
      where: {
        entityId: student.id,
        entityType: 'student',
      }
    }, {
      model: models.Country,
    }]
  });
}

async function educationExperiences(student) {
  const edus = await models.EducationExperience.findAll({
    as: 'educationExperiences',
    where: {
      studentId: student.id,
      enabled: 1,
    },
    include: [{
      model: models.School,
      as: 'schools',
    }]
  });

  return edus.map((e) => {
    const edu = e.toJSON();
    edu.School = edu.schools[0];
    // console.log('edu.Schooledu.Schooledu.School', edu.School);
    edu.school = edu.School && edu.School.name;
    delete edu.schools;
    return edu;
  });
}

function professions(student) {
  return models.Profession.findAll({
    where: {
      enabled: 1,
    },
    include: [{
      model: models.EntityProfession,
      where: {
        entityId: student.id,
        entityType: 'student',
      }
    }]
  });
}

function industries(student) {
  return models.Industry.findAll({
    where: {
      enabled: 1,
    },
    include: [{
      model: models.EntityIndustry,
      where: {
        entityId: student.id,
        entityType: 'student',
      }
    }]
  });
}

function Consultant(student) {
  return models.Member.findOne({
    where: {
      id: student.consultant_id
    },
    include: {
      model: models.Role,
    },
  });
}

function targetLocations(student) {
  return models.LocationTag.findAll({
    where: {
      enabled: 1,
    },
    include: {
      model: models.StudentTargetLocationTag,
      where: {
        studentId: student.id
      },
    },
  });
}

function currentLocationTag(student) {
  return models.LocationTag.findOne({
    where: {
      id: student.currentLocationId,
      enabled: 1,
    },
  });
}

function attachments(student) {
  return models.StudentAttachment.findAll({
    where: {
      studentId: student.id,
      enabled: 1,
    },
  });
}

function Sharers(student) {
  return models.Member.findAll({
    where: {
      enabled: 1,
    },
    include: {
      model: models.StudentShare,
      where: {
        studentId: student.id,
      },
    }
  });
}

async function Statistics(student) {
  const s = {};
  Object.assign(s, await getPrivateScheduleTotal(student.id));
  Object.assign(s, (await getLastContact(student.id))[0]);
  Object.assign(s, (await getTotalCourses(student.id))[0]);
  Object.assign(s, (await getScheduleCounts(student.id))[0]);
  Object.assign(s, (await getFinishCounts(student.id))[0]);
  Object.assign(s, (await getAbsentCounts(student.id))[0]);

  const now = moment();
  if (s.lastScheduleDate) {
    s.lastScheduleDate = now.diff(moment(new Date(s.lastScheduleDate)),
      'days');
    s.lastScheduleDate = s.lastScheduleDate < 0 ? 0 : s.lastScheduleDate;
  } else {
    s.lastScheduleDate = 0;
  }
  s.totalcourses = s.totalcourses || 0;
  s.leaveCount = s.leaveCount || 0;
  s.attended = s.attended || 0;
  s.absentCount = s.absentCount || 0;
  return s;
}

async function getPrivateScheduleTotal(studentId) {
  let {
    psTotal
  } = (await models.sequelize.select(
    `select sum(duration) as psTotal from private_schedule where student_id = ${studentId} and enabled=1;`))[0];
  if (psTotal) psTotal /= 60;
  return {
    psTotal
  };
}

function getTotalCourses(studentId) {
  return models.sequelize.select(
    `
     SELECT
       sc.student_id AS id,
       COUNT(c.course_id) AS totalcourses
     FROM
       student_course sc
     INNER JOIN course c ON sc.course_id = c.course_id AND c.course_enabled = 1
     WHERE
         sc.student_id = ${studentId}
     GROUP BY sc.student_id
     `);
}

function getLastContact(studentId) {
  return models.sequelize.select(
    `
     SELECT
       student_id AS id,
       MAX(created_at) AS lastContact
     FROM
       student_followup sf
     WHERE
         student_id = ${studentId}
     GROUP BY student_id
     `);
}

function getScheduleCounts(studentId) {
  return models.sequelize.select(
    `
     SELECT
       sls.student_id AS id,
       MAX(ls.start_time) AS lastScheduleDate,
       SUM(IF(sls.status = 'leave', 1, 0)) AS leaveCount
     FROM
       student_lesson_schedule sls
     INNER JOIN lesson_schedule ls ON sls.lesson_schedule_id = ls.id
     INNER JOIN standard_schedule ss ON ss.lesson_schedule_id = ls.id
     INNER JOIN course c ON ss.course_id = c.course_id AND c.course_enabled = 1
     WHERE
       sls.student_id = ${studentId}
         AND ss.enabled = 1
     GROUP BY sls.student_id
     `);
}

function getFinishCounts(studentId) {
  return models.sequelize.select(
    `
     SELECT
       sls.student_id AS id,
       COUNT(DISTINCT c.course_id) AS attended
     FROM
       student_lesson_schedule sls
     INNER JOIN lesson_schedule ls ON sls.lesson_schedule_id = ls.id
     INNER JOIN standard_schedule ss ON ss.lesson_schedule_id = ls.id
     INNER JOIN course c ON ss.course_id = c.course_id AND c.course_enabled = 1
     WHERE
       sls.student_id = ${studentId}
         AND ss.enabled = 1
         AND sls.status = 'finish'
     GROUP BY sls.student_id
     `);
}

function getAbsentCounts(studentId) {
  return models.sequelize.select(
    `
     SELECT
       sls.student_id AS id,
       COUNT(DISTINCT c.course_id) AS absentCount
     FROM
       student_lesson_schedule sls
     INNER JOIN lesson_schedule ls ON sls.lesson_schedule_id = ls.id
     INNER JOIN standard_schedule ss ON ss.lesson_schedule_id = ls.id
     INNER JOIN course c ON ss.course_id = c.course_id AND c.course_enabled = 1
     WHERE
       sls.student_id = ${studentId}
         AND ss.enabled = 1
         AND sls.status = 'absent'
         AND (sls.student_id, c.course_id) NOT IN (
           SELECT
             sls1.student_id,
             c1.course_id
           FROM
             student_lesson_schedule sls1
           INNER JOIN lesson_schedule ls1 ON sls1.lesson_schedule_id = ls1.id
           INNER JOIN standard_schedule ss1 ON ss1.lesson_schedule_id = ls1.id
           INNER JOIN course c1 ON ss1.course_id = c1.course_id AND c1.course_enabled = 1
           WHERE
             sls1.student_id = ${studentId}
               AND ss1.enabled = 1
               AND sls1.status = 'finish'
         )
     GROUP BY sls.student_id
     `);
}
