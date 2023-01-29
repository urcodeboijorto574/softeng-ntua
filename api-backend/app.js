const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
<<<<<<< HEAD
const adminRouter = require('./routes/adminRoutes.js');
const questionnaireRouter = require('./routes/questionnaireRoutes.js');
const questionRouter = require('./routes/questionRoutes.js');
const answerRouter = require('./routes/answerRoutes.js');
=======
const adminRouter = require(`${__dirname}/routes/adminRoutes.js`);
const questionnaireRouter = require(`${__dirname}/routes/questionnaireRoutes.js`);
const questionRouter = require(`${__dirname}/routes/questionRoutes.js`);
const doanswerRouter = require(`${__dirname}/routes/doanswerRoutes.js`);
const getquestionanswersRouter = require(`${__dirname}/routes/getquestionanswersRoutes.js`);
const getsessionanswersRouter = require(`${__dirname}/routes/getsessionanswersRoutes.js`);
const importRouter = require(`${__dirname}/routes/importRoutes.js`);
>>>>>>> origin/ioannis-branch
const bp = require('body-parser');

const app = express();

const host = process.env.HOST || 'localhost';

dotenv.config({ path: `${__dirname}/config.env` });

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Global middleware
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.headers);
    next();
});

app.use('/intelliq_api/admin', adminRouter);
app.use('/intelliq_api/questionnaire', questionnaireRouter);
app.use('/intelliq_api/question', questionRouter);
<<<<<<< HEAD
app.use('/intelliq_api/doanswer', answerRouter);
=======
app.use('/intelliq_api/doanswer', doanswerRouter);
app.use('/intelliq_api/getquestionanswers', getquestionanswersRouter);
app.use('/intelliq_api/getsessionanswers', getsessionanswersRouter);
app.use('/dummy-data', importRouter);
>>>>>>> origin/ioannis-branch

module.exports = app;
