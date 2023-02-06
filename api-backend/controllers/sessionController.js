const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Questionnaire = require(`${__dirname}/../models/questionnaireModel`);
const Session = require(`${__dirname}/../models/sessionModel`);

dotenv.config({ path: `${__dirname}/../config.env` });

/**
 * Middleware that returns all the sessions corresponding to a specified questionaire.
 * @param {JSON} req - JSON request object containing the questionnaireID of the requested questionnaire (req.params.questionnaireID).
 * @param {JSON} res - JSON response object containing the requested sessions (req.data.sessions).
 * @param {function} next - the next middlware in the middleware stack.
 * @returns {JSON} - The response object res.
 * 
 * URL: {baseURL}/session/getallquestionnairesessions/:questionnaireID
 */
exports.getAllQuestionnaireSessions = async (req, res, next) => {
    try {
        const questionnaire = await Questionnaire.findOne(req.params, '_id');
        if (!questionnaire) {
            return res.status(400).json({
                status: 'failed',
                message: 'bad request'
            });
        }
        const sessions = await Session
            .find(req.params, '-_id sessionID answers')
            .populate({
                path: 'answers',
                mode: 'Answer',
                select: '-_id qID optID answertext',
                sort: 'sessionID'
            })
            .populate('answers', '-_id answertext qID optID')
            .sort('sessionID');

        const sessionsFound = sessions.length > 0;
        return res.status(sessionsFound ? 200 : 402).json({
            status: sessionsFound ? 'OK' : 'no data',
            data: {
                sessions
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: error
        });
    }
    next();
};

/**
 * Middleware that returns all the sessions' IDs currently in the data base.
 * @param {JSON} req - JSON request object
 * @param {JSON} res - JSON response object containing the requested sessions' IDs (req.data.sessionsIDs).
 * @returns {JSON} - The response object.
 * 
 * URL: {baseURL}/session/getallsessionsids

 */
exports.getAllSessionsIDs = async (req, res, next) => {
    try {
        const sessionsIDs = await Session
            .find({}, 'sessionID -_id');
        const sessionsIDsFound = sessionsIDs.length > 0;
        return res.status(sessionsIDsFound ? 200 : 402).json({
            status: sessionsIDsFound ? 'OK' : 'no data',
            data: {
                sessionsIDs
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: error
        });
    }
    next();
};

/**
 * Middleware that returns the session submitted by the logged-in user for a particular questionare.
 * @param {JSON} req - JSON request object containing the questionnaireID (req.params.questionnaireID) and the user's username (req.usrename).
 * @param {JSON} res - JSON response object containing the requested session (req.data.session).
 * @return {JSON} - The response object.
 * 
 * URL: {baseURL}/session/getuserquestionnairesession/:questionnaireID
 */
exports.getUserQuestionnaireSession = async (req, res, next) => {
    try {
        const questionnaire = await Questionnaire.findOne(req.params, '_id');
        if (!questionnaire) {
            return res.status(400).json({
                status: 'failed',
                message: 'bad request'
            });
        }
        const session = await Session
            .findOne({ questionnaireID: req.params.questionnaireID, submitter: req.username })
            .populate({
                path: 'answers',
                mode: 'Answer',
                select: '-_id qID optID answertext',
                sort: 'sessionID'
            })
            .populate('answers', '-_id answertext qID optID')
            .sort('sessionID');

        const sessionFound = session;
        return res.status(sessionFound ? 200 : 402).json({
            status: sessionFound ? 'OK' : 'no data',
            data: {
                session
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: error
        });
    }
    next();
};
