const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require(`${__dirname}/../models/userModel.js`);

dotenv.config({ path: `${__dirname}/../config.env` });

/**
 * Checks if the connection between the API and the (remote) data base is OK.
 * @param {JSON} req - JSON request object containing the username of the *** (req.username).
 * @param {JSON} res - JSON response object that contains a confirmation/rejection of the request.
 * @return {JSON} - The response object created.
 *
 * URL: {baseURL}/admin/healthcheck
 */
exports.getHealthcheck = async (req, res, next) => {
    /* This line is added only for temporary purposes */
    return res
        .status('418')
        .json({ status: 'no operation', message: "I'm a teapot" });
};

/**
 * Creates a questionnaire and saves it in the DB.
 * @param {JSON} req - JSON request object containing the data of the to-be-created questionnaire (req.body).
 * @param {JSON} res - JSON response object containing a confirmation/rejection of the request.
 * @return {JSON} - The response object.
 *
 * URL: {baseURL}/admin/questionnaire_upd
 */
exports.questionnaireUpdate = async (req, res, next) => {
    /* This line is added only for temporary purposes */
    return res
        .status('418')
        .json({ status: 'no operation', message: "I'm a teapot" });
};

/**
 * Deletes every document that exists in the DB, except the super-admin user document.
 * @param {JSON} req - JSON request object containing the username of the super-admin (req.username).
 * @param {JSON} res - JSON response object containing a confirmation/rejection of the request.
 * @return {JSON} - The response object.
 *
 * URL: {baseURL}/admin/resetall
 */
exports.resetAll = async (req, res, next) => {
    /* This line is added only for temporary purposes */
    return res
        .status('418')
        .json({ status: 'no operation', message: "I'm a teapot" });
};

/**
 * Deletes all the sessions and answers submitted to a questionnare.
 * @param {JSON} req - JSON request object containing the questionnaireID (req.params.questionnaireID).
 * @param {JSON} res - JSON response object containing a confirmation/rejection of the request.
 * @return {JSON} - The reponse object created.
 *
 * URL: {baseURL}/admin/resetq/:questionnaireID
 */
exports.resetQuestionnaire = async (req, res, next) => {
    /* This line is added only for temporary purposes */
    return res
        .status('418')
        .json({ status: 'no operation', message: "I'm a teapot" });
};

exports.deleteUser = async (req, res) => {
    try {
        let user = await User.findOne({
            username: req.params.username,
        });
        if (!user) {
            return res.status(400).json({
                status: 'failed',
                message: 'No user found with the given username.',
            });
        }
        await User.deleteOne({
            username: req.params.username,
        });
        return res.status(200).json({
            status: 'OK',
        });
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error',
        });
    }
};
