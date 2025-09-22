const jwt = require('jsonwebtoken');

const signJwt = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyJwt = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = { signJwt, verifyJwt };
