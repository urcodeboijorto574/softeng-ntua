/* baseURL = http://localhost:{{port}}/intelliq_api */
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
exports.getAllSessions = async (req, res, next) => { };

/**
 * Returns every session's ID that exists in the data base.
 * @param {JSON} req - JSON object of which no field is used by the function.
 * @param {JSON} res - JSON object that contains the data to send.
 * @returns {JSON} - The response object.
 * 
 * URL: {baseURL}/sessions/sessionids
 */
exports.getAllSessionsIDs = async (req, res, next) => { };

/**
 * Returns all the questionnaires answered by a specified user.
 * @param {JSON} req - A request object of which only the field req.params is used.
 * @param {JSON} res - A response object that contains the data to send.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/sessions/getsession/:username/:questionnaireID
 */
exports.getSession = async (req, res, next) => { };
