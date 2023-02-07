const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const User = require(`${__dirname}/../models/userModel.js`);
const mongoose = require('mongoose');

/**
 * Middleware that returns all the questionnaires that have been created by the logged-in admin.
 * @param {JSON} req - JSON request object containing the username of the logged-in admin (req.username).
 * @param {JSON} res - JSON response object containing the requested questionnaires (res.data.questionnaires).
 * @param {function} next - the next middleware in the middleware stack.
 * @returns {JSON} - The response object res.
 *
 * URL: {baseURL}/questionnaire/getadmincreatedquestionnaires
 */
exports.getAdminCreatedQuestionnaires = async (req, res, next) => {
    try {
        let questionnaires = await Questionnaire.find(
            { creator: req.username },
            '-_id -creator'
        )
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

        const questionnairesFound = questionnaires.length > 0;
        return res.status(questionnairesFound ? 200 : 402).json({
            status: questionnairesFound ? 'OK' : 'no data',
            data: {
                questionnaires: questionnaires,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: error,
        });
    }
    next();
};

/**
 * Middleware that returns all the questionnaires that have been answered by the logged-in user.
 * @param {JSON} req - JSON request object containing the username of the logged-in user (req.username).
 * @param {JSON} res - JSON response object containing the requested questionnaires (res.data.questionnaires).
 * @param {function} next - the next middleware in the middleware stack.
 * @returns {JSON} - The response object res.
 *
 * URL: {baseURL}/questionnaire/getuseransweredquestionnaires
 */
exports.getUserAnsweredQuestionnaires = async (req, res, next) => {
    try {
        let user = await User.findOne(
            { username: req.username },
            'questionnairesAnswered'
        ).populate({
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
                },
            },
        });

        const answeredQuestionnaires = user.questionnairesAnswered;
        const questionnairesFound = answeredQuestionnaires.length > 0;

        return res.status(questionnairesFound ? 200 : 402).json({
            status: questionnairesFound ? 'OK' : 'no data',
            data: {
                answeredQuestionnaires,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: error,
        });
    }
    next();
};

/**
 * Middleware that returns all the questionnaires that have not been answered by the logged-in user yet.
 * @param {JSON} req - JSON request object containing the username of the logged-in user (req.username).
 * @param {JSON} res - JSON response object containing the requested questionnaires (res.data.questionnaires).
 * @param {function} next - the next middleware in the middleware stack.
 * @returns {JSON} - The response object res.
 *
 * URL: {baseURL}/questionnaire/getusernotansweredquestionnaires
 */
exports.getUserNotAnsweredQuestionnaires = async (req, res, next) => {
    /* (NOT FINISHED) */
    try {
        const user = await User.findOne(
            { username: req.username },
            'questionnairesAnswered'
        );

        const notAnsweredQuestionnaires = await Questionnaire.find(
            {},
            '_id keywords questions questionnaireID questionnaireTitle'
        )
            .sort('_id')
            .where('_id')
            .nin(user.questionnairesAnswered)
            .populate({
                path: 'questions',
                model: 'Question',
                select: '-_id qID qtext required type options',
                sort: 'qID',
                populate: {
                    path: 'options',
                    model: 'Option',
                    select: '-_id optID opttxt nextqID wasChosenBy',
                    sort: 'optID',
                },
            });

        const questionnairesFound = notAnsweredQuestionnaires.length > 0;
        return res.status(questionnairesFound ? 200 : 402).json({
            status: questionnairesFound ? 'OK' : 'no data ',
            data: {
                notAnsweredQuestionnaires,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: error,
        });
    }
    next();
};

/**
 * Middlware that remove a particular questionnaire from the data base.
 * @param {JSON} req - JSON request object containing the questionnaireID of the to-be-deleted questionnaire (req.params).
 * @param {JSON} res - JSON respnse object containing a confirmation/rejection of the request.
 * @param {*} next - the next middlware in the middleware stack.
 * @returns - The response object res.
 *
 * URL: {baseURL}/questionnaire/deletequestionnaire/:questionnaireID
 */
exports.deleteQuestionnaire = async (req, res, next) => {
    try {
        const questionnaire = await Questionnaire.findOne(
            req.params,
            '_id'
        ).select('creator');

        if (!questionnaire) {
            return res.status(400).json({
                status: 'failed',
                message: 'bad request',
            });
        }
        if (
            req.userRole !== 'super-admin' &&
            req.username !== questionnaire.creator
        ) {
            return res.status(401).json({
                status: 'failed',
                reason: 'Not authorised',
            });
        }

        const retQuestionnaireObj = await Questionnaire.deleteMany(req.params);

        console.log('retQuestionnaireObj:', retQuestionnaireObj);

        if (retQuestionnaireObj.deletedCount == 1) {
            await Question.deleteMany(req.params);
            await Option.deleteMany(req.params);
            await Session.deleteMany(req.params);
            await Answer.deleteMany(req.params);
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Questionnaire and related documents deleted successfully',
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err,
        });
    }
    next();
};

/**
 * Middleware that returns a particular questionnaire by the logged-in ***.
 * @param {JSON} req - JSON object of which req.params contains the questionnaireID (req.params.questionnaireID).
 * @param {JSON} res - JSOn object that contains the data to send.
 * @param {function} next - the next middleware in the middleware stack.
 * @returns {JSON} - The response object res.
 *
 * URL: {baseURL}/questionnaire/:questionnaireID/
 */
exports.getQuestionnaire = async (req, res) => {
    try {
        const questionnaire = await Questionnaire.findOne({
            questionnaireID: req.params.questionnaireID,
        })
            .select({ _id: 0, __v: 0 })
            .populate({
                path: 'questions',
                select: {
                    _id: 0,
                    __v: 0,
                    wasAnsweredBy: 0,
                    options: 0,
                    questionnaireID: 0,
                },
                options: { sort: { qID: 1 } },
            });
        if (!questionnaire) {
            return res.status(400).json({
                status: 'fail',
                message: `Questionnaire ID ${req.params.questionnaireID} not found`,
            });
        }

        if (!(req.username === questionnaire.creator)) {
            return res
                .status(401)
                .json({ status: 'Failed', message: 'Access denied' });
        }

        return res
            .status(200)
            .json({ status: 'OK', questionnaire: questionnaire });
    } catch (err) {
        return res
            .status(500)
            .json({ status: 'Failed', message: 'Internal server error' });
    }
};
