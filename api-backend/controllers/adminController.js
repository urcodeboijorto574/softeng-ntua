/* baseURL = http://localhost:{{port}}/intelliq_api */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });

/**
 * Checks if the remote DB is connected with the API.
 * @param {JSON} req - JSON object of which no field is used in the function.
 * @param {JSON} res - JSON object that contains the response.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/admin/healthcheck
 */
exports.getHealthcheck = async (req, res, next) => { }

/**
 * Creates a questionnaire and saves it in the DB.
 * @param {JSON} req - JSON object of which req.body has the to-be-created questionnaire.
 * @param {JSON} res - JSON object that contains the data to send.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/admin/questionnaire_upd
 */
exports.questionnaireUpdate = async (req, res, next) => { };
