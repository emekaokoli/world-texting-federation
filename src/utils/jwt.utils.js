'use strict';
const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv').config();
const logger = require('consola');


const privateKey = process.env.ACCESSTOKEN_PRIVATE_KEY;
const publicKey = process.env.ACCESSTOKEN_PUBLIC_KEY;

const jwtSign = (payload) => {
  return jwt.sign(
    payload,
    privateKey,
    { algorithm: 'RS256' }
  );
}

const jwtVerify = (token) => {
  try {
    const decoded = jwt.verify(token, publicKey, { algorithm: 'RS256' });
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error) {
     logger.info(error.message);
     return {
       valid: false,
       expired: error.message === 'jwt expired',
       decoded: null,
     };
  }
}

module.exports = {
  jwtSign,
  jwtVerify,
};