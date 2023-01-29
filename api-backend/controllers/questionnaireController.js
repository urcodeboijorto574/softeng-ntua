const Questionnaire = require(`${__dirname}/../models/questionnaireModel`);
const Question = require(`${__dirname}/../models/questionModel`);
const Option = require(`${__dirname}/../models/optionModel`);
const Session = require(`${__dirname}/../models/sessionModel`);
const Answer = require(`${__dirname}/../models/answerModel`);

exports.getAllQuestionnaires = async (req, res) => {
    try {
        const questionnaires = await Questionnaire
            .find()
            .select({ _id: 0 })
            .populate('questions', { options: 0, _id: 0, __v: 0, questionnaireID: 0, wasAnsweredBy: 0 });

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
            // .findOne({ questionnaireID: req.params.questionnaireID })
            .findOne(req.params)
            .select('-_id')
            // .populate('questions', { qID: 1, qtext: 1, required: 1, type: 1, _id: 0 });
            .populate('questions', 'qID qtext required type -_id');

        /* The query could be built by mongoose function, as so: */
        // const questionnaire = await Questionnaire.findOne()
        //     .where('questionnaireID')
        //     .equals(req.params.questionnaireID);
        // // .where('(other field)')
        // // .equals('(value)');

        return res.status(questionnaire ? 200 : 400).json({
            status: questionnaire ? 'success' : 'bad request',
            data: {
                questionnaire
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
        // await Questionnaire.delete(theQuestionnaire);

        /* Delete relevant documents */
        // const questions = await Question.deleteMany(req.params);
        // if (questions)
        //     await Option.deleteMany(req.params);
        // const sessions = await Session.deleteMany(req.params);
        // if (sessions)
        //     await Answer.deleteMany(req.params);

        /* Show in console the deleted documents */
        // console.log('theQuestionnaire:', theQuestionnaire);
        // console.log('questions:', questions);
        // console.log('options:', options);
        // console.log('sessions:', sessions);
        // console.log('answers:', answers);

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
