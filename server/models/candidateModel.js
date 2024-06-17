const mongoose = require('mongoose');
const validator = require('validator');
const Interview = require('./interviewModel');
const Challenge = require('./challengeModel');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  age: Number,
  date_of_birth: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
    maxlength: [40, 'A address must have less or equal then 40 characters'],
    minlength: [5, 'A address must have more or equal then 5 characters'],
  },
  profile_picture: {
    type: String,
    default: 'default.jpg',
  },
  experience: Number,
  last_position: String,
  last_company: String,
  rate: {
    type: Number,
    required: true,
  },
  interviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }],
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  total_score: { type: Number, default: 0 },
  available_points: { type: Number, default: 0 },
});

// Delete Candidate and All Related Interviews & Challenges
candidateSchema.pre('findOneAndDelete', async function (next) {
  const candidateId = this.getQuery()._id;
  const candidate = await this.model
    .findById(candidateId)
    .populate('interviews');

  if (candidate && candidate.interviews.length > 0) {
    const interviewIds = candidate.interviews.map((interview) => interview._id);
    const challengeIds = candidate.interviews.flatMap(
      (interview) => interview.challenges,
    );

    await Challenge.deleteMany({ _id: { $in: challengeIds } });
    await Interview.deleteMany({ _id: { $in: interviewIds } });
  }

  next();
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
