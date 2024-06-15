const mongoose = require('mongoose');
const validator = require('validator');

const replySchema = new mongoose.Schema({
  reply: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const commentSchema = new mongoose.Schema({
  comment: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  replies: [replySchema],
});

const challengeSchema = new mongoose.Schema({
  question: String,
  answer: String,
  points: Number,
  receive: Number,
  minimum_admitted_points: Number,
  section: String,
  comments: [commentSchema],
  interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' },
});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
