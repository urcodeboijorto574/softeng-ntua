/* baseURL = http://localhost:{{port}}/intelliq_api */
const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const json2csv = require('json2csv');

/**
 * Stores an answer object in the database.
 * @param {JSON} req - JSON object of which req.params contains the questionnaireID, questionID, sessionID and option ID.
 * @param {JSON} res - JSON object that contains a confirmation or decline of the request.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/doanswer/:questionnaireID/:questionID/:session/:optionID
 */
exports.doAnswer = async (req, res, next) => { };
