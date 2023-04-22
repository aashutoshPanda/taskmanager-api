crypto = require("crypto");

const current_date = new Date().valueOf().toString();
const random = Math.random().toString();

const getId = () =>
  crypto
    .createHash("sha1")
    .update(current_date + random)
    .digest("hex");
module.exports = getId;
