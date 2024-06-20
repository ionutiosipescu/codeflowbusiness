const User = require('./../models/userModel');
const Candidate = require('./../models/candidateModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/apiError');
const sendEmail = require('./../utils/email');

const checkApproveOffer = async (email, userRole) => {
  const candidate = await Candidate.findOne({ email });
  if (!candidate) {
    throw new AppError('There is no candidate with this email address.', 404);
  }

  if (!candidate.approve_offer) {
    if (userRole === 'admin') {
      candidate.approve_offer = true;
      await candidate.save({ validateBeforeSave: false });
    } else {
      throw new AppError(
        'Candidate is not approved to receive an offer email.',
        403,
      );
    }
  }
};

exports.sendEmail = catchAsync(async (req, res, next) => {
  const { email, type } = req.body;

  if (!type || !['decline', 'offer', 'interview'].includes(type)) {
    return next(new AppError('Invalid or missing email type.', 400));
  }

  if (type === 'offer') {
    try {
      await checkApproveOffer(email, req.user.role);
    } catch (err) {
      return next(err);
    }
  }

  const candidate = await Candidate.findOne({ email });
  if (!candidate) {
    return next(new AppError('There is no candidate with email address.', 404));
  }

  const emailContent = {
    decline: {
      subject: 'We regret to inform you',
      message: `Dear ${candidate.name},\n\nWe regret to inform you that your application has been declined.\n\nBest regards,\nThe Team`,
    },
    offer: {
      subject: 'Congratulations! You have an offer',
      message: `Dear ${candidate.name},\n\nWe are pleased to offer you a position at our company.\n\nBest regards,\nThe Team`,
    },
    interview: {
      subject: 'Interview Invitation',
      message: `Dear ${candidate.name},\n\nWe would like to invite you for an interview.\n\nBest regards,\nThe Team`,
    },
  };

  const { subject, message } = emailContent[type];

  try {
    await sendEmail({
      email: candidate.email,
      subject,
      message,
    });

    candidate.emails[type] = true;
    await candidate.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Email was send!',
    });
  } catch (err) {
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500,
    );
  }
});
