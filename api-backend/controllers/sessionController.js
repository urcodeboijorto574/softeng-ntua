const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Session = require(`${__dirname}/../models/sessionModel`);
const User = require(`${__dirname}/../models/userModel`);

dotenv.config({ path: `${__dirname}/../config.env` });

/**
 * URL: {baseURL}/intelliq_api/sessions/getallsessions/:questionnaireID
 */
exports.getAllSessions = async (req, res, next) => {
    try {
        const sessions = await Session
            .find(req.params)
            .select('+answers +sessionID -questionnaireID -_id -__v')
            .populate('answers', '-_id answertext qID optID');

        return res.status(sessions ? 200 : 402).json({
            status: 'success',
            data: sessions
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            reason: err.name,
            details: err.message
        });
    }
    next();
};

/**
 * URL: {baseURL}/intelliq_api/sessions/sessionids
 */
exports.getAllSessionsIDs = async (req, res, next) => {
    try {
        const sessionIDs = await Session
            .find({}, 'sessionID -_id');

        return res.status(sessionIDs ? 200 : 402).json({
            status: 'success',
            data: sessionIDs
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            reason: err.name,
            details: err.message
        });
    }
    next();
};

/**
 * URL: {baseURL}/intelliq_api/sessions/getsession/:username/:questionnaireID
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

        return res.status(session ? 200 : 402).json({
            status: 'success',
            data: session
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            reason: err.name,
            details: err.message
        });
    }
    next();
};
