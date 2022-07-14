const moongose = require("mongoose");
const Schema = moongose.Schema;

const LikesSchema = new Schema({
  idPublication: {
    type: moongose.Schema.Types.ObjectId,
    required: true,
    ref: "Publication",
  },

  idUser: {
    type: moongose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});





module.exports = moongose.model("Likes", LikesSchema);
