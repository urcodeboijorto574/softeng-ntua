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
                select: '-_id -__v -questionnaireID -wasAnsweredBy',
                sort: 'qID',
                populate: {
                    path: 'options',
                    model: 'Option',
                    select: '-_id -__v',
                    sort: 'optID',
                },
            });

        const questionnairesFound = questionnaires && questionnaires !== 0;
        return res.status(questionnairesFound ? 200 : 402).json({
            status: questionnairesFound ? 'OK' : 'no data',
            data: {
                questionnaires: questionnairesFound ? questionnaires : []
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err
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
    try {
        /* Check if given questionnaireID is valid */
        const theQuestionnaire = await Questionnaire
            .findOne(req.params, 'questionnaireID _id')
            .populate({
                path: 'questions',
                model: 'Question',
                select: {
                    '_id': 1,
                    'options': 1
                },
            });
        if (!theQuestionnaire) {
            return res.status(400).json({
                status: 'failed',
                message: `No questionnaire found with questionnaireID ${req.params.questionnaireID}`
            });
        }

        /* Delete the questionnaire and all related documents */
        theQuestionnaire.questions.forEach(async question => {
            question.options.forEach(async option_id => {
                await Option.findByIdAndRemove(option_id);
            });
            await Question.findByIdAndRemove(question['_id']);
        });
        await Questionnaire.findByIdAndRemove(theQuestionnaire['_id']);
        const sessions = await Session.find(req.params, '_id answers');
        sessions.forEach(async session => {
            session.answers.forEach(async answer_id => {
                await Answer.findByIdAndRemove(answer_id);
            });
            await Session.findByIdAndRemove(session['_id']);
        });

        return res.status(402).json({
            status: 'OK',
            message: `Everything related with questionnaire ${req.params.questionnaireID} has been deleted`
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err
        });
    }
    next();
};

/**
 * Returns all the questionnaires that a user has answered.
 * @param {JSON} req - JSON object that contains the username of the specified user.
 * @param {JSON} res - JSON object that contains the data to send.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/questionnaire/userquestionnaires/:username
 */
exports.getUserQuestionnaires = async (req, res, next) => { /* OK (NOT TESTED) */
    try {
        const queryObj = req.param;
        const user = await User
            .findOne({ username: req.username })
            .populate({
                path: 'questionnairesAnswered',
                model: 'Questionnaire',
                select: '-_id',
                sort: 'questionnaireID',
                populate: {
                    path: 'questions',
                    model: 'Question',
                    select: '-_id -__v -questionnaireID -wasAnsweredBy',
                    sort: 'qID',
                    populate: {
                        path: 'options',
                        model: 'Option',
                        select: '-_id -__v',
                        sort: 'optID',
                    }
                }
            });

        return res.status(user && user.questionnaires ? 200 : 402).json({
            status: 'success',
            data: user.questionnairesAnswered
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            msg: err
        });
    }
    next();
};
