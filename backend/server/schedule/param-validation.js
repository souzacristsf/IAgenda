const Joi = require('joi');

module.exports = {
  // POST /api/schedule
  create: {
    body: {
      name: Joi.string().required(),
      event: Joi.array().allow(null),
      shared_user_id: Joi.array().allow(null)
    }
  }
};
