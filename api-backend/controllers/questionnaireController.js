const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const User = require(`${__dirname}/../models/userModel.js`);
const json2csv = require('json2csv');

/**
 * Returns all the information about every questionnaire in the data base.
 * @param {JSON} req - JSON object of which no field is used in the function.
 * @param {JSON} res - JSON object that contains a confirmation or a decline of the request.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/intelliq_api/questionnaire/getallquestionnaires
 */
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

/**
 * Removes a questionnaire and all related entities from the DB.
 * @param {JSON} req - JSON object that contains the questionnaireID of the to-be-deleted questionnaire.
 * @param {JSON} res - JSON object taht contains the data to send.
 * @return {JSON} - The response object created.
 * 
 * URL:  {baseURL}/intelliq_api/questionnaire/:questionnaireID
 */
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

        /* Delete the questionnaire and all related documents */
        await Questionnaire.delete(theQuestionnaire);
        await Question.deleteMany(req.params);
        await Option.deleteMany(req.params);
        await Session.deleteMany(req.params);
        await Answer.deleteMany(req.params);

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

/**
 * Returns all the questionnaires that a user has answered.
 * @param {JSON} req - JSON object that contains the username of the specified user.
 * @param {JSON} res - JSON object taht contains the data to send.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/intelliq_api/questionnaire/userquestionnaires/:username
 */
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
    next();
};
