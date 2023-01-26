const Questionnaire = require(`${__dirname}/../models/questionnaireModel`);
const Question = require(`${__dirname}/../models/questionModel`);
const Option = require(`${__dirname}/../models/optionModel`);
const Session = require(`${__dirname}/../models/sessionModel`);
const Answer = require(`${__dirname}/../models/answerModel`);
const mongoose = require('mongoose');
const json2csv = require('json2csv');

exports.getAllQuestionnaires = async (req, res) => {
    try {
        let questionnaires = await Questionnaire
            .find({}, '-_id')
            .populate('questions', 'options qID qtext required type -_id');

        for (let i = 0; i < questionnaires.length; ++i) {
            for (let j = 0; j < questionnaires[i].questions.length; ++j) {
                for (let k = 0; k < questionnaires[i].questions[j].options.length; ++k) {
                    const idStr = questionnaires[i].questions[j].options[k];
                    const opt_id = mongoose.Types.ObjectId(idStr);
                    const option = await Option.findOne({ _id: opt_id }, 'wasChosenBy optID opttxt nextqID');
                    questionnaires[i].questions[j].options[k] = option;
                }
            }
        }
        return res.status(questionnaires.length !== 0 ? 200 : 402).json({
            status: questionnaires.length !== 0 ? 'success' : 'no data',
            data: {
                questionnaires
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            msg: err
        });
    }
    next();
};

exports.getQuestionnaire = async (req, res) => {
    try {
        const questionnaire = await Questionnaire
            .findOne(req.params, '-_id')
            .populate('questions', 'qID qtext required type -_id');

        res.status(questionnaire ? 200 : 400);

        if (req.query.format === 'json') {
            return res.json({
                status: questionnaire ? 'success' : 'bad request',
                data: { questionnaire }
            });
        } else if (req.query.format === 'csv') {
            const fieldNames = ['ID', 'Title', 'Question', 'Keyword'];
            let retval = [];

            /* Fill retval array */
            for (let i = 0, index = 0; i < questionnaire.questions.length; ++i) {
                for (let j = 0; j < questionnaire.keywords.length; ++j) {
                    retval[index++] = {
                        ID: questionnaire.questionnaireID,
                        Title: questionnaire.questionnaireTitle,
                        Question: questionnaire.questions[i],
                        Keyword: questionnaire.keywords[j]
                    };
                }
            }

            /* Parse data to result: csv variable */
            const json2csvparser = new json2csv.Parser({ fieldNames });
            const result = json2csvparser.parse(retval);
            console.log('result:'); console.log(result);

            return res.send(result);
        } else {
            return res.status(400).json({
                status: 'fail',
                msg: 'Content-type can be either application/json or text/csv'
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            msg: err
        });
    }
    next();
};

exports.deleteQuestionnaire = async (req, res, next) => {
    try {
        /* Check if given questionnaireID is valid */
        const theQuestionnaire = await Questionnaire.findOne(req.params, 'questionnaireID _id');
        if (!theQuestionnaire) {
            return res.status(400).json({
                status: 'bad request',
                msg: `No questionnaire found with questionnaireID ${req.params.questionnaireID}`
            });
        }

        /* Delete the questionnaire itself */
        await Questionnaire.delete(theQuestionnaire);

        /* Delete relevant documents */
        const questions = await Question.deleteMany(req.params);
        if (questions)
            await Option.deleteMany(req.params);
        const sessions = await Session.deleteMany(req.params);
        if (sessions)
            await Answer.deleteMany(req.params);

        /* Show in console the deleted documents */
        console.log('theQuestionnaire:', theQuestionnaire);
        console.log('questions:', questions);
        console.log('options:', options);
        console.log('sessions:', sessions);
        console.log('answers:', answers);

        return res.status(402).json({
            status: 'success',
            msg: `Everything related with questionnaire ${req.params.questionnaireID} has been deleted`
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            msg: err
        });
    }
    next();
};
