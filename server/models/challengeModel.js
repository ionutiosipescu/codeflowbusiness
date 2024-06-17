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

const challengeSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
    points: Number,
    receive: Number,
    minimum_admitted_points: Number,
    section: String,
    comments: [commentSchema],
    interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret.id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret.id;
        return ret;
      },
    },
  },
);

challengeSchema.statics.calcTotalScore = async function (interviewId) {
  const stats = await this.aggregate([
    {
      $match: { interview: interviewId },
    },
    {
      $group: {
        _id: '$interview',
        totalScore: { $sum: '$receive' },
        availablePoints: { $sum: '$points' },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Interview').findByIdAndUpdate(interviewId, {
      total_score: stats[0].totalScore,
      available_points: stats[0].availablePoints,
    });
  } else {
    await mongoose.model('Interview').findByIdAndUpdate(interviewId, {
      total_score: 0,
      available_points: 0,
    });
  }
};

challengeSchema.post('save', function () {
  this.constructor.calcTotalScore(this.interview);
});

challengeSchema.pre(/^findOneAnd/, async function (next) {
  this.challenge = await this.findOne();
  next();
});

challengeSchema.post(/^findOneAnd/, async function () {
  if (this.challenge) {
    await this.challenge.constructor.calcTotalScore(this.challenge.interview);
  }
});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
