const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });

const csv = require('csv-express');

const User = require(`${__dirname}/../models/userModel.js`);
const Answer = require('../models/answerModel');
const Option = require('../models/optionModel');
const Question = require('../models/questionModel');
const Questionnaire = require('../models/questionnaireModel');
const Session = require('../models/sessionModel');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// error-handling functions
const handleDuplicateFieldsDB = (req, res, err) => {
    const message = 'All IDs must be unique';
    if (req.query.format === 'csv') {
      return res.status(400).csv([{ status: 'failed', reason: message }], true);
    }
    return res.status(400).json({
      status: 'failed',
      reason: message,
    });
};

const handleValidationErrorDB = (req, res, err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
  
    const message = `Invalid input data. ${errors.join('. ')}`;
    if (req.query.format === 'csv') {
      return res.status(400).csv([{ status: 'failed', reason: message }], true);
    }
    return res.status(400).json({
      status: 'failed',
      reason: message,
    });
};

/**
 * Checks if the connection between the API and the (remote) data base is OK.
 * @param {JSON} req - JSON request object containing the username of the *** (req.username).
 * @param {JSON} res - JSON response object that contains a confirmation/rejection of the request.
 * @return {JSON} - The response object created.
 *
 * URL: {baseURL}/admin/healthcheck
 */
exports.getHealthcheck = async (req, res, next) => {
    try {
        const state = mongoose.connection.readyState;
        if (!req.query.format || req.query.format === 'json') {
          if (state === 1) {
            return res.status(200).json({
              status: 'OK',
              dbconnection: DB,
            });
          } else {
            return res.status(500).json({
              status: 'failed',
              dbconnection: DB,
            });
          }
        } else if (req.query.format === 'csv') {
          if (state === 1) {
            return res.status(200).csv([{ status: 'OK', dbconnection: DB }], true);
          } else {
            return res.status(500).csv([{ status: 'failed', dbconnection: DB }], true);
          }
        } else {
          return res.status(400).json({
            status: 'failed',
            reason: 'Response format is json or csv',
          });
        }
      } catch (err) {
        if (req.query.format === 'csv') {
          return res.status(500).csv([{ status: 'failed', reason: err }], true);
        } else {
          return res.status(500).json({
            status: 'failed',
            reason: err,
          });
        }
      }
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
    try {
        const file = req.file;
        fs.readFile(
          `${file.destination}/${file.originalname}`,
          'utf8',
          async (err, data) => {
            if (err) {
              console.error(err);
              if (req.query.format === 'csv') {
                return res
                  .status(500)
                  .csv([{ status: 'failed', reason: 'Could not read file' }], true);
              }
              return res.status(500).json({
                status: 'failed',
                reason: 'Could not read file',
              });
            }
            try {
              const info = JSON.parse(data);
              try {
                if (
                  !req.query.format ||
                  req.query.format === 'json' ||
                  req.query.format === 'csv'
                ) {
                  const newQuestionnaire = await Questionnaire.create({
                    questionnaireID: info.questionnaireID,
                    questionnaireTitle: info.questionnaireTitle,
                    keywords: info.keywords,
                    creator: req.username,
                  });
                  try {
                    let len = info.questions.length;
                    for (let i = 0; i < len; i += 1) {
                      // eslint-disable-next-line no-await-in-loop
                      let newQuestion = await Question.create({
                        qID: info.questions[i].qID,
                        qtext: info.questions[i].qtext,
                        required: info.questions[i].required,
                        type: info.questions[i].type,
                        wasAnsweredBy: 0,
                        questionnaireID: info.questionnaireID,
                      });
                      let len1 = info.questions[i].options.length;
                      for (let j = 0; j < len1; j += 1) {
                        // eslint-disable-next-line no-await-in-loop
                        let newOption = await Option.create({
                          optID: info.questions[i].options[j].optID,
                          opttxt: info.questions[i].options[j].opttxt,
                          nextqID: info.questions[i].options[j].nextqID,
                          questionnaireID: info.questionnaireID,
                          qID: info.questions[i].qID,
                          wasChosenBy: 0,
                        });
    
                        // eslint-disable-next-line no-await-in-loop
                        let addOption = await Question.updateOne(
                          { qID: info.questions[i].qID },
                          { $push: { options: newOption } }
                        );
                      }
    
                      // eslint-disable-next-line no-await-in-loop
                      let addQuestion = await Questionnaire.updateOne(
                        { questionnaireID: info.questionnaireID },
                        { $push: { questions: newQuestion } }
                      );
                    }
                    if (req.query.format === 'csv') {
                      return res.status(200).csv([{ status: 'OK' }], true);
                    } else {
                      return res.status(200).json({
                        status: 'OK',
                      });
                    }
                  } catch (error) {
                    await Promise.all([
                      Questionnaire.deleteMany({
                        questionnaireID: info.questionnaireID,
                      }),
                      Question.deleteMany({
                        questionnaireID: info.questionnaireID,
                      }),
                      Option.deleteMany({
                        questionnaireID: info.questionnaireID,
                      }),
                    ]);
                    if (error.code === 11000) {
                      error = handleDuplicateFieldsDB(req, res, error);
                    } else if (error.name === 'ValidationError') {
                      error = handleValidationErrorDB(req, res, error);
                    } else {
                      if (req.query.format === 'csv') {
                        return res
                          .status(500)
                          .csv([{ status: 'failed', reason: err }], true);
                      }
                      return res.status(500).json({
                        status: 'failed',
                        reason: err,
                      });
                    }
                  }
                } else {
                  return res.status(400).json({
                    status: 'failed',
                    reason: 'Response format is json or csv',
                  });
                }
              } catch (error) {
                if (error.code === 11000) {
                  error = handleDuplicateFieldsDB(req, res, error);
                } else if (error.name === 'ValidationError') {
                  error = handleValidationErrorDB(req, res, error);
                } else {
                  if (req.query.format === 'csv') {
                    return res
                      .status(500)
                      .csv([{ status: 'failed', reason: err }], true);
                  }
                  return res.status(500).json({
                    status: 'failed',
                    reason: err,
                  });
                }
              }
            } catch (err2) {
              if (req.query.format === 'csv') {
                return res
                  .status(500)
                  .csv([{ status: 'failed', reason: 'Invalid file structure' }], true);
              }
              return res.status(500).json({
                status: 'failed',
                reason: 'Invalid file structure',
              });
            }
          }
        );
      } catch (err) {
        if (req.query.format === 'csv') {
          return res
            .status(500)
            .csv([{ status: 'failed', reason: 'Could not read file' }], true);
        }
        return res.status(500).json({
          status: 'failed',
          reason: 'Could not read file',
        });
      }
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
    try {
        if (
          !req.query.format ||
          req.query.format === 'json' ||
          req.query.format === 'csv'
        ) {
          await Promise.all([
            User.deleteMany({ role: { $ne: 'super-admin' } }),
            Answer.deleteMany(),
            Option.deleteMany(),
            Question.deleteMany(),
            Questionnaire.deleteMany(),
            Session.deleteMany(),
          ]);
          if (req.query.format === 'csv') {
            return res.status(200).csv([{ status: 'OK' }], true);
          } else {
            return res.status(200).json({
              status: 'OK',
            });
          }
        } else {
          return res.status(400).json({
            status: 'failed',
            reason: 'Response format is json or csv',
          });
        }
      } catch (err) {
        if (req.query.format === 'csv') {
          return res.status(500).csv([{ status: 'failed', reason: err }], true);
        } else {
          return res.status(500).json({
            status: 'failed',
            reason: err,
          });
        }
      }
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
    try {
        if (
          !req.query.format ||
          req.query.format === 'json' ||
          req.query.format === 'csv'
        ) {
          const ID = req.params.questionnaireID;
          const valid = await Questionnaire.findOne({ questionnaireID: ID });
          if (!valid) {
            return res.status(400).json({
              status: 'failed',
              reason: 'Invalid questionnaireID',
            });
          }
          if (req.userRole !== 'super-admin' && req.username !== valid.creator) {
            if (req.query.format === 'csv') {
              return res.status(401).csv([{ status: 'failed', reason: 'Not authorised' }], true);
            } else {
              return res.status(401).json({
                status: 'failed',
                reason: 'Not authorised',
              });
          }
        }
          await Promise.all([
            Answer.deleteMany({ questionnaireID: ID }),
            Session.deleteMany({ questionnaireID: ID }),
            Option.updateMany(
              { questionnaireID: ID },
              { $set: { wasChosenBy: 0 } }
            ),
            Question.updateMany(
              { questionnaireID: ID },
              { $set: { wasAnsweredBy: 0 } }
            ),
            User.updateMany(
              { questionnairesAnswered: { $in: [valid._id] } },
              { $pull: { questionnairesAnswered: valid._id } }
            ),
          ]);
          if (req.query.format === 'csv') {
            return res.status(200).csv([{ status: 'OK' }], true);
          } else {
            return res.status(200).json({
              status: 'OK',
            });
          }
        } else {
          return res.status(400).json({
            status: 'failed',
            reason: 'Response format is json or csv',
          });
        }
      } catch (err) {
        if (req.query.format === 'csv') {
          return res.status(500).csv([{ status: 'failed', reason: err }], true);
        } else {
          return res.status(500).json({
            status: 'failed',
            reason: err,
          });
        }
      }
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
