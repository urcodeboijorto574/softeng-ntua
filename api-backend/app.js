const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const adminRouter = require('./routes/adminRoutes.js');
const questionnaireRouter = require('./routes/questionnaireRoutes.js');
const questionRouter = require('./routes/questionRoutes.js');
const bp = require('body-parser');

const app = express();

const host = process.env.HOST || 'localhost';

dotenv.config({ path: './config.env' });

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

module.exports = app;
