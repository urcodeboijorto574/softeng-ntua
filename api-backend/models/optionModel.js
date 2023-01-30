const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const optionSchema = new mongoose.Schema(
    {
        optID: {
            type: String,
            required: [true, 'An option must have an id'],
            //unique: [true, "An option must have it's own unique id"],
            //length: [6, 'An option id must have 5 characters'],
        },
        opttxt: {
            type: String,
            required: [true, 'Option cannot be blank'],
        },
        nextqID: {
            type: String,
            /* ref: 'Question',
            field: 'qID', */
            required: [true, 'Option must have a next question ID'],
            //ref: 'Question',
        },
        questionnaireID: {
            type: String,
            //ref: 'Questionnaire',
            select: false,
        },
        qID: {
            type: String,
            //ref: 'Question',
            select: false,
        },
        wasChosenBy: {
            type: Number,
            default: 0,
        },
    },
    { id: false }
);

const Option = mongoose.model('Option', optionSchema);

module.exports = Option;
