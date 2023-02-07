const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const sessionSchema = new mongoose.Schema({
    sessionID: {
        type: String,
        required: [true, 'A session must have an id'],
        unique: [true, 'A session must have a unique id'],
        maxlength: [4, 'A session id must have 5 characters'],
        minlength: [4, 'A session id must have 5 characters'],
    },
    questionnaireID: {
        type: String,
    },
    answers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Answer',
        }
    ],
    submitter: {
        type: String
    }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
