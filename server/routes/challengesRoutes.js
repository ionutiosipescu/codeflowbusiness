const express = require('express');

const challengeController = require('../controllers/challengeController');
const commentRouter = require('./commentRoutes');
const replyRouter = require('./replyRoutes');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(
  authController.protect,
  authController.restrictTo('admin', 'recruiter'),
);

router.use('/:challengeId/comments', commentRouter);
router.use('/:challengeId/comments/:commentId/replies', replyRouter);

router
  .route('/')
  .get(challengeController.getAllChallenges)
  .post(
    challengeController.setInterviewIds,
    challengeController.createChallenge,
  );

router
  .route('/:id')
  .get(challengeController.getChallenge)
  .patch(challengeController.updateChallenge)
  .delete(challengeController.deleteChallenge);

module.exports = router;
