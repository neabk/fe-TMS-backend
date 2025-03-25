const jwt = require("jsonwebtoken");
const User = require("../models/User")

//Protect routes & Valid token for any user's role
exports.needLogin = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    //Make sure token exists
    if (!token|| token == 'null') {
        return res.status(401).json({success: false, message: "Not Authorize to access this route"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({success: false, message: "Not Authorize to access this route"});
        }

        next();
    } catch (e) {
        console.log(e.stack);
        return res.status(401).json({success: false, message: "Not Authorize to access this route"});
    }
}

//Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({success: false, message: `User role ${req.user.role} is not authorized to access this route`});
        }
        next();
    }
}