const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Session = require(`${__dirname}/../models/sessionModel`);
const User = require(`${__dirname}/../models/userModel`);

dotenv.config({ path: `${__dirname}/../config.env` });

/**
 * Returns every session's ID currently in the data base.
 * @param {JSON} req - JSON object that contains the questionnaireID of the specified questionnaire.
 * @param {JSON} res - JSON object that contains the data to send.
 * @return {JSON} - The response object.
 * 
 * URL: {baseURL}/sessions/getallsessions/:questionnaireID
 */
exports.getAllSessions = async (req, res, next) => {
    try {
        const sessions = await Session
            .find(req.params)
            .select('+answers +sessionID -questionnaireID -_id -__v')
            .populate('answers', '-_id answertext qID optID');

        return res.status(sessions || sessions.length !== 0 ? 200 : 402).json({
            status: 'OK',
            data: sessions
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
 * Returns every session's ID that exists in the data base.
 * @param {JSON} req - JSON object of which no field is used by the function.
 * @param {JSON} res - JSON object that contains the data to send.
 * @returns {JSON} - The response object.
 * 
 * URL: {baseURL}/sessions/sessionids
 */
exports.getAllSessionsIDs = async (req, res, next) => {
    try {
        const sessionIDs = await Session
            .find({}, 'sessionID -_id');

        return res.status(sessionIDs || sessionIDs !== 0 ? 200 : 402).json({
            status: 'success',
            data: sessionIDs
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
 * Returns all the questionnaires answered by a specified user.
 * @param {JSON} req - A request object of which only the field req.params is used.
 * @param {JSON} res - A response object that contains the data to send.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/sessions/getsession/:username/:questionnaireID
 */
exports.getSession = async (req, res, next) => {
    try {
        const sessions = await Session
            .find({ questionnaireID: req.params.questionnaireID })
            .populate({
                path: 'user',
                model: 'User',
                select: {
                    'username': 1
                }
            });

        const session = await sessions
            .findOne({ username: req.params.username });

        return res.status(session || session.length !== 0 ? 200 : 402).json({
            status: 'OK',
            data: session
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err
        });
    }
    next();
};
