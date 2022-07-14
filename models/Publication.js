const moongose = require("mongoose");
const Schema = moongose.Schema;

const publicationSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },

  file: {
    type: String,
    trim: true,
    require: true,
  },

  typeFile: {
    type: String,
    trim: true,
  },

  createAt:{
      type: Date,
      default: Date.now()
  }
});



module.exports = moongose.model("Publication", publicationSchema);
