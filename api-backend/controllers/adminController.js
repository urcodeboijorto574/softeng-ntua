const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config.env` });

/**
 * Checks if the remote DB is connected with the API.
 * @param {JSON} req - JSON object of which no field is used in the function.
 * @param {JSON} res - JSON object that contains the response.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/admin/healthcheck
 */
exports.getHealthcheck = async (req, res, next) => {
    try {
        /* DB is the database connection string */
        const DB = process.env.DATABASE.replace(
            '<password>',
            process.env.DATABASE_PASSWORD
        );

        await mongoose.connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true /* Only to suppress a possible warning */
        });

        return res.status(200).json({
            status: 'OK',
            dbconnection: DB
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err
        });
    }
    next();
}

/**
 * Creates a questionnaire and saves it in the DB.
 * @param {JSON} req - JSON object of which req.body has the to-be-created questionnaire.
 * @param {JSON} res - JSON object that contains the data to send.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/admin/questionnaire_upd
 */
exports.questionnaireUpdate = async (req, res, next) => { };
