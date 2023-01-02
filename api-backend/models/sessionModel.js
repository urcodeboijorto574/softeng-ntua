const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const sessionSchema = new mongoose.Schema({
    sessionID: {
        type: String,
        required: [true, 'An option must have an id'],
        unique: [true, "An option must have it's own unique id"],
        length: [5, 'An optin id must have 5 characters'],
    },
    questionnaireID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Questionnaire',
    },
    answers: {
        type: mongoose.Schema.ObjectId,
        ref: 'Answer',
    },
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
