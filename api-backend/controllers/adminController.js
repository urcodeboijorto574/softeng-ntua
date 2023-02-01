const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });

/**
 * Checks if the remote DB is connected with the API.
 * @param {JSON} req - JSON object of which no field is used in the function.
 * @param {JSON} res - JSON object that contains a confirmation/rejection of the request.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/admin/healthcheck
 */
exports.getHealthcheck = async (req, res, next) => {
    /* This line is added only for temporary purposes */
    return res.status('418').json({ status: 'no operation', message: 'I\'m a teapot' });
};

/**
 * Creates a questionnaire and saves it in the DB.
 * @param {JSON} req - JSON object of which req.body has the to-be-created questionnaire.
 * @param {JSON} res - JSON object that contains the data to send.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/admin/questionnaire_upd
 */
exports.questionnaireUpdate = async (req, res, next) => {
    /* This line is added only for temporary purposes */
    return res.status('418').json({ status: 'no operation', message: 'I\'m a teapot' });
};

/**
 * Deletes every document that exists in the DB, except the super-admin user document.
 * @param {JSON} req - JSON object of which no field is used.
 * @param {JSON} res - JJSON object that contains a confirmation/rejection of the request.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/admin/resetall
 */
exports.resetAll = async (req, res, next) => {
    /* This line is added only for temporary purposes */
    return res.status('418').json({ status: 'no operation', message: 'I\'m a teapot' });
};

/**
 * Deletes all the sessions and answers submitted to a questionnare.
 * @param {JSON} req - JSON object of which req.body has the questionnaireID of the  specified questionnaire.
 * @param {JSON} res - JSON object that contains a confirmation/rejection of the request.
 * @return {JSON} - The reponse object created.
 */
exports.resetQuestionnaire = async (req, res, next) => {
    /* This line is added only for temporary purposes */
    return res.status('418').json({ status: 'no operation', message: 'I\'m a teapot' });
};
