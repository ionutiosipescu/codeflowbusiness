const mongoose = require('mongoose');
const validator = require('validator');
const Interview = require('./interviewModel');
const Challenge = require('./challengeModel');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A candidate must have a name'],
    maxlength: [
      40,
      'A candidate name must have less or equal then 40 characters',
    ],
    minlength: [
      3,
      'A candidate name must have more or equal then 3 characters',
    ],
    validate: [
      validator.isAlpha,
      'Candidate name must only contain characters',
    ],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    unique: true,
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
  last_position: {
    type: String,
    maxlength: [35, 'A role must have less or equal then 35 characters'],
    minlength: [5, 'A role must have more or equal then 5 characters'],
  },
  last_company: {
    type: String,
    maxlength: [25, 'A company must have less or equal then 25 characters'],
    minlength: [3, 'A company must have more or equal then 3 characters'],
  },
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
  approve_offer: { type: Boolean, default: false },
  emails: {
    offer: { type: Boolean, default: false },
    decline: { type: Boolean, default: false },
    interview: { type: Boolean, default: false },
  },
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
