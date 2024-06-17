const Candidate = require('./../models/candidateModel');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/apiError');
const catchAsync = require('./../utils/catchAsync');

exports.updateCandidateInterviews = async (
  candidateId,
  interviewId,
  method,
) => {
  const update = { [method]: { interviews: interviewId } };
  return Candidate.findByIdAndUpdate(candidateId, update);
};

exports.aliasTopCandidates = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = '-total_score';
  next();
};

exports.getAllCandidates = catchAsync(async (req, res) => {
  const features = new APIFeatures(Candidate.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const candidates = await features.query;

  res.status(200).json({
    status: 'success',
    results: candidates.length,
    data: {
      candidates,
    },
  });
});

exports.getCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id).populate([
    { path: 'assignees' },
    {
      path: 'interviews',
      populate: {
        path: 'challenges',
      },
    },
  ]);

  if (!candidate) {
    return next(new AppError('No candidate found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      candidate,
    },
  });
});

exports.createCandidate = catchAsync(async (req, res, next) => {
  const newCandidate = await Candidate.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      candidate: newCandidate,
    },
  });
});

exports.updateCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!candidate) {
    return next(new AppError('No candidate found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      candidate,
    },
  });
});

exports.deleteCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findOneAndDelete({ _id: req.params.id });

  if (!candidate) {
    return next(new AppError('No candidate found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getCandidateStats = catchAsync(async (req, res) => {
  const stats = await Candidate.aggregate([
    {
      $group: {
        _id: null,
        numCandidates: { $sum: 1 },
        avgRate: { $avg: '$rate' },
        avgExperience: { $avg: '$experience' },
        avgAge: { $avg: '$age' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
