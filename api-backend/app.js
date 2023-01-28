const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const adminRouter = require('./routes/adminRoutes.js');
const loginRouter = require('./routes/loginRouter.js');
// const questionnaireRouter = require('./routes/questionnaireRoutes.js');
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

// authentication endpoints through adminRouter
app.use('/intelliq_api/admin', adminRouter);
/* app.use('/inteliq_api/login', authController.login);
app.use('/intelliq_api/logout', authController.logout); */
app.use('/intelliq_api', loginRouter);

/* app.use('/intelliq_api/:usermod', userRouter);
app.use('/intelliq_api/admin/users', userRouter); */
// app.use('/intelliq_api/questionnaire', questionnaireRouter);

module.exports = app;
