const mongoose = require('mongoose');
const validator = require('validator');
const Challenge = require('./challengeModel');

const interviewSchema = new mongoose.Schema({
  total_score: Number,
  minimum_admitted_score: Number,
  started_at: String,
  finish_at: String,
  video: String,
  badges: [String],
  interview_type: {
    type: String,
    enum: ['experience', 'technical', 'practical'],
    default: 'experience',
  },
  challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
});

interviewSchema.pre('findOneAndDelete', async function (next) {
  const interviewId = this.getQuery()._id;
  const interview = await this.model
    .findById(interviewId)
    .populate('challenges');

  if (interview && interview.challenges.length > 0) {
    const challengeIds = interview.challenges.map((challenge) => challenge._id);
    await Challenge.deleteMany({ _id: { $in: challengeIds } });
  }

  next();
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
