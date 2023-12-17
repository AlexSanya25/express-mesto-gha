const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const cardSchema = new mongoose.Schema(
  {
    name : {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30
    },
    link : {
      type: String,
      required: true
    },
    owner : {
      type: ObjectId,
      ref: 'user',
    },
    likes : [
      {
        type: ObjectId,
        default: []
      }
  ],
    createdAt : {
      type: Date,
      default: Date.now()
    }
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('card', cardSchema);