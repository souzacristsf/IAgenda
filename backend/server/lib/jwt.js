const jwt = require('jsonwebtoken');
const { tokenMsg } = require('../errors/system');
const config = require('../../config/express');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
// import { AuthService as Service } from 'service';

const JWT_SECRET = config.jwtSecret || '!@#$%^&^72DReq$8$^&5WSvcEPZX^&';

const validateToken = ({ authorization }) =>
  new Promise((resolve, reject) => {
    if (!authorization || authorization === undefined) {
      reject(new APIError(tokenMsg.authenticate, httpStatus.UNAUTHORIZED, true));
    }
    const parts = authorization.split(' ');
    const token = parts[1];  // eslint-disable-line new-cap
    const scheme = parts[0];
    if (!parts.length === 2) throw tokenMsg.isInvalid;

    if (!/^Bearer$/i.test(scheme)) {
      reject(new APIError(tokenMsg.malFormatted, httpStatus.UNAUTHORIZED, true));
    }

    return jwt.verify(token, JWT_SECRET, (err, { data }) => {
    // const isTokenDB = Service.findByOneField('token', { id: data.id });

      if (err) throw new APIError(tokenMsg.expired, httpStatus.UNAUTHORIZED, true);
    // return isTokenDB
    //   .then((token) => {
    //     if (!token) {
    //       throw new APIError(JSON.stringify(tokenMsg.notToken), httpStatus.UNAUTHORIZED, true);
    //     }
      // console.log('Entrou em lib/jwt.js em validateToken: ', data);
      resolve(data);
    // });
    });
  });

const sign = ({ email, username, _id }) =>
  // console.log('entrou no sign em lib/jwt.js');
   jwt.sign({
     data: { email, username, _id }
   }, JWT_SECRET, { expiresIn: '7d' });

module.exports = {
  validateToken,
  sign
};
