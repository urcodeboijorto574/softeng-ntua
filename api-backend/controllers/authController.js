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
            role: req.params.usermod
        })
        // if no user with the same username and usermod exists, then create a new user
        if (!userQuery) {
                const newUser = await User.create({
                username: req.params.username,
                password: req.params.password,
                role: req.params.usermod
            });
            res.status(201).json({
                status: 'OK'
            })
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
}