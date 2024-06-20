const express = require('express');
const authController = require('./../controllers/authController');

const jobController = require('../controllers/jobController');

const router = express.Router();

router.use(
  authController.protect,
  authController.restrictTo('admin', 'recruiter'),
);

router.route('/').get(jobController.getAllJobs).post(jobController.createJob);

router
  .route('/:id')
  .get(jobController.getJob)
  .patch(jobController.updateJob)
  .delete(jobController.deleteJob);

module.exports = router;
