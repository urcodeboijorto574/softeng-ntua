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

exports.questionnaireUpdate = async (req, res, next) => {
    var questionsSave = new Array();
    var optionsSave = new Array();
    var questionIDs = new Array();
    let newQuestionnaire;
    let newQuestion;
    let newOption;
    for (let i = 0; i < req.body.questions.length; i++) {
        questionIDs.push(req.body.questions[i].qID);
        /* for (let j = 0; j < req.body.questions[i].options.length; j++) {
            questionIDs.push(req.body.questions[i].options[j].nextqID);
        } */
    }
    questionIDs.push('-');
    // make questions of questionnaire empty and save questionnaire
    //req.body.questions.length = 0;
    try {
        newQuestionnaire = await Questionnaire.create({
            questionnaireID: req.body.questionnaireID,
            questionnaireTitle: req.body.questionnaireTitle,
            keywords: req.body.keywords,
            questions: [],
            creator: req.username,
        });
    } catch (err) {
        let error = { ...err };

        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }
        if (err.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        }
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }
    for (let i = 0; i < req.body.questions.length; i++) {
        try {
            newQuestion = await Question.create({
                qID: req.body.questions[i].qID,
                qtext: req.body.questions[i].qtext,
                required: req.body.questions[i].required,
                type: req.body.questions[i].type,
                options: [],
                questionnaireID: req.body.questionnaireID,
            });
        } catch (err) {
            await Questionnaire.deleteOne({
                questionnaireID: req.body.questionnaireID,
            });

            await Question.deleteMany({
                questionnaireID: req.body.questionnaireID,
            });
            let error = { ...err };

            if (err.name === 'CastError') error = handleCastErrorDB(error);
            if (err.code === 11000) {
                error = handleDuplicateFieldsDB(error);
            }
            if (err.name === 'ValidationError') {
                error = handleValidationErrorDB(error);
            }
            return res.status(error.statusCode).json({
                status: error.status,
                message: error.message,
            });
        }
        for (let j = 0; j < req.body.questions[i].options.length; j++) {
            try {
                newOption = await Option.create({
                    optID: req.body.questions[i].options[j].optID,
                    opttxt: req.body.questions[i].options[j].opttxt,
                    nextqID: req.body.questions[i].options[j].nextqID,
                    qID: req.body.questions[i].qID,
                    questionnaireID: req.body.questionnaireID,
                });
                if (!questionIDs.includes(newOption.nextqID)) {
                    throw new AppError(
                        'Field nextqID must correspond to an existing qID!',
                        400
                    );
                    /* return res.status(error.statusCode).json({
                        status: error.status,
                        message: error.message,
                    }); */
                }
                if (newOption.nextqID === newOption.qID) {
                    throw new AppError(
                        "A question can't have itself as a possible next question!",
                        400
                    );
                }
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
                let error = { ...err };
                error.message = err.message;
                console.log(error.message);
                if (err.name === 'CastError') error = handleCastErrorDB(error);
                if (err.code === 11000) {
                    error = handleDuplicateFieldsDB(error);
                }
                if (err.name === 'ValidationError') {
                    error = handleValidationErrorDB(error);
                }
                return res.status(error.statusCode).json({
                    status: error.status,
                    message: error.message,
                });
            }
            await newQuestion.updateOne({
                $push: { options: newOption._id.toString() },
            });
        }
        await newQuestionnaire.updateOne({
            $push: { questions: newQuestion._id.toString() },
        });
    }

    res.status(201).json({
        status: 'OK',
    });
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
