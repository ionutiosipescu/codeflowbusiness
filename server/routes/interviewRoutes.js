const express = require('express');

const interviewController = require('../controllers/interviewController');
const challengeRouter = require('../routes/challengesRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:interviewId/challenges', challengeRouter);

router
  .route('/')
  .get(interviewController.getAllInterviews)
  .post(
    interviewController.setCandidateIds,
    interviewController.createInterview,
  );

router
  .route('/:id')
  .get(interviewController.getInterview)
  .patch(interviewController.updateInterview)
  .delete(interviewController.deleteInterview);

module.exports = router;
