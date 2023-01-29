const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const csv = require('csv-express');

const User = require('../models/userModel');
const Answer = require('../models/answerModel');
const Option = require('../models/optionModel');
const Question = require('../models/questionModel');
const Questionnaire = require('../models/questionnaireModel');
const Session = require('../models/sessionModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

exports.gethealthcheck = (req, res) => {
  const state = mongoose.connection.readyState;
  if (!req.query.format || req.query.format === 'json') {
    if (state === 1) {
      res.status(200).json({
        status: 'OK',
        dbconnection: DB,
      });
    } else {
      res.status(500).json({
        status: 'failed',
        dbconnection: DB,
      });
    }
  } else if (req.query.format === 'csv') {
    if (state === 1) {
      res.status(200).csv([{ status: 'OK', dbconnection: DB }], true);
    } else {
      res.status(500).csv([{ status: 'failed', dbconnection: DB }], true);
    }
  } else {
    res.status(400).json({
      status: 'failed',
      dbconnection: DB,
    });
  }
};

exports.doresetall = async (req, res) => {
  try {
    if (!req.query.format || req.query.format === 'json') {
      await Promise.all([
        User.deleteMany(),
        Answer.deleteMany(),
        Option.deleteMany(),
        Question.deleteMany(),
        Questionnaire.deleteMany(),
        Session.deleteMany(),
      ]);
      res.status(200).json({
        status: 'OK',
      });
    } else if (req.query.format === 'csv') {
      await Promise.all([
        User.deleteMany(),
        Answer.deleteMany(),
        Option.deleteMany(),
        Question.deleteMany(),
        Questionnaire.deleteMany(),
        Session.deleteMany(),
      ]);
      res.status(200).csv([{ status: 'OK' }], true);
    } else {
      res.status(400).json({
        status: 'failed',
        reason: 'Not valid url format',
      });
    }
  } catch (err) {
    if (req.query.format === 'csv') {
      res.status(500).csv([{ status: 'failed', reason: err }], true);
    } else {
      res.status(500).json({
        status: 'failed',
        reason: err,
      });
    }
  }
};

exports.resetQuestionnaire = async (req, res) => {
  try {
    if (!req.query.format || req.query.format === 'json') {
      const ID = req.params.id;
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
      ]);
      res.status(200).json({
        status: 'OK',
      });
    } else if (req.query.format === 'csv') {
      const ID = req.params.id;
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
      ]);
      res.status(200).csv([{ status: 'OK' }], true);
    } else {
      res.status(400).json({
        status: 'failed',
        reason: 'Not valid url format',
      });
    }
  } catch (err) {
    if (req.query.format === 'csv') {
      res.status(500).csv([{ status: 'failed', reason: err }], true);
    } else {
      res.status(500).json({
        status: 'failed',
        reason: err,
      });
    }
  }
};
