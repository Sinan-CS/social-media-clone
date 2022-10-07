  const jwt = require("jsonwebtoken")
const { ExplainVerbosity } = require("mongoose/node_modules/mongodb")

exports.generateToken = (payload, expired) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: expired,
  });
};
