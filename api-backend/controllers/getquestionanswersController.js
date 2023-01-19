const Question = require(`${__dirname}/../models/questionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);

exports.getAnswers = async (req, res) => {
    try {
        const answers = await Answer
            .find({ questionnaireID: req.params.questionnaireID, qID: req.params.questionID })
            .select('sessionID _id');

        return res.status(200).json({
            status: 'success',
            data: {
                questionnaireID: req.params.questionnaireID,
                questionID: req.params.questionID,
                answers
            }
        });
    } catch (err) {
        return res.status(404).json({
            status: 'fail',
            mes: err
        });
    }
    next();
};
