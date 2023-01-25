const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Session = require('../models/sessionModel');
const { find } = require('../models/sessionModel');
const Option = require(`${__dirname}/../models/optionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
// const User = require(`${__dirname}/../models/useerModel.js`);

dotenv.config({ path: `${__dirname}/../config.env` });

exports.getHealthcheck = (req, res) => {
    /* DB is the database connection string */
    const DB = process.env.DATABASE.replace(
        '<password>',
        process.env.DATABASE_PASSWORD
    );

    mongoose
        .connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        .then(
            () => { /* DB connection check is successful */
                return res.status(200).json({
                    status: 'OK',
                    dbconnection: DB
                });
            },
            err => { /* DB connection check failed */
                return res.status(500).json({
                    status: 'failed',
                    dbconnection: DB
                });

            });
};

exports.resetAll = async (req, res) => {
    try {
        let questionnaires, questions, sessions, options, answers; //, users;
        // questionnaires = await Questionnaire.find(),
        // questions = await Question.find(),
        // sessions = await Session.find(),
        // options = await Option.find(),
        // answers = await Answer.find(),
        // users = await User.find();
        console.log('questionnaires:', await Questionnaire.find().then(arr => arr.length).catch(err => new Error(err)));
        console.log('\nquestions', await Question.find().then(arr => arr.length).catch(err => new Error(err)));
        console.log('\nsessions', await Session.find().then(arr => arr.length).catch(err => new Error(err)));
        console.log('\noptions', await Option.find().then(arr => arr.length).catch(err => new Error(err)));
        console.log('\nanswers', await Answer.find().then(arr => arr.length).catch(err => new Error(err)));
        console.log('\nusers', await User.find().then(arr => arr.length).catch(err => new Error(err)));

        return res.status(402).json({
            status: 'OK'
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            reason: err
        });
    }
};

exports.questionnaireUpdate = async (req, res) => {
    try {
        /* For the line below: need to parse data from multipart/form-data to JSON! */
        const newQuestionnaire = { questionnaireID: 4 };
        const newQuestions = [{ qID: 1 }];
        const newOptions = [{ optID: 10 }];

        const oldQuestionnaire = await Questionnaire.findOne(newQuestionnaire);
        // await Session.deleteMany({ questionnaireID: oldQuestionnaire.questionnaireID });
        if (oldQuestionnaire) {
            // await Questionnaire.delete(oldQuestionnaire);
            /* Delete the relevant data too... */
        }

        // await Questionnaire.create(newQuestionnaire);

        /* Create all necessary documents 'cascadingly' */
        newQuestionnaire.questions.forEach(async q_id => {
            // const newQuestion = await Question.create({
            //     _id: q_id,
            //     qID,
            //     qtext,
            //     required,
            //     type,
            //     options,
            //     questionnaireID: newQuestionnaire.questionnaireID
            // });

            // newQuestion.options.forEach(async opt_id => {
            //     await Option.create({
            //         _id: opt_id,
            //         optID,
            //         opttxt,
            //         nextqID,
            //         questionnaireID: newQuestionnaire.questionnaireID,
            //         qID: newQuestion.qID
            //     });
            // });
        });

        return res.status(200).json({
            status: 'success',
            newQuestionnaire
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            reason: err
        });
    }
};

exports.resetQuestionnaire = async (req, res) => {
    try {
        const questionnaire = await Questionnaire.findOne(req.params);
        if (!questionnaire)
            return res.status(400).json({
                status: 'OK'
            });

        const answers = await Answer.find(req.params);

        answers.forEach(async el => {
            const session = await Session.findOne({ sessionID: el.sessionID });
            console.log(session.sessionID); // delete session;
            console.log(el.answertext); // delete el;
        });

        return res.status(200).json({
            status: 'OK'
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            reason: err
        });
    }
    next();
};
