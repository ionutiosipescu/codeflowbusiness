const mongoose = require('mongoose');
const Challenge = require('./challengeModel');

const interviewSchema = new mongoose.Schema(
  {
    total_score: { type: Number, default: 0 },
    available_points: { type: Number, default: 0 },
    minimum_admitted_score: Number,
    started_at: String,
    finish_at: String,
    video: String,
    badges: [String],
    interview_type: {
      type: String,
      enum: ['experience', 'technical', 'practical'],
      default: 'experience',
      required: [true, 'Please provide a interview type'],
    },
    challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
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

interviewSchema.statics.calcCandidateScores = async function (candidateId) {
  const stats = await this.aggregate([
    {
      $match: { candidate: candidateId },
    },
    {
      $group: {
        _id: '$candidate',
        totalScore: { $sum: '$total_score' },
        availablePoints: { $sum: '$available_points' },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Candidate').findByIdAndUpdate(candidateId, {
      total_score: stats[0].totalScore,
      available_points: stats[0].availablePoints,
    });
  } else {
    await mongoose.model('Candidate').findByIdAndUpdate(candidateId, {
      total_score: 0,
      available_points: 0,
    });
  }
};

interviewSchema.post('save', function () {
  this.constructor.calcCandidateScores(this.candidate);
});

interviewSchema.pre(/^findOneAnd/, async function (next) {
  this.interview = await this.findOne();
  next();
});

interviewSchema.post(/^findOneAnd/, async function () {
  if (this.interview) {
    await this.interview.constructor.calcCandidateScores(
      this.interview.candidate,
    );
  }
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
