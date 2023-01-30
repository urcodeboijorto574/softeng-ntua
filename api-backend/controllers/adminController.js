const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const AppError = require('./../utils/appError.js');
// const User = require(`${__dirname}/../models/useerModel.js`);

dotenv.config({ path: `${__dirname}/../config.env` });

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    //const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const value = Object.values(err.keyValue);

    console.log(value);

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

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
            useUnifiedTopology: true /* Only for Ioannis' PC */,
        })
        .then(
            () => {
                /* DB connection check is successful */
                return res.status(200).json({
                    status: 'OK',
                    dbconnection: DB,
                });
            },
            (err) => {
                /* DB connection check failed */
                return res.status(500).json({
                    status: 'failed',
                    err,
                });
            }
        );
};

exports.resetAll = async (req, res, next) => {
    try {
        let questionnaires, questions, sessions, options, answers; //, users;
        questionnaires = await Questionnaire.deleteMany();
        questions = await Question.deleteMany();
        sessions = await Session.deleteMany();
        options = await Option.deleteMany();
        answers = await Answer.deleteMany();
        // users = await User.deleteMany();

        return res.status(402).json({
            status: 'OK',
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            reason: err,
        });
    }
    next();
};

exports.resetQuestionnaire = async (req, res, next) => {
    try {
        const questionnaire = await Questionnaire.findOne(req.params);
        if (!questionnaire)
            return res.status(400).json({
                status: 'failed',
                reason: 'Invalid questionnaireID',
            });

        const sessions = await Session.find(req.params);

        sessions.forEach(async (session) => {
            await Answer.deleteMany(session.answers);
            session.answers.forEach(async (ans) => {
                await Answer.deleteMany(req.params);
            });
            await Session.deleteOne(session);
        });

        return res.status(200).json({
            status: 'OK',
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            reason: err,
        });
    }
    next();
};
