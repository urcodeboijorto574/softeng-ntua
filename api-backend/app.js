const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const loginRouter = require('./routes/loginRoutes.js');
const adminRouter = require(`${__dirname}/routes/adminRoutes.js`);
const questionnaireRouter = require(`${__dirname}/routes/questionnaireRoutes.js`);
const questionRouter = require(`${__dirname}/routes/questionRoutes.js`);
const answerRouter = require(`${__dirname}/routes/answerRoutes.js`);
const sessionAnswerRouter = require(`${__dirname}/routes/sessionAnswerRoutes.js`);
const questionAnswerRouter = require(`${__dirname}/routes/questionAnswerRoutes.js`);
const sessionRouter = require(`${__dirname}/routes/sessionRoutes.js`);
const importRouter = require(`${__dirname}/routes/importRoutes.js`);
const bp = require('body-parser');

const app = express();

const host = process.env.HOST || 'localhost';

dotenv.config({ path: './config.env' });

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Global middleware
// middleware to parse the request object
app.use(bp.json());

//middleware to parse parameters encoded, e.g application/x-www-formurlencoded && multipart/form-data
app.use(bp.urlencoded({ extended: true }));

// authentication endpoints through adminRouter and loginRouter
//app.use('/intelliq_api/admin', adminRouter);
app.use('/intelliq_api', loginRouter);

// Admin endpoints
app.use('/intelliq_api/admin', adminRouter);

// Use case endpoints
app.use('/intelliq_api/questionnaire', questionnaireRouter); // a + additional
app.use('/intelliq_api/question', questionRouter); // b
app.use('/intelliq_api/doanswer', answerRouter); // c
app.use('/intelliq_api/getsessionanswers', sessionAnswerRouter); // d
app.use('/intelliq_api/getquestionanswers', questionAnswerRouter); // e

// Additional endpoints
app.use('/intelliq_api/sessions', sessionRouter);
app.use('/dummy-data', importRouter);

module.exports = app;
