const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogPosts",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    editCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

module.exports = mongoose.model("Comments", commentSchema)