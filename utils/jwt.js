const jwt = require("jsonwebtoken");
const auth = require("../config/auth");
const secret = auth.jwtSecret;

const generateToken = async ({ id, email, role }) => {
  const token = await jwt.sign({ id, email, role }, secret);

  return token;
};

module.exports = { generateToken };
