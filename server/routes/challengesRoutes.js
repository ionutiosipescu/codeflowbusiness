const express = require('express');

const challengeController = require('../controllers/challengeController');
const commentRouter = require('./commentRoutes');
const replyRouter = require('./replyRoutes');

const router = express.Router({ mergeParams: true });

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
