const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const optionSchema = new mongoose.Schema(
    {
        optID: {
            type: String,
            required: [true, 'An option must have an id'],
            unique: [true, "An option must have it's own unique id"],
        },
        opttxt: {
            type: String,
            required: [true, 'Option cannot be blank'],
        },
        nextqID: {
            type: String,
        },
        questionnaireID: {
            type: String,
            select: false,
        },
        qID: {
            type: String,
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
