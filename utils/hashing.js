const bcrypt = require("bcrypt");
const { createHmac } = require("crypto");

const doHash = (value, saltValue) => {
  const result = bcrypt.hash(value, saltValue);
  return result;
};

const doHashValidation = (value, hashedValue) => {
  const result = bcrypt.compare(value, hashedValue);
  return result;
};

const hmacProcess = (value, key) => {
  const result = createHmac("sha256", key).update(value).digest("hex");
  return result;
};

module.exports = { doHash, doHashValidation, hmacProcess };
