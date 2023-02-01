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
 * URL: {baseURL}/questionnaire/getallquestionnaires
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
 * Returns all the questionnaires that a specified user has answered.
 * @param {JSON} req - JSON object that contains the 
 * @param {JSON} res - JSON object that contains the 
 * @param {JSON} next - pointer to the next middleware function
 * @return {JSON} - The response object.
 * 
 * URL: {baseURL}/questionnaire/:questionnaireID
 */
exports.getUserQuestionnaires = async (req, res, next) => {
    /* This line is added only for temporary purposes */
    return res.status('418').json({ status: 'no operation', message: 'I\'m a teapot' });
};

/**
 * Returns all the info about a questionnaire (and its qusetions).
 * @param {JSON} req - JSON object of which req.params contains the questionnaireID.
 * @param {JSON} res - JSOn object that contains the data to send.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/questionnaire/:questionnaireID/
 */
exports.getQuestionnaire = async (req, res, next) => {
    /* This line is added only for temporary purposes */
    return res.status('418').json({ status: 'no operation', message: 'I\'m a teapot' });
};


/**
 * Removes a questionnaire and all related entities from the DB.
 * @param {JSON} req - JSON object that contains the questionnaireID of the to-be-deleted questionnaire.
 * @param {JSON} res - JSON object that contains the data to send.
 * @return {JSON} - The response object created.
 * 
 * URL:  {baseURL}/questionnaire/:questionnaireID
 */
exports.deleteQuestionnaire = async (req, res, next) => {
    /* This line is added only for temporary purposes */
    return res.status('418').json({ status: 'no operation', message: 'I\'m a teapot' });
};

/**
 * Returns all the questionnaires that a user has answered.
 * @param {JSON} req - JSON object that contains the username of the specified user.
 * @param {JSON} res - JSON object that contains the data to send.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/questionnaire/userquestionnaires/:username
 */
exports.getUserQuestionnaires = async (req, res, next) => {
    /* This line is added only for temporary purposes */
    return res.status('418').json({ status: 'no operation', message: 'I\'m a teapot' });
};
