module.exports = buildOpportunityView;


function sleep(t) {
  return new Promise(res => setTimeout(res, t));
}

function buildOpportunityView(taskType, data) {
  switch (taskType) {
    case 'create':
      return create(data);
    case 'update_industry':
      return updateIndustry(data);
    default:
      return Promise.reject('taskType not found in buildOpportunityView');
  }
}

function getOpportunity(id) {
  // return db.findById(id);
}

function create({
  opportunityId,
}) {
  console.log('opportunity created: ', opportunityId);
}

function updateIndustry({
  industryId,
}) {
  console.log('opportunity updateIndustry: ', industryId);
}
