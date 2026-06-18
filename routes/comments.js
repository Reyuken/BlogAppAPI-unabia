const express = require("express");
const router = express.Router();

const commentsController = require("../controllers/comments");
const { verify, verifyAdmin } = require("../auth");

router.post("/:postId/", verify, commentsController.addPostComment);
router.get("/:postId/", commentsController.getPostComments);
router.patch("/:postId/:commentId", verify, commentsController.updatePostComment);
router.delete("/:postId/:commentId", verify, commentsController.deletePostComment);

module.exports = router;