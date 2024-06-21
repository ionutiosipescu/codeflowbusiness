const Candidate = require('./../models/candidateModel');
const AppError = require('./../utils/apiError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handleFactory');

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

exports.deleteCandidate = factory.deleteOne(Candidate);
exports.updateCandidate = factory.updateOne(Candidate);
exports.createCandidate = factory.createOne(Candidate);
exports.getAllCandidates = factory.getAll(Candidate);
