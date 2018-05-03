const db = require('../mongodb');
const {
  buildProjection,
  objToMongoP,
} = require('../../../utils/object-tailor');

module.exports = Schema;

function Schema({
  model,
  cast,
  parts,
  indexes,
}) {
  if (!model) {
    throw new Error('schema must provide \'model\'');
  }
  if (!cast || !cast.basic) {
    throw new Error('schema must provide \'cast.basic\'');
  }
  this.model = model;
  this.parts = parts || {};

  cast.basic = buildProjection(cast.basic);
  if (cast.detail) {
    cast.detail = buildProjection(cast.detail);
  }
  this.cast = cast;
  this.cast.parts = buildProjectionParts(parts);
  this.defaultProjection = buildDefaultProjection(this.cast);

  this.db = db.get(this.model.name);

  this.build = build;
  this.find = find;
  this.update = update;
  this.findAndUpdate = findAndUpdate;
  this.updatePart = updatePart;
  this.findUsingCursor = findUsingCursor;
  this.findAll = findAll;

  if (Array.isArray(indexes)) {
    indexes.forEach(i => this.db.createIndex(...i));
  }
}

async function build(id) {
  const doc = (await this.model.findById(id)).toJSON();
  await Promise.all(
    Object.keys(this.parts).map(k => buildPart(k, doc, this.parts))
  );
  return doc;
}

async function buildPart(key, doc, parts) {
  const part = parts[key];
  let result = await part.build(doc);
  if (result && result.toJSON) {
    result = result.toJSON();
  }
  if (Array.isArray(result)) {
    result = result.map(r => (r.toJSON ? r.toJSON() : r));
  }
  doc[key] = result;
  // console.log('doc[key] = result;', key, result);
  // console.log('doc[key] = result;', doc);
  if (part.extra) {
    await part.extra(doc);
  }
}


async function findAndUpdate(query, $set, projection = '{id}') {
  const updated = await this.db.find(query, buildProjection(projection));
  await this.db.update(query, {
    $set
  }, {
    multi: true
  });
  return updated;
}


async function find(id, {
  raw,
  projection,
} = {}) {
  if (raw) {
    return this.db.findOne({
      id: Number(id)
    });
  }
  return this.findUsingCursor({
    id: Number(id)
  }, {
    projection: projection || this.defaultProjection.detail,
    limit: {
      limit: 1
    },
  });
}

async function findAll(query, {
  projection,
  order,
  limit,
} = {}) {
  return this.findUsingCursor(query, {
    projection: projection || this.defaultProjection.basic,
    order,
    limit,
    count: 1
  });
}

function update(id, doc) {
  return this.db.update({
    id: Number(id)
  }, {
    $set: doc
  }, {
    upsert: true
  });
}

async function updatePart(id, key) {
  let doc = (await this.model.findById(id)).toJSON();
  if (key) {
    await buildPart(key, doc, this.parts);
    doc = objToMongoP(doc);
  } else {
    doc = await this.build(id);
  }
  // console.log('updatePart(id, key)', id, key);
  // console.log('doc', doc);
  await this.db.update({
    id
  }, {
    $set: doc
  });
  return doc;
}

function findUsingCursor(query, {
  projection,
  order,
  limit,
  count
}) {
  return this.db.find(query, {
      rawCursor: true
    })
    .then(async(cursor) => {
      if (limit) {
        cursor.skip(limit.skip || 0).limit(limit.limit);
      }
      if (projection) {
        cursor.project(projection);
      }
      if (order) {
        cursor.sort(order);
      }

      const result = await cursor.toArray();
      if (limit && limit.limit === 1) {
        return result[0];
      }
      if (count) {
        return {
          result,
          count: await cursor.count(),
        };
      }
      return result;
    });
}

function buildProjectionParts(parts) {
  const cast = {};
  Object.keys(parts).forEach((k) => {
    if (!parts[k].format) {
      cast[k] = 1;
    } else {
      Object.assign(cast, buildProjection(parts[k].format, `${k}.`));
    }
  });
  return cast;
}

function buildDefaultProjection(cast) {
  Object.keys(cast.basic).forEach((k) => {
    cast.basic[k] = cast.parts[k] || 1;
  });
  cast.detail = cast.detail || {};
  Object.keys(cast.detail).forEach((k) => {
    cast.detail[k] = cast.parts[k] || 1;
  });
  return {
    basic: Object.assign({}, cast.basic),
    detail: Object.assign({}, cast.basic, cast.detail),
  };
}
