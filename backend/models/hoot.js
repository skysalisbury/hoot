const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    text: { type: String, required: true },
    author: { 
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const hootSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true},
    category: { type: String, required: true, enum:
     ['News', 'Sports', 'Games', 'Movies', 'Music', 'Television']},
    author: { 
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    comments: [commentSchema],
  },

  {
    timestamps: true,
  }
);


// module.exports = mongoose.model('Comment', commentSchema);
module.exports = mongoose.model('Hoot', hootSchema);