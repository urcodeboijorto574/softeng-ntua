const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const asnwerSchema = new mongoose.Schema({
    questionID: {
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
    },
});
