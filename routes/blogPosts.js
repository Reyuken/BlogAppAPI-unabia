const express = require("express");
const router = express.Router();

const blogPostController = require("../controllers/blogPosts");
const { verify, verifyAdmin } = require("../auth");

router.post("/", verify, blogPostController.createBlogPost);
router.get("/", blogPostController.getAllBlogPosts);
router.get("/:blogPostId", blogPostController.getBlogPostById);
router.patch("/update/:blogPostId", verify, blogPostController.updateBlogPost);
router.delete("/delete/:blogPostId", verify, blogPostController.deleteBlogPost);

module.exports = router;