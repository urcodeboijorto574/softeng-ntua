const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const questionSchema = new mongoose.Schema({
    qID: {
        type: String,
        required: [true, 'A question must have an id'],
        unique: [true, "A question must have it's own unique id"],
        length: [3, 'A question id must have 3 characters'],
        /* Με καποιο τροπο πρεπει να εξασφαλισουμε οτι το id θα ειναι της μορφης Q00*/
    },
    qtext: {
        type: String,
        required: [true, 'A question cannot be blank'],
    },
    required: {
        type: String,
        enum: {
            values: ['TRUE', 'FALSE'],
            message: ['Required is TRUE or FALSE'],
        },
        required: [true, 'You must answer this question!'],
    },
    type: {
        type: String,
        enum: ['question', 'profile'],
    },
    options: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Option',
        },
    ],
    wasAnsweredBy: {
        type: Number,
    },
    questionnaireID: {
        //type: mongoose.Schema.ObjectId,
        type: String,
        //ref: 'Questionnaire',
    },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
