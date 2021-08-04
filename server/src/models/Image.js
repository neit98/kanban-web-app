const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
  {
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('images', ImageSchema);
