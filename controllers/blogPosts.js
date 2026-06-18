const BlogPost = require('../models/BlogPosts');
const { errorHandler } = require('../auth');

module.exports.createBlogPost = (req, res) => {
    const newBlogPost = new BlogPost({
        title: req.body.title,
        content: req.body.content,
        author: req.user.id
    });

    newBlogPost.save()
        .then(result => res.status(201).send(result))
        .catch(err => errorHandler(err, req, res));
};

module.exports.getAllBlogPosts = (req, res) => {
    BlogPost.find({})
        .populate('author', 'userName')
        .sort({ createdAt: -1 })
        .then(result => res.status(200).send(result))
        .catch(err => errorHandler(err, req, res));
};

module.exports.getBlogPostById = (req, res) => {
    BlogPost.findById(req.params.blogPostId)
        .populate('author', 'userName')
        .then(blogPost => {
            if (!blogPost) {
                return res.status(404).send({
                    error: 'Blog post not found'
                });
            }

            return res.status(200).send(blogPost);
        })
        .catch(err => errorHandler(err, req, res));
};

module.exports.updateBlogPost = (req, res) => {
    BlogPost.findById(req.params.blogPostId)
        .then(post => {
            if (!post) {
                return res.status(404).send({
                    error: "Blog post not found"
                })
            }

            if (post.author.toString() !== req.user.id) {
                return res.status(403).send({
                    error: "You are not allowed to update this post"
                })
            }

            post.title = req.body.title
            post.content = req.body.content

            return post.save()
        })
        .then(updatedPost => {
            if (!updatedPost) return

            return res.status(200).send({
                success: true,
                message: "Blog post updated successfully",
                updatedPost
            })
        })
        .catch(err => {
            if (res.headersSent) return
            errorHandler(err, req, res)
        })
}

module.exports.deleteBlogPost = (req, res) => {
    BlogPost.findById(req.params.blogPostId)
        .then(post => {
            if (!post) {
                return res.status(404).send({
                    error: "Blog post not found"
                })
            }

            const isAuthor = post.author.toString() === req.user.id
            const isAdmin = req.user.isAdmin === true

            if (!isAuthor && !isAdmin) {
                return res.status(403).send({
                    error: "You are not allowed to delete this post"
                })
            }

            return BlogPost.findByIdAndDelete(req.params.blogPostId)
        })
        .then(result => {
            if (!result) return

            return res.status(200).send({
                success: true,
                message: "Blog post deleted successfully"
            })
        })
        .catch(err => {
            if (res.headersSent) return
            errorHandler(err, req, res)
        })
}

// module.exports.searchByTitle = (req, res) => {
//     BlogPost.findOne({
//         title: {
//             $regex: req.body.title,
//             $options: 'i'
//         }
//     })
//         .populate('author', 'userName')
//         .then(blogPost => {
//             if (!blogPost) {
//                 return res.status(404).send({
//                     error: 'Blog post not found'
//                 });
//             }

//             return res.status(200).send(blogPost);
//         })
//         .catch(err => errorHandler(err, req, res));
// };