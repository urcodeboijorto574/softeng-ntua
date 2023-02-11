const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const answerSchema = new mongoose.Schema({
    qID: {
        type: String,
    },
    optID: {
        type: String,
    },
    sessionID: {
        type: String,
        required: true,
    },
    questionnaireID: {
        type: String,
    },
    answertext: {
        type: String,
        default: ' ',
    },
    submittedAt: {
        type: Date,
        default: Date.now(),
    },
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
