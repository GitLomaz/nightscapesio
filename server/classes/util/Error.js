// NEEDS GENERIC ERROR MESSAGES
const errors = {
  ER_DUP_ENTRYA: "Username Taken",
  ER_DUP_ENTRYC: "Character name Taken",
  shortPW: "Password is too short",
};

module.exports = {
  error: function (errorObj, override = "") {
    if (!errors[errorObj.code + override]) {
      return "Server error: please try again later";
    } else {
      return errors[errorObj.code + override];
    }
  },
};
