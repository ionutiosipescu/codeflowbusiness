const Challenge = require('./../models/challengeModel');
const APIFeatures = require('./../utils/apiFeatures');
const interviewController = require('./../controllers/interviewController');
const AppError = require('./../utils/apiError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handleFactory');

exports.setInterviewIds = (req, res, next) => {
  if (!req.body.interview) req.body.interview = req.params.interviewId;
  next();
};

exports.getAllChallenges = catchAsync(async (req, res) => {
  let filter = {};
  if (req.params.interviewId) filter = { interview: req.params.interviewId };
  const features = new APIFeatures(Challenge.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const challenges = await features.query;

  res.status(200).json({
    status: 'success',
    results: challenges.length,
    data: {
      challenges,
    },
  });
});

exports.createChallenge = catchAsync(async (req, res, next) => {
  const newChallenge = await Challenge.create(req.body);

  if (req.body.interview) {
    await interviewController.updateInterviewChallenges(
      req.body.interview,
      newChallenge._id,
      '$push',
    );
  }

  res.status(201).json({
    status: 'success',
    data: {
      challenge: newChallenge,
    },
  });
});

exports.deleteChallenge = catchAsync(async (req, res, next) => {
  const challenge = await Challenge.findByIdAndRemove(req.params.id);

  if (!challenge) {
    return next(new AppError('No challenge found with that ID', 404));
  }

  await interviewController.updateInterviewChallenges(
    challenge.interview,
    challenge._id,
    '$pull',
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getChallenge = factory.getOne(Challenge);
exports.updateChallenge = factory.updateOne(Challenge);
