const express = require('express');

const candidateController = require('../controllers/candidateController');
const interviewRouter = require('../routes/interviewRoutes');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(
  authController.protect,
  authController.restrictTo('admin', 'recruiter'),
);

router.use('/:candidateId/interviews', interviewRouter);

router
  .route('/top-3-candidates')
  .get(
    candidateController.aliasTopCandidates,
    candidateController.getAllCandidates,
  );

router.route('/candidate-stats').get(candidateController.getCandidateStats);

router
  .route('/')
  .get(candidateController.getAllCandidates)
  .post(candidateController.createCandidate);

router
  .route('/:id')
  .get(candidateController.getCandidate)
  .patch(candidateController.updateCandidate)
  .delete(candidateController.deleteCandidate);

module.exports = router;
