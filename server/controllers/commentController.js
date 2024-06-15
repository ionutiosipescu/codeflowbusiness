const Challenge = require('./../models/challengeModel');
const AppError = require('./../utils/apiError');
const catchAsync = require('./../utils/catchAsync');

exports.addComment = catchAsync(async (req, res, next) => {
  const challenge = await Challenge.findById(req.params.challengeId);
  const comment = req.body;
  if (!challenge) {
    return next(new AppError('No challenge found with that ID', 404));
  }

  challenge.comments.push(comment);
  await challenge.save();

  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const challenge = await Challenge.findById(req.params.challengeId);
  if (!challenge) {
    return next(new AppError('No challenge found with that ID', 404));
  }

  const comment = challenge.comments.id(req.params.id);
  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  comment.set(req.body);
  await challenge.save();

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const challenge = await Challenge.findById(req.params.challengeId);
  if (!challenge) {
    return next(new AppError('No challenge found with that ID', 404));
  }

  const comment = challenge.comments.id(req.params.id);
  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  comment.remove();
  await challenge.save();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
