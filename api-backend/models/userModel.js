const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: 'Role must be user or admin',
        },
        required: [true, 'A user must have a role'],
    },
    username: {
        type: String,
        unique: [true, 'Username taken! Please provide a new username'],
        required: [true, 'Please provide a username'],
        maxlength: [20, 'A username must have at most 20 characters'],
        minlength: [1, 'A username must have at least 1 character'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'A password must have at least 8 characters'],
        // select: false, //never show password in query outputs
    },
    passwordChangedAt: {
        type: Date,
    },
    questionnairesAnswered: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Questionnaire'
        }
    ],
});

/*
 This middleware creates trouble for the doanswer endpoint.
*/
// document middleware for password encryption. Runs right before the current document is saved in the database
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Instance method. Available on all documents of a certain collection (here User). Returns true if the password that a user gives us(hashed) is the same as the encrypted password stored in the database
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// returns true if user changed password after the token was issued
userSchema.methods.changedPasswordAfter = function (JTWTimestamp) {
    // if user changed password
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JTWTimestamp < changedTimestamp;
    }

    return false; // user didn't change password
};

const User = mongoose.model('User', userSchema);

module.exports = User;
