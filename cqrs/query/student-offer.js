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
  let offer = await schemas.StudentOffer.find(id, {
    projection
  });
  if (!offer) {
    offer = await buildStudentView('createOrupdate', {
      id
    });
  }
  return offer;
}

async function getList(params, cast) {
  const projection = buildProjection(cast);
  let limit;
  const itemsPerPage = Number(params.itemsPerPage) || 20;
  const pageNum = Number(params.pageNum) || 1;
  if (!params.getAll) {
    limit = {
      skip: itemsPerPage * (pageNum - 1),
      limit: itemsPerPage
    };
  }
  const query = buildQuery(params);
  console.log(JSON.stringify(query));
  const offers = await schemas.StudentOffer.findAll(query, {
    projection,
    limit,
    order: {
      receiveDate: -1
    }
  });
  // console.log(offers);
  // console.timeEnd('findAAALALALAL');
  return {
    offers: offers.result,
    totalItems: offers.count,
    pageNum,
    itemsPerPage
  };
}

const selfFilters = [
  'type',
  'isOpen',
];

function buildQuery(params) {
  Object.keys(params).forEach((k) => {
    if (/^[0-9]+$/.test(params[k])) {
      params[k] = Number(params[k]);
    }
  });

  const {
    studentId,
    industryId,
    schoolId,
    consultantId,
    referralOnly,
    keyword,
    hasProof,
    receiveDateFrom,
    receiveDateTo,
    productCategory,
  } = params;
  const query = {
    $and: []
  };
  selfFilters.forEach((k) => {
    if (params[k]) {
      query[k] = params[k];
    }
  });

  if (referralOnly) {
    query.referral = {
      $gte: 1,
    };
  }

  if (industryId) {
    query['Company.industry.id'] = industryId;
  }

  if (schoolId) {
    query.$and.push({
      $or: [{
          'Student.School.id': schoolId
        },
        {
          'Student.educationExperiences.schoolId': schoolId
        },
      ]
    });
  }
  if (keyword) {
    const reg = new RegExp(keyword, 'i');
    query.$and.push({
      $or: [{
        position: reg
      }, {
        'Company.name': reg
      }, {
        'Company.nameExtend': reg
      }]
    });
  }
  if (hasProof) {
    query.material2 = {
      $ne: null
    };
  }
  if (studentId) {
    query['Student.id'] = studentId;
  }
  if (consultantId) {
    query['Student.Consultant.id'] = consultantId;
  }


  if (receiveDateFrom && receiveDateTo) {
    query.receiveDate = {
      $gte: new Date(receiveDateFrom),
      $lte: new Date(receiveDateTo),
    };
  } else if (receiveDateFrom) {
    query.receiveDate = {
      $gte: new Date(receiveDateFrom),
    };
  } else if (receiveDateTo) {
    query.receiveDate = {
      $lte: new Date(receiveDateTo),
    };
  }

  if (productCategory) {
    query['Student.productCategory'] = productCategory;
  }

  if (!query.$and.length) {
    delete query.$and;
  }
  return query;
}
