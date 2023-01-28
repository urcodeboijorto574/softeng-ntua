const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    //const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const value = Object.values(err.keyValue);

    console.log(value);

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

exports.createUser = async (req, res) => {
    try {
        // query if exists a user with the same username and usermod
        let userQuery = await User.findOne({
            username: req.params.username,
            role: req.params.usermod,
        });
        // if no user with the same username and usermod exists, then create a new user
        if (!userQuery) {
            const newUser = await User.create({
                username: req.params.username,
                password: req.params.password,
                role: req.params.usermod,
            });
            res.status(201).json({
                status: 'OK',
            });
        }
        // else if a user with this username and usermod exists, update the user's password
        else {
            // TODO -> update user's password
        }
    } catch (err) {
        let error = { ...err };

        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }
        if (err.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        }
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }
};

exports.login = async (req, res, next) => {
    const username = req.body.username;

    //candidate password
    const password = req.body.password;

    // 1) Check if username and password exist
    if (!username || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide username and password!',
        });
    }
    // 2) Check if user exists and password is correct
    const user = await User.findOne({
        username: username,
    });

    if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({
            status: 'fail',
            message: 'Incorrect username or password',
        });
    }

    // 3) If everything ok, send token to the client
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({
        token: token,
    });
};
