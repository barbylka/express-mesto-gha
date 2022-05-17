const urlRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const DUPLICATE_MONGOOSE_ERROR = 11000;
const SALT_ROUNDS = 10;

module.exports = {
  urlRegEx,
  DUPLICATE_MONGOOSE_ERROR,
  SALT_ROUNDS
};
