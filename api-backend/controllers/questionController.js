const Question = require('../models/questionModel');

exports.getQuestion = async (req, res) => {
    try {
        const question = await Question.findOne({
            questionnaireID: req.params.questionnaireID,
            questionID: req.params.qID,
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
                status: 'fail',
                message: `Question ID ${req.params.qID} not found`,
            });
        }

        return res.status(200).json({ status: 'OK', question: question });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ status: 'Fail', message: 'Internal server error' });
    }
};
