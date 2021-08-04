const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxLength: 150,
    },
    type: {
      type: String,
      required: true,
      enum: ['TODO', 'IN PROGRESS', 'COMPLETED'],
    },
    tag: {
      type: Schema.Types.ObjectId,
      ref: 'tags',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  { timestamps: true }
);

// TaskSchema.methods.toJSON = function () {
//   const task = this;
//   const taskObject = task.toObject();

//   delete taskObject.user

//   return taskObject
// }

module.exports = mongoose.model('tasks', TaskSchema);
