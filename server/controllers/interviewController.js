const Interview = require('./../models/interviewModel');
const candidateController = require('./../controllers/candidateController');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/apiError');
const catchAsync = require('./../utils/catchAsync');

exports.updateInterviewChallenges = async (
  interviewId,
  challengeId,
  method,
) => {
  const update = { [method]: { challenges: challengeId } };
  return Interview.findByIdAndUpdate(interviewId, update);
};

exports.setCandidateIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.candidate) req.body.candidate = req.params.candidateId;
  next();
};

exports.getAllInterviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.candidateId) filter = { candidate: req.params.candidateId };

  const features = new APIFeatures(Interview.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const interviews = await features.query;

  res.status(200).json({
    status: 'success',
    results: interviews.length,
    data: {
      interviews,
    },
  });
});

exports.getInterview = catchAsync(async (req, res, next) => {
  const interview = await Interview.findById(req.params.id).populate({
    path: 'challenges',
  });

  if (!interview) {
    return next(new AppError('No interview found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      interview,
    },
  });
});

exports.createInterview = catchAsync(async (req, res, next) => {
  const newInterview = await Interview.create(req.body);

  if (req.body.candidate) {
    await candidateController.updateCandidateInterviews(
      req.body.candidate,
      newInterview._id,
      '$push',
    );
  }

  res.status(201).json({
    status: 'success',
    data: {
      interview: newInterview,
    },
  });
});

exports.updateInterview = catchAsync(async (req, res, next) => {
  const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!interview) {
    return next(new AppError('No interview found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      interview,
    },
  });
});

exports.deleteInterview = catchAsync(async (req, res, next) => {
  const interview = await Interview.findOneAndDelete({ _id: req.params.id });

  if (!interview) {
    return next(new AppError('No interview found with that ID', 404));
  }

  await candidateController.updateCandidateInterviews(
    interview.candidate,
    interview._id,
    '$pull',
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
