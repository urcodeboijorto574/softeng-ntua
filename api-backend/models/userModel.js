const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'A user must have a username'],
        unique: [true, 'A user\'s username must be unique'],
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
    },
    questionnaires: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Questionnaire'
        }
    ],

});

const User = mongoose.model('User', userSchema);

module.exports = User;
