const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Session = require(`${__dirname}/../models/sessionModel`);

dotenv.config({ path: `${__dirname}/../config.env` });

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

exports.getAllSessionsIDs = async (req, res, next) => {
    try {
        const sessionIDs = await Session
            .find({ sessionID: req.params.sessionID }, 'sessionID -_id -__v');

        return res.status(sessionIDs ? 200 : 402).json({
            status: success,
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
