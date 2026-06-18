const User = require('../models/User')
const auth = require('../auth')
const bcrypt = require('bcryptjs')
const { errorHandler } = require('../auth')

module.exports.createUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body

        if (!userName || typeof userName !== "string") {
            return res.status(400).send({ error: "Username is required" })
        }

        if (!email || !email.includes("@")) {
            return res.status(400).send({ error: "Valid email is required" })
        }

        if (!password || password.length < 8) {
            return res.status(400).send({ error: "Password must be at least 8 characters" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).send({ error: "Email already exists" })
        }

        const newUser = new User({
            userName,
            email,
            password: bcrypt.hashSync(password, 10)
        })

        await newUser.save()

        return res.status(201).send({
            message: "User registered successfully"
        })

    } catch (err) {
        return errorHandler(err, req, res)
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !email.includes("@")) {
            return res.status(400).send({ error: "Invalid email" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).send({ error: "No email found" })
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(401).send({ error: "Incorrect password" })
        }

        return res.status(200).send({
            message: "Login successful",
            access: auth.createAccessToken(user)
        })

    } catch (err) {
        return errorHandler(err, req, res)
    }
}

module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User not found" })
            }

            user.password = ""
            return res.status(200).send(user)
        })
        .catch(err => errorHandler(err, req, res))
}

module.exports.setAsAdmin = (req, res) => {
    return User.findByIdAndUpdate(
        req.params.id,
        { isAdmin: true },
        { new: true }
    )
        .then(result => {
            if (!result) {
                return res.status(404).send({ error: "User not found" })
            }

            return res.status(200).send({ updatedUser: result })
        })
        .catch(err => errorHandler(err, req, res))
}

module.exports.updatePassword = (req, res) => {
    const { newPassword } = req.body

    if (!newPassword || newPassword.length < 8) {
        return res.status(400).send({ error: "Password must be at least 8 characters" })
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10)

    return User.findByIdAndUpdate(
        req.user.id,
        { password: hashedPassword }
    )
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: "User not found" })
            }

            return res.status(200).send({ message: "Password updated successfully" })
        })
        .catch(err => errorHandler(err, req, res))
}

module.exports.updateUsername = (req, res) => {
    const { userName } = req.body

    if (!userName || typeof userName !== "string" || userName.trim() === "") {
        return res.status(400).send({
            error: "Username is required"
        })
    }

    return User.findByIdAndUpdate(
        req.user.id,
        { userName: userName.trim() },
        { new: true }
    )
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    error: "User not found"
                })
            }

            return res.status(200).send({
                message: "Username updated successfully",
                user
            })
        })
        .catch(err => errorHandler(err, req, res))
}