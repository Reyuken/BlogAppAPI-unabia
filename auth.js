const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.createAccessToken = user => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (typeof token === "undefined") {
        return res.status(401).send({ auth: "Failed", message: "No token found" });
    }

    token = token.slice(7);

    return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        if (err) {
            return res.status(403).send({ auth: "Failed", message: err.message });
        }

        req.user = decodedToken;
        next();
    });
};

module.exports.verifyAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        return next();
    }

    return res.status(403).send({ auth: "Failed", message: "Action Forbidden" });
};

module.exports.errorHandler = (err, req, res, next) => {
    const errorMessage = err.message || "Internal Server Error";

    return res.status(500).json({
        error: {
            message: errorMessage,
            errorCode: err.code || "SERVER_ERROR",
            details: err.details || null
        }
    });
};
