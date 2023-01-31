const fs = require('fs');
const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const User = require(`${__dirname}/../models/userModel.js`);
const Models = [Answer, Session, Option, Question, Questionnaire, User];

/**
 * Imports all the data from the folder data/ to the data base.
 * @param {JSON} req - JSON object of which no field is used in the function.
 * @param {JSON} res - JSON object that contains a confirmation/rejection of the request.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/dummy-data/import
 */
exports.importData = async (req, res, next) => { };

/**
 * Deletes all the data from the DB.
 * @param {JSON} req - JSON object of which no field is used in the function.
 * @param {JSON} res - JSON object that contains a confirmation/rejection of the request.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/dummy-data/delete
 */
exports.deleteData = async (req, res, next) => { };
