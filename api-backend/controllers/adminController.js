const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
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
            useUnifiedTopology: true /* Only for Ioannis' PC */
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
                    err
                });
            });
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

exports.questionnaireUpdate = async (req, res, next) => {
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
    next();
};

exports.resetQuestionnaire = async (req, res, next) => {
    try {
        const questionnaire = await Questionnaire.findOne(req.params);
        if (!questionnaire)
            return res.status(400).json({
                status: 'failed',
                reason: 'Invalid questionnaireID'
            });

        const sessions = await Session.find(req.params);


        sessions.forEach(async session => {
            await Answer.deleteMany(session.answers);
            session.answers.forEach(async ans => {
                await Answer.deleteMany(req.params);
            });
            await Session.deleteOne(session);
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
