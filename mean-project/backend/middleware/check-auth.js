const jwt = require('jsonwebtoken');

// check incoming authorization tokens
module.exports = (req, res, next) => {
    try {
         // Token of the form 'Bearer asldkfjasdl'
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        // Create user data for subsequent requests to access
        req.userData = {email: decodedToken.email, userId: decodedToken.userId}
        // If the token is verified, continue
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Token failed to verify, you are not authenticated.',
            error: error
        });
    }
}