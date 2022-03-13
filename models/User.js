const moongose = require("mongoose");
const Shema = moongose.Schema;

const UserSchema = new Shema({
  name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  avatar: {
    type: String,
    trim: true,
  },

  siteWeb: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  createAdd: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = moongose.model("User", UserSchema);
