const express = require('express');
const replyController = require('../controllers/replyController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(
  authController.protect,
  authController.restrictTo('admin', 'recruiter'),
);

router.route('/').post(replyController.addReply);

router
  .route('/:id')
  .patch(replyController.updateReply)
  .delete(replyController.deleteReply);

module.exports = router;
