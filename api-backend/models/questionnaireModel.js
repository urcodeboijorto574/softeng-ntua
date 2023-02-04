const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const questionnaireSchema = new mongoose.Schema({
    questionnaireID: {
        type: String,
        required: [true, 'A questionnaire must have an id'],
        unique: [true, "A questionnaire must have it's own unique id"],
        length: [5, 'A questionnaire id must have 5 characters'],
        /* Με καποιο τροπο πρεπει να εξασφαλισουμε οτι το id θα ειναι της μορφης QQ000*/
    },
    questionnaireTitle: {
        type: String,
        required: [true, 'A questionnaire must have a title'],
        unique: [true, "A questionnaire must have it's own unique title"],
        maxlength: [60, 'A questionnaire title must have less or equal than 60 characters'],
        minlength: [10, 'A questionnaire title must have more or equal than 10 characters'],
    },
    keywords: [String],
    questions: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Question',
        },
    ],
    creator: {
        type: String,
    },
},
    { versionKey: false },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

module.exports = Questionnaire;
