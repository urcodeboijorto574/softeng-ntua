const Questionnaire = require('./../models/questionnaireModel');
const Question = require('./../models/questionModel');
const Option = require('./../models/optionModel');
const bp = require('body-parser');

exports.getHealthcheck = async (req, res, next) => {
    try {
        res.status(200).json({
            status: 'OK',
            dbconnection: `${process.env.DATABASE}`,
        });
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            dbconnection: `${process.env.DATABASE}`,
        });
    }
    next();
};

exports.storeOptionsFromQuestion = async (req, res, next) => {
    try {
        for (let i = 0; i < req.body.questions.length; i++) {
            for (let j = 0; j < req.body.questions[i].options.length; j++) {
                // σωζω στο option, το qID και το questionnaireID
                req.body.questions[i].options[j].questionnaireID =
                    req.body.questionnaireID;
                req.body.questions[i].options[j].qID =
                    req.body.questions[i].qID;
                var newOption = await Option.create(
                    req.body.questions[i].options[j]
                );
                req.body.questions[i].options[j] = newOption._id.toString();
            }
        }
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
    next();
};

exports.storeQuestionsFromQuestionnaire = async (req, res, next) => {
    try {
        for (let j = 0; j < req.body.questions.length; j++) {
            // σωζω στο στο πεδιο questionnaireID της ερωτησης, το ID του ερωτηματολογιου
            req.body.questions[j].questionnaireID = req.body.questionnaireID;
            var newQuestion = await Question.create(req.body.questions[j]);
            req.body.questions[j] = newQuestion._id.toString();
        }
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
    next();
};

exports.createQuestionnaire = async (req, res, next) => {
    try {
        const newQuestionnaire = await Questionnaire.create(req.body);
        res.status(201).json({
            status: 'OK',
        });
        console.log('Questionnaire-end');
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
    next();
};

exports.resetAll = async (req, res, next) => {
    try {
        await Questionnaire.deleteMany();
        await Question.deleteMany();
        await Option.deleteMany();
        res.status(200).json({
            status: 'OK',
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            reason: err,
        });
    }
    next();
};
