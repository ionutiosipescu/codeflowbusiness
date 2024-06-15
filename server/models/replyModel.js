const mongoose = require('mongoose');
const validator = require('validator');

const replySchema = new mongoose.Schema({
  reply: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
