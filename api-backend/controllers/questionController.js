const Question = require(`${__dirname}/../models/questionModel.js`);

/**
 * Returns all the info about a question (and its options).
 * @param {JSON} req - JSON request object containing the questionnaireID and questionID (req.params).
 * @param {JSON} res - JSOn response object containing the data to send.
 * @return {JSON} - The response object created.
 *
 * URL: {baseURL}/question/:questionnaireID/:questionID
 */
exports.getQuestion = async (req, res) => {
    try {
        const question = await Question.findOne({
            questionnaireID: req.params.questionnaireID,
            qID: req.params.questionID,
        })
            .select({ _id: 0, __v: 0, wasAnsweredBy: 0 })
            .populate({
                path: 'options',
                select: {
                    _id: 0,
                    wasChosenBy: 0,
                    qID: 0,
                    questionnaireID: 0,
                    __v: 0,
                },
                options: { sort: { qID: 1 } },
            });
        if (!question) {
            return res.status(400).json({
                status: 'failed',
                message: `Question ID ${req.params.qID} not found`,
            });
        }
        if (!(req.username === questionnaire.creator)) {
            return res
                .status(401)
                .json({ status: 'failed', message: 'Access denied' });
        }
        return res.status(200).json({ status: 'OK', question: question });
    } catch (err) {
        return res
            .status(500)
            .json({ status: 'failed', message: 'Internal server error' });
    }
};
