const User = require("../models/User");

//Get Token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //Create Token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE * 86400 * 1000)),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    })
}

//@desc     Register for all user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phoneNo, role } = req.body;

        // Check valid role
        if (!["customer", "employee", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                messsage: "Please provide a valid role"
            });
        }

        // Protect register for employee and admin
        if (role != "customer") {
            if (req.headers.authorization != process.env.REGISTER_SECRET) {
                return res.status(401).json({ success: false });
            }
        }

        const body = {
            name,
            email,
            password,
            phoneNo,
            role,
        }

        if (role == "customer") {
            body.customerRank = "The Basic";
        }

        //Create user
        const user = await User.create(body);

        // Create Token
        // const token = user.getSignedJwtToken();
        // res.status(200).json({success: true, token});

        sendTokenResponse(user, 200, res);
    } catch (e) {
        res.status(400).json({ success: false });
        console.log(e.stack);
    }
}

//@desc     Login for all user
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    //Validate email & password
    if (!email || !password) {
        return res.status(400).json({ success: false, msg: "Please provide an email and password" });
    }

    //Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

    // Create token
    // const token = user.getSignedJwtToken();
    // res.status(200).json({success: true, token});

    sendTokenResponse(user, 200, res);
}

//@desc     Get Current Logged in user
//@route    POST /api/v1/auth/me
//@access   Private
exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    })
}

//@desc     Log out
//@route    GET /api/v1/auth/logout
//@access   Public
exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
};

