const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(
  authController.protect,
  authController.restrictTo('admin', 'recruiter'),
);

router.route('/').post(commentController.addComment);

router
  .route('/:id')
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;
