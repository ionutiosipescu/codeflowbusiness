const express = require('express');
const replyController = require('../controllers/replyController');

const router = express.Router({ mergeParams: true });

router.route('/').post(replyController.addReply);

router
  .route('/:id')
  .patch(replyController.updateReply)
  .delete(replyController.deleteReply);

module.exports = router;
