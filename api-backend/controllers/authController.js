const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const converter = require('json-2-csv');
const csv = require('csv-express');
const cookieParser = require('cookie-parser');

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
        const newUser = await User.create({
            username: req.body.username,
            role: req.body.usermod,
            password: req.body.password,
        });
        if (req.query.format === 'json' || !req.query.format) {
            res.status(200).json({
                status: 'OK',
            });
        }
    } catch (err) {
        let error = { ...err };
        if (err.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }
        if (err.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        } else {
            return res.status(500).json({
                status: 'failed',
                message: 'Internal Server Error',
            });
        }
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }
};

// endpoint to get a user's profile
exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username,
        }).select({
            password: 0,
            _id: 0,
            __v: 0,
        });
        if (!user) {
            if (req.query.format === 'json' || !req.query.format) {
                return res.status(402).json({
                    status: 'failed',
                    message: 'No user found with the given username.',
                });
            }
        }
        if (req.query.format === 'json' || !req.query.format) {
            res.status(200).json({
                status: 'OK',
                user: user,
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error',
        });
    }
};

// endpoint to create a user and update a user's password if user already exists
exports.createUser = async (req, res) => {
    try {
        // query if exists a user with the same username and usermod
        let userQuery = await User.findOne({
            username: req.params.username,
            role: req.params.usermod,
        });
        console.log(userQuery);
        // if no user with the same username and usermod exists, then create a new user
        if (!userQuery) {
            const newUser = await User.create({
                username: req.params.username,
                password: req.params.password,
                role: req.params.usermod,
            });
            if (req.query.format === 'json' || !req.query.format) {
                res.status(200).json({
                    status: 'OK',
                });
            }
        }
        // else if a user with this username and usermod exists, update the user's password
        else {
            console.log('here');
            userQuery.password = req.params.password;
            userQuery.passwordChangedAt = new Date();
            await userQuery.save();
            res.status(200).json({
                status: 'OK',
            });
        }
    } catch (err) {
        let error = { ...err };

        if (err.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }
        if (err.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        } else {
            return res.status(500).json({
                status: 'failed',
                message: 'Internal Server Error',
            });
        }
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }
};

//endpoint to logout a user
exports.logout = async (req, res) => {
    try {
        res.cookie('jwt', 'loggedout', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });
        res.status(200).json({
            status: 'OK',
            message: 'You are successfully logged out.',
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error',
        });
    }
};

//endpoint to login a user
exports.login = async (req, res, next) => {
    try {
        const username = req.body.username;

        //candidate password
        const password = req.body.password;

        // 1) Check if username and password exist
        if (!username || !password) {
            const response = {
                status: 'failed',
                message: 'Please provide username and password!',
            };
            if (req.query.format === 'json' || !req.query.format) {
                return res.status(400).json({
                    response,
                });
            }
        }
        // 2) Check if user exists and password is correct
        const user = await User.findOne({
            username: username,
        });

        if (!user || !(await user.correctPassword(password, user.password))) {
            if (req.query.format === 'json' || !req.query.format) {
                return res.status(401).json({
                    status: 'failed',
                    message: 'Incorrect username or password',
                });
            }
        }
        if (req.body.usermod) {
            if (user.role != req.body.usermod) {
                return res.status(401).json({
                    status: 'failed',
                    message: 'Incorrect username or password',
                });
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
            sameSize: 'None',
            secure: true,
        });
        res.status(200).json({
            token: token,
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error',
        });
    }
};

// protects routes access from not logged-in users
// the token is sent with a cookie (http header 'Cookie')
exports.protect = async (req, res, next) => {
    try {
        // 1) Getting token and check if it's there
        let token;
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({
                status: 'failed',
                message: 'Please log in to get access.',
            });
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
            return res.status(401).json({
                status: 'failed',
                message: 'User no longer exists.',
            });
        }

        // 4) Check if user changed password after token was issued
        if (freshUser.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({
                status: 'failed',
                message: 'User recently changed password. Please log in again.',
            });
        }

        // grant access to protected route
        req.userRole = freshUser.role;
        req.username = freshUser.username;
        next();
    } catch (err) {
        // errors reference to case 2
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'failed',
                message: 'Please log in to get access.',
            });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'failed',
                message: 'Token has expired. Please log in again.',
            });
        } else {
            return res.status(500).json({
                status: 'failed',
                message: 'Internal Server Error',
            });
        }
    }
};

//allow access to routes only for some user category
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(401).json({
                status: 'failed',
                message: 'User unauthorized to continue!',
            });
        }
        next();
    };
};
