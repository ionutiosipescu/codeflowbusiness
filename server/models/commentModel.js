const mongoose = require('mongoose');
const validator = require('validator');

const commentSchema = new mongoose.Schema({
  comment: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
});
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
