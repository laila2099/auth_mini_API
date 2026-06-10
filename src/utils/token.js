const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
    return jwt.sign(
    {
        userId: user._id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES_IN
    }
    );
};

const createRefreshToken = (user) => {
    return jwt.sign(
    {
        userId: user._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
    }
    );
};

module.exports = {
createAccessToken,
createRefreshToken
};