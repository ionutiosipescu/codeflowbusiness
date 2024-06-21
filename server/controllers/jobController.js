const Job = require('./../models/jobModel');
const AppError = require('./../utils/apiError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handleFactory');

exports.getJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id).populate([
    { path: 'candidates' },
  ]);

  if (!job) {
    return next(new AppError('No job found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      job,
    },
  });
});

exports.deleteJob = factory.deleteOne(Job);
exports.getAllJobs = factory.getAll(Job);
exports.createJob = factory.createOne(Job);
exports.updateJob = factory.updateOne(Job);
