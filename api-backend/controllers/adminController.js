const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });
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

exports.getHealthcheck = (req, res) => {
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
  
  exports.resetAll = async (req, res) => {
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
/**
 * URL: {baseURL}/intelliq_api/admin/healthcheck
 */
// exports.getHealthcheck = async (req, res, next) => {
//     /* DB is the database connection string */
//     const DB = process.env.DATABASE.replace(
//         '<password>',
//         process.env.DATABASE_PASSWORD
//     );

//     try {
//         await mongoose.connect(DB, {
//             useNewUrlParser: true,
//             useCreateIndex: true,
//             useFindAndModify: false,
//             useUnifiedTopology: true /* Only to suppress a possible warning */
//         });

//         return res.status(200).json({
//             status: 'OK',
//             dbconnection: DB
//         });
//     } catch (err) {
//         return res.status(500).json({
//             status: 'failed',
//             err
//         });
//     }
//     next();
//}

/**
 * URL: {baseURL}/intelliq_api/admin/questionnaire_upd
 */
exports.createQuestionnaire = async (req, res, next) => {
    try {
        for (let i = 0; i < req.body.questions.length; i++) {
            for (let j = 0; j < req.body.questions[i].length; j++) {
                optionsSave.push(req.body.questions[i].options[j]);
            }
        }
        // make questions of questionnaire empty and save questionnaire
        //req.body.questions.length = 0;
        let newQuestionnaire = await Questionnaire.create({
            questionnaireID: req.body.questionnaireID,
            questionnaireTitle: req.body.questionnaireTitle,
            keywords: req.body.keywords,
            questions: [],
        });
        for (let i = 0; i < req.body.questions.length; i++) {
            let newQuestion = await Question.create({
                qID: req.body.questions[i].qID,
                qtext: req.body.questions[i].qtext,
                required: req.body.questions[i].required,
                type: req.body.questions[i].type,
                options: [],
                questionnaireID: req.body.questionnaireID,
            });
            for (let j = 0; j < req.body.questions[i].options.length; j++) {
                let newOption = await Option.create({
                    optID: req.body.questions[i].options[j].optID,
                    opttxt: req.body.questions[i].options[j].opttxt,
                    nextqID: req.body.questions[i].options[j].nextqID,
                    qID: req.body.questions[i].qID,
                    questionnaireID: req.body.questionnaireID,
                });
                /* await Question.findOneAndUpdate(
                    {
                        qID: newQuestion.qID,
                        questionnaireID: newQuestion.questionnaireID,
                    },
                    { $push: { options: newOption._id.toString() } }
                ); */
                await newQuestion.updateOne({
                    $push: { options: newOption._id.toString() },
                });
            }
            /* await Questionnaire.findOneAndUpdate(
                { questionnaireID: newQuestionnaire.questionnaireID },
                { $push: { questions: newQuestion._id.toString() } }
            ); */
            await newQuestionnaire.updateOne({
                $push: { questions: newQuestion._id.toString() },
            });
        }

        return res.status(201).json({
            status: 'OK',
        });
    } catch (err) {
        await Questionnaire.deleteOne({
            questionnaireID: req.body.questionnaireID,
        });
        await Question.deleteMany({
            questionnaireID: req.body.questionnaireID,
        });
        await Option.deleteMany({
            questionnaireID: req.body.questionnaireID,
        });
        return res.status(500).json({
            status: 'error',
            message: err,
        });
    }
    next();
};
