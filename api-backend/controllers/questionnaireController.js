const Questionnaire = require(`${__dirname}/../models/questionnaireModel`);
const Question = require(`${__dirname}/../models/questionModel`);
const Option = require(`${__dirname}/../models/optionModel`);
const Session = require(`${__dirname}/../models/sessionModel`);
const Answer = require(`${__dirname}/../models/answerModel`);
const User = require(`${__dirname}/../models/userModel`);


exports.getAllQuestionnaires = async (req, res, next) => {
    try {
        let questionnaires = await Questionnaire
            .find({}, '-_id')
            .sort('questionnaireID')
            .populate({
                path: 'questions',
                model: 'Question',
                select: {
                    '_id': 0,
                    '__v': 0,
                    'wasAnsweredBy': 0,
                    'questionnaireID': 0
                },
                populate: {
                    path: 'options',
                    model: 'Option',
                    select: {
                        '_id': 0,
                        '__v': 0
                    }
                },
            });

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

exports.getUserQuestionnaires = async (req, res, next) => {
    try {
        // req.params = {username: 'jorto574'}
        const user = await User
            .findOne(req.params)
            .populate({
                path: 'questionnaires',
                model: 'Questionnaire',
                select: {
                    '_id': 0
                },
                sort: {
                    'questionnaireID': 1
                }
            });

        return res.status(user && user.questionnaires ? 200 : 402).json({
            status: 'success',
            data: user.questionnaires
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            msg: err
        });
    }
};
