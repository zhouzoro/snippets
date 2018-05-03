const Schema = require('../lib/schema');
const MI = require('../../../utils/module-iterator');

const schemas = {};

setTimeout(() =>
  MI(__dirname, (file) => {
    try {
      const config = require(file);
      schemas[config.model.name] = new Schema(config);
    } catch (e) {
      console.error(e);
    }
  }), 10);

module.exports = schemas;
