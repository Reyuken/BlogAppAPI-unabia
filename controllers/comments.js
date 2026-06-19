const Comment = require('../models/Comments');
const BlogPost = require('../models/BlogPosts');
const { errorHandler } = require('../auth');

module.exports.addPostComment = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.postId)

        if (!post) {
            return res.status(404).send({ message: "Post not found" })
        }

        if (!req.body.comment || !req.body.comment.trim()) {
            return res.status(400).send({ message: "Comment cannot be empty" })
        }

        const newComment = await Comment.create({
            post: req.params.postId,
            user: req.user.id,
            comment: req.body.comment.trim()
        })

        return res.status(201).send({
            success: true,
            message: "Comment added successfully",
            comment: newComment
        })

    } catch (err) {
        errorHandler(err, req, res)
    }
}

module.exports.getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate("user", "userName email")
            .sort({ createdAt: -1 })

        return res.status(200).send({
            success: true,
            message: "Comments retrieved successfully",
            comments
        })

    } catch (err) {
        errorHandler(err, req, res)
    }
}

module.exports.deletePostComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId)

        if (!comment) {
            return res.status(404).send({ message: "Comment not found" })
        }

        const isOwner = comment.user.toString() === req.user.id
        const isAdmin = req.user.isAdmin

        if (!isOwner && !isAdmin) {
            return res.status(403).send({ message: "Not authorized to delete this comment" })
        }

        await comment.deleteOne()

        return res.status(200).send({
            success: true,
            message: "Comment deleted successfully"
        })

    } catch (err) {
        errorHandler(err, req, res)
    }
}

module.exports.updatePostComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId)

        if (!comment) {
            return res.status(404).send({ message: "Comment not found" })
        }

        const isOwner = comment.user.toString() === req.user.id

        if (!isOwner) {
            return res.status(403).send({ message: "Only the owner can edit this comment" })
        }

        if (!req.body.comment || !req.body.comment.trim()) {
            return res.status(400).send({ message: "Comment cannot be empty" })
        }

        comment.comment = req.body.comment.trim()
        comment.editCount += 1  
        await comment.save()

        return res.status(200).send({
            success: true,
            message: "Comment updated successfully",
            comment
        })

    } catch (err) {
        errorHandler(err, req, res)
    }
}