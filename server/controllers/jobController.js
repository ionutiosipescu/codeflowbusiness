const Job = require('./../models/jobModel');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/apiError');
const catchAsync = require('./../utils/catchAsync');

exports.getAllJobs = catchAsync(async (req, res) => {
  const features = new APIFeatures(Job.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const jobs = await features.query;

  res.status(200).json({
    status: 'success',
    results: jobs.length,
    data: {
      jobs,
    },
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id).populate([
    { path: 'candidates' },
  ]);

  if (!job) {
    return next(new AppError('No candidate found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      job,
    },
  });
});

exports.createJob = catchAsync(async (req, res, next) => {
  const newJob = await Job.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      job: newJob,
    },
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

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

exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id });

  if (!job) {
    return next(new AppError('No job found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
