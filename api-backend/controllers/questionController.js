const Question = require(`${__dirname}/../models/questionModel.js`);

/**
 * Returns all the info about a question (and its options).
 * @param {JSON} req - JSON object of which req.params contains the questionnaireID and questionID.
 * @param {JSON} res - JSOn object that contains the data to send.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/question/:questionnaireID/:questionID
 */
exports.getQuestion = async (req, res, next) => {
    /* This line is added only for temporary purposes */
    return res.status('418').json({ status: 'no operation', message: 'I\'m a teapot' });
};
