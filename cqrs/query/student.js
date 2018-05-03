module.exports = {
  getDetail,
  getList,
};

const schemas = require('../schemas');
const {
  buildProjection
} = require('../../../utils/object-tailor');
const buildStudentView = require('../view-builders/student');


async function getDetail(id, cast) {
  const projection = buildProjection(cast);
  let student = await schemas.Student.find(id, {
    projection
  });
  if (!student) {
    student = await buildStudentView('createOrupdate', {
      id
    });
  }
  return student;
}

async function getList(params, cast) {
  const projection = buildProjection(cast);
  const itemsPerPage = Number(params.itemsPerPage) || 20;
  const pageNum = Number(params.pageNum) || 1;
  const limit = {
    skip: itemsPerPage * (pageNum - 1),
    limit: itemsPerPage
  };
  const query = buildQuery(params);
  const students = await schemas.Student.findAll(query, {
    projection,
    limit,
    order: {
      id: -1
    }
  });

  return {
    students: students.result,
    totalItems: students.count,
    pageNum,
    itemsPerPage
  };
}

const selfFilters = [
  'scheduleStatus',
  'productCategory',
  'openid',
  'gender',
];

function buildQuery(params) {
  Object.keys(params).forEach((k) => {
    if (/^[0-9]+$/.test(params[k])) {
      params[k] = Number(params[k]);
    }
  });

  const {
    keyword, // name/email/mobile/targetLocation
    keyword2, // name/industry/profession
    targetTagId,
    gradDateFrom,
    gradDateTo,
    serviceStatus,
    isMine,
    studentIds,
    consultantId,
    userId,
    schoolId,
    is985,
    is211,
    QS50,
    QS100,
    degree,
  } = params;
  const query = {
    $and: []
  };
  selfFilters.forEach((k) => {
    if (params[k]) {
      query[k] = params[k];
    }
  });

  if (studentIds) {
    query.id = {
      $in: studentIds
    };
  }

  if (isMine === 2) {
    query['Sharers.id'] = userId;
  } else if (isMine === 3) {
    query.consultant_id = userId;
    query['Sharers.id'] = {
      $gt: 0
    };
  } else if (userId) {
    query.$and.push({
      $or: [{
          consultant_id: userId
        },
        {
          consultant_id: null
        },
      ]
    });
  }

  if (consultantId) {
    query.consultant_id = consultantId;
  }

  if (!serviceStatus) {
    query.serviceStatus = {
      $ne: 'contract_finish',
    };
  } else if (serviceStatus !== 'all') {
    query.serviceStatus = serviceStatus;
  }

  if (keyword) {
    const reg = new RegExp(keyword, 'i');
    query.$and.push({
      $or: [{
        name: reg
      }, {
        mobile: reg
      }, {
        email: reg
      }, {
        'targetLocations.name': reg
      }]
    });
  }

  if (keyword2) {
    const reg = new RegExp(keyword2, 'i');
    query.$and.push({
      $or: [{
        name: reg
      }, {
        'professions.name': reg
      }, {
        'industries.name': reg
      }]
    });
  }

  if (gradDateFrom && gradDateTo) {
    query.graduateDate = {
      $gte: new Date(gradDateFrom),
      $lte: new Date(gradDateTo),
    };
  } else if (gradDateFrom) {
    query.graduateDate = {
      $gte: new Date(gradDateFrom),
    };
  } else if (gradDateTo) {
    query.graduateDate = {
      $lte: new Date(gradDateTo),
    };
  }

  if (targetTagId) {
    query.$and.push({
      $or: [{
          'professions.id': targetTagId
        },
        {
          'industries.id': targetTagId
        },
      ]
    });
  }


  if (degree === '硕士') {
    query.highestDegree = {
      $in: ['硕士', '博士', 'MBA'],
    };
  } else if (degree === 'MBA' || degree === '博士') {
    query.highestDegree = degree;
  }

  if (schoolId) {
    query.$and.push({
      $or: [{
          'School.id': schoolId
        },
        {
          'educationExperiences.schoolId': schoolId
        },
      ]
    });
  } else {
    let $or = [];
    if (Number(is985)) {
      $or = $or.concat([{
        'School.is985': true
      }, {
        'educationExperiences.school.is985': true
      }]);
    }
    if (Number(is211)) {
      $or = $or.concat([{
        'School.is211': true
      }, {
        'educationExperiences.school.is211': true
      }]);
    }
    if (Number(QS100)) {
      $or = $or.concat([{
        'School.worldRanking': {
          $lte: 100
        }
      }, {
        'educationExperiences.school.worldRanking': {
          $lte: 100
        }
      }]);
    } else if (Number(QS50)) {
      $or = $or.concat([{
        'School.worldRanking': {
          $lte: 50
        }
      }, {
        'educationExperiences.school.worldRanking': {
          $lte: 50
        }
      }]);
    }
    if ($or.length) {
      query.$and.push({
        $or
      });
    }
  }
  if (!query.$and.length) {
    delete query.$and;
  }
  return query;
}
