const Challenge = require('./../models/challengeModel');
const AppError = require('./../utils/apiError');
const catchAsync = require('./../utils/catchAsync');

exports.addReply = catchAsync(async (req, res, next) => {
  const challenge = await Challenge.findById(req.params.challengeId);
  const reply = req.body;
  if (!challenge) {
    return next(new AppError('No challenge found with that ID', 404));
  }

  const comment = challenge.comments.id(req.params.commentId);
  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  comment.replies.push(reply);
  await challenge.save();

  res.status(201).json({
    status: 'success',
    data: {
      reply,
    },
  });
});

exports.updateReply = catchAsync(async (req, res, next) => {
  const challenge = await Challenge.findById(req.params.challengeId);
  if (!challenge) {
    return next(new AppError('No challenge found with that ID', 404));
  }

  const comment = challenge.comments.id(req.params.commentId);
  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  const reply = comment.replies.id(req.params.id);
  if (!reply) {
    return next(new AppError('No reply found with that ID', 404));
  }

  reply.set(req.body);
  await challenge.save();

  res.status(200).json({
    status: 'success',
    data: {
      reply,
    },
  });
});

exports.deleteReply = catchAsync(async (req, res, next) => {
  const challenge = await Challenge.findById(req.params.challengeId);
  if (!challenge) {
    return next(new AppError('No challenge found with that ID', 404));
  }

  const comment = challenge.comments.id(req.params.commentId);
  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  const reply = comment.replies.id(req.params.id);
  if (!reply) {
    return next(new AppError('No reply found with that ID', 404));
  }

  reply.remove();
  await challenge.save();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
