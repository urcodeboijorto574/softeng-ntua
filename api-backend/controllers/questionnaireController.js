const Questionnaire = require(`${__dirname}/../models/questionnaireModel`);
const Question = require(`${__dirname}/../models/questionModel`);
const Option = require(`${__dirname}/../models/optionModel`);
const Session = require(`${__dirname}/../models/sessionModel`);
const Answer = require(`${__dirname}/../models/answerModel`);
const User = require(`${__dirname}/../models/userModel`);
const mongoose = require('mongoose');
const json2csv = require('json2csv');

exports.getAllQuestionnaires = async (req, res) => {
    try {
        let questionnaires = await Questionnaire.find({}, '-_id')
            .sort('questionnaireID')
            .populate({
                path: 'questions',
                model: 'Question',
                select: {
                    _id: 0,
                    __v: 0,
                    wasAnsweredBy: 0,
                    questionnaireID: 0,
                },
                populate: {
                    path: 'options',
                    model: 'Option',
                    select: {
                        _id: 0,
                        __v: 0,
                    },
                },
            });

        return res.status(questionnaires.length !== 0 ? 200 : 402).json({
            status: questionnaires.length !== 0 ? 'success' : 'no data',
            data: {
                questionnaires,
            },
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            msg: err,
        });
    }
    next();
};

exports.getQuestionnaire = async (req, res, next) => {
    try {
        const questionnaire = await Questionnaire.findOne(
            req.params,
            '-_id'
        ).populate('questions', 'qID qtext required type -_id');

        res.status(questionnaire ? 200 : 400);

        if (!req.query.format || req.query.format === 'json') {
            return res.json({
                status: questionnaire ? 'success' : 'bad request',
                data: { questionnaire },
            });
        } else if (req.query.format === 'csv') {
            const fieldNames = ['ID', 'Title', 'Question', 'Keyword'];
            let retval = [];

            /* Fill retval array */
            for (
                let i = 0, index = 0;
                i < questionnaire.questions.length;
                ++i
            ) {
                for (let j = 0; j < questionnaire.keywords.length; ++j) {
                    retval[index++] = {
                        ID: questionnaire.questionnaireID,
                        Title: questionnaire.questionnaireTitle,
                        Question: questionnaire.questions[i],
                        Keyword: questionnaire.keywords[j],
                    };
                }
            }

            /* Parse data to result: csv variable */
            const json2csvparser = new json2csv.Parser({ fieldNames });
            const result = json2csvparser.parse(retval);
            console.log('result:');
            console.log(result);

            return res.send(result);
        } else {
            return res.status(400).json({
                status: 'fail',
                msg: 'Content-type can be either application/json or text/csv',
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            msg: err,
        });
    }
    next();
};

exports.deleteQuestionnaire = async (req, res, next) => {
    try {
        /* Check if given questionnaireID is valid */
        const theQuestionnaire = await Questionnaire.findOne(
            req.params,
            'questionnaireID _id'
        );
        if (!theQuestionnaire) {
            return res.status(400).json({
                status: 'bad request',
                msg: `No questionnaire found with questionnaireID ${req.params.questionnaireID}`,
            });
        }

        /* Delete the questionnaire itself */
        await Questionnaire.delete(theQuestionnaire);

        /* Delete relevant documents */
        const questions = await Question.deleteMany(req.params);
        if (questions) await Option.deleteMany(req.params);
        const sessions = await Session.deleteMany(req.params);
        if (sessions) await Answer.deleteMany(req.params);

        /* Show in console the deleted documents */
        console.log('theQuestionnaire:', theQuestionnaire);
        console.log('questions:', questions);
        console.log('options:', options);
        console.log('sessions:', sessions);
        console.log('answers:', answers);

        return res.status(402).json({
            status: 'success',
            msg: `Everything related with questionnaire ${req.params.questionnaireID} has been deleted`,
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            msg: err,
        });
    }
    next();
};

exports.getUserQuestionnaires = async (req, res, next) => {
    try {
        // req.params = {username: 'jorto574'}
        const user = await User.findOne(req.params).populate({
            path: 'questionnaires',
            model: 'Questionnaire',
            select: {
                _id: 0,
            },
            sort: {
                questionnaireID: 1,
            },
        });

        return res.status(user && user.questionnaires ? 200 : 402).json({
            status: 'success',
            data: user.questionnaires,
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            msg: err,
        });
    }
};
