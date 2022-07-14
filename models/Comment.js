const moongoose = require("mongoose");
const Schema = moongoose.Schema;

const commentSchema = new Schema({
  idPublication: {
    type: moongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Publication",
  },

  idUser: {
    type: moongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  comment: {
    type: String,
    trim: true,
    required: true,
  },

  createAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = moongoose.model("Comment", commentSchema);