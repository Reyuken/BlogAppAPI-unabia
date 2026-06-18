const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({


    userName: {
        type: String,
        required: [true, 'User input is Required']
    },

    email: {
        type: String,
        required: [true, 'User email is Required']
    },

    password: {
        type: String,
        required: [true, 'User password is Required']
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

})

module.exports = mongoose.model('User', userSchema);

