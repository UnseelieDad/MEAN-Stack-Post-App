const jwt = require('jsonwebtoken');

// check incoming authorization tokens
module.exports = (req, res, next) => {
    try {
         // Token of the form 'Bearer asldkfjasdl'
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'secret_though_I_walk_through_the_valley_of_the_shadow_of_death_I_will_fear_no_evil');
        // Create user data for subsequent requests to access
        req.userData = {email: decodedToken.email, userId: decodedToken.userId}
        // If the token is verified, continue
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Auth failed, token failed to verify.',
            error: error
        });
    }
}