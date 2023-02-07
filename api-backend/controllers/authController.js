const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require(`${__dirname}/../models/userModel`);
const AppError = require(`${__dirname}/../utils/appError`);
const converter = require('json-2-csv');
const csv = require('csv-express');
const cookieParser = require('cookie-parser');
const handleResponse =
    require(`${__dirname}/../utils/handleResponse`).handleResponse;

// error-handling functions
const handleDuplicateFieldsDB = (err) => {
    const message = 'Username taken! Please provide a new username.';
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

//-------------------------------------------------------------------//
// endpoint to sign up a user
exports.signup = async (req, res) => {
    try {
        let responseMessage;
        const newUser = await User.create({
            username: req.body.username,
            role: req.body.usermod,
            password: req.body.password,
        });
        responseMessage = { status: 'OK' };
        return handleResponse(req, res, 200, responseMessage);
    } catch (err) {
        let error = { ...err };
        if (err.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        } else if (err.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        } else {
            responseMessage = {
                status: 'failed',
                message: 'Internal Server Error!',
            };

            return handleResponse(req, res, 500, responseMessage);
        }
        responseMessage = { status: error.status, message: error.message };
        return handleResponse(req, res, error.statusCode, responseMessage);
    }
};

// endpoint to get a user's profile
exports.getUser = async (req, res) => {
    try {
        let responseMessage;
        const user = await User.findOne({
            username: req.params.username,
        }).select({
            password: 0,
            _id: 0,
            __v: 0,
            passwordChangedAt: 0,
            questionnairesAnswered: 0,
        });
        if (!user) {
            responseMessage = {
                status: 'failed',
                message: 'No user found with the given username.',
            };

            return handleResponse(req, res, 402, responseMessage);
        } else {
            responseMessage = {
                status: 'OK',
                user: user,
            };
            if (req.query.format === 'json' || !req.query.format) {
                return res.status(200).json(responseMessage);
            } else if (req.query.format === 'csv') {
                return res.status(200).csv(
                    [
                        {
                            status: 'OK',
                            username: user.username,
                            role: user.role,
                        },
                    ],
                    true
                );
            } else {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Response format is json or csv!',
                });
            }
        }
    } catch (err) {
        responseMessage = {
            status: 'failed',
            message: 'Internal Server Error',
        };
        return handleResponse(req, res, 500, responseMessage);
    }
};

// endpoint to create a user and update a user's password if user already exists
exports.createUser = async (req, res) => {
    try {
        let responseMessage;
        // query if exists a user with the same username and usermod
        let userQuery = await User.findOne({
            username: req.params.username,
            role: req.params.usermod,
        });
        // if no user with the same username and usermod exists, then create a new user
        if (!userQuery) {
            const newUser = await User.create({
                role: req.params.usermod,
                username: req.params.username,
                password: req.params.password,
            });
            responseMessage = { status: 'OK' };
            return handleResponse(req, res, 200, responseMessage);
        }
        // else if a user with this username and usermod exists, update the user's password
        else {
            userQuery.password = req.params.password;
            userQuery.passwordChangedAt = new Date();
            await userQuery.save();
            responseMessage = { status: 'OK' };
            return handleResponse(req, res, 200, responseMessage);
        }
    } catch (err) {
        let error = { ...err };

        if (err.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        } else if (err.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        } else {
            responseMessage = {
                status: 'failed',
                message: 'Internal Server Error',
            };
            return handleResponse(req, res, 500, responseMessage);
        }
        responseMessage = { status: error.status, message: error.message };
        return handleResponse(req, res, error.statusCode, responseMessage);
    }
};

//endpoint to logout a user
exports.logout = async (req, res) => {
    try {
        let responseMessage;
        res.cookie('jwt', 'loggedout', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });
        responseMessage = {
            status: 'OK',
            message: 'You are successfully logged out.',
        };
        return handleResponse(req, res, 200, responseMessage);
    } catch (err) {
        responseMessage = {
            status: 'failed',
            message: 'Internal Server Error',
        };
        return handleResponse(req, res, 500, responseMessage);
    }
};

//endpoint to login a user
exports.login = async (req, res, next) => {
    try {
        let responseMessage;
        const username = req.body.username;

        //candidate password
        const password = req.body.password;

        // 1) Check if username and password exist
        if (!username || !password) {
            let responseMessage = {
                status: 'failed',
                message: 'Please provide username and password!',
            };
            return handleResponse(req, res, 400, responseMessage);
        }
        // 2) Check if user exists and password is correct
        const user = await User.findOne({
            username: username,
        });

        if (!user || !(await user.correctPassword(password, user.password))) {
            responseMessage = {
                status: 'failed',
                message: 'Incorrect username or password!',
            };
            return handleResponse(req, res, 401, responseMessage);
        }
        if (req.body.usermod) {
            if (user.role != req.body.usermod) {
                responseMessage = {
                    status: 'failed',
                    message: 'Incorrect username or password!',
                };
                return handleResponse(req, res, 401, responseMessage);
            }
        }

        // 3) If everything ok, send token to the client
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.cookie('jwt', token, {
            expires: parseInt(
                new Date(
                    Date.now() +
                        process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                )
            ),
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });
        if (req.query.format === 'json' || !req.query.format) {
            return res.status(200).json({
                token: token,
            });
        } else if (req.query.format === 'csv') {
            return res.status(200).csv([{ token: token }], true);
        } else {
            return res.status(400).json({
                status: 'failed',
                message: 'Response format is json or csv!',
            });
        }
    } catch (err) {
        responseMessage = {
            status: 'failed',
            message: 'Internal Server Error',
        };
        return handleResponse(req, res, 500, responseMessage);
    }
};

// protects routes access from not logged-in users
// the token is sent with a cookie (http header 'Cookie')
exports.protect = async (req, res, next) => {
    try {
        let responseMessage;
        // 1) Getting token and check if it's there
        let token;
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            responseMessage = {
                status: 'failed',
                message: 'Please log in to get access.',
            };
            return handleResponse(req, res, 401, responseMessage);
        }
        // 2) Verification of the token
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET
        ); // make function to return a promise

        // 3) Ckeck if user still exists
        // a user logged in, and after a few time the user was deleted. But if someone gets the token he must not have access
        const freshUser = await User.findById(decoded.id);
        if (!freshUser) {
            responseMessage = {
                status: 'failed',
                message: 'User no longer exists.',
            };
            return handleResponse(req, res, 401, handleResponse);
        }

        // 4) Check if user changed password after token was issued
        if (freshUser.changedPasswordAfter(decoded.iat)) {
            responseMessage = {
                status: 'failed',
                message: 'User recently changed password. Please log in again.',
            };
            return handleResponse(req, res, 401, handleResponse);
        }

        // grant access to protected route
        req.userRole = freshUser.role;
        req.username = freshUser.username;
        next();
    } catch (err) {
        // errors reference to case 2
        if (err.name === 'JsonWebTokenError') {
            responseMessage = {
                status: 'failed',
                message: 'Please log in to get access.',
            };
            return handleResponse(req, res, 401, responseMessage);
        } else if (err.name === 'TokenExpiredError') {
            responseMessage = {
                status: 'failed',
                message: 'Token has expired. Please log in again.',
            };
            return handleResponse(req, res, 401, responseMessage);
        } else {
            responseMessage = {
                status: 'failed',
                message: 'Internal Server Error',
            };
            return handleResponse(req, res, 500, responseMessage);
        }
    }
};

//allow access to routes only for some user category
exports.restrictTo = (...roles) => {
    let responseMessage;
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            responseMessage = {
                status: 'failed',
                message: 'User unauthorized to continue!',
            };
            return handleResponse(req, res, 401, responseMessage);
        }
        next();
    };
};
