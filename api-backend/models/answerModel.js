const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const answerSchema = new mongoose.Schema({
    /*     questionID: {
        type: mongoose.ObjectID,
        ref: 'Answer',
    },
    optID: {
        type: mongoose.ObjectID,
        ref: 'Option',
    },
    sessionID: {
        type: mongoose.ObjectID,
        ref: 'Session',
    },
    questionnaireID: {
        type: mongoose.ObjectID,
        ref: 'Questionnaire',
    }, */
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
        default: '',
    },
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
