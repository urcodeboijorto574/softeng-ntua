const mongoose = require('mongoose');

/* DB is the database connection string */
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

exports.getHealthcheck = (res, req) => {
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
                    dbconnection: '<connection string>'
                });
            },
            err => { /* DB connection check failed */
                return res.status(500).json({
                    status: 'failed',
                    dbconnection: '<connection string>'
                });

            })
}


exports.storeOptionsFromQuestion = catchAsync(async (req, res, next) => {
    for (let i = 0; i < req.body.questions.length; i++) {
        for (let j = 0; j < req.body.questions[i].options.length; j++) {
            // σωζω στο option, το qID και το questionnaireID
            req.body.questions[i].options[j].questionnaireID =
                req.body.questionnaireID;
            req.body.questions[i].options[j].qID = req.body.questions[i].qID;
            var newOption = await Option.create(
                req.body.questions[i].options[j]
            );
            req.body.questions[i].options[j] = newOption._id.toString();
        }
    }

    next();
});

exports.storeQuestionsFromQuestionnaire = catchAsync(async (req, res, next) => {
    for (let j = 0; j < req.body.questions.length; j++) {
        // σωζω στο στο πεδιο questionnaireID της ερωτησης, το ID του ερωτηματολογιου
        req.body.questions[j].questionnaireID = req.body.questionnaireID;
        var newQuestion = await Question.create(req.body.questions[j]);
        req.body.questions[j] = newQuestion._id.toString();
    }

    next();
});

exports.createQuestionnaire = catchAsync(async (req, res, next) => {
    const newQuestionnaire = await Questionnaire.create(req.body);
    res.status(201).json({
        status: 'OK',
    });
    console.log('Questionnaire-end');

    //next();
});
