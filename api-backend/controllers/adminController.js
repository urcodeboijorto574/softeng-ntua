const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });


/* DB is the database connection string */
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

exports.getHealthcheck = (req, res, next) => {
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
    next();
}


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

        res.status(201).json({
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
        res.status(500).json({
            status: 'error',
            message: err,
        });
    }
};

