const Question = require(`${__dirname}/../models/questionModel`);
const Option = require(`${__dirname}/../models/optionModel`);

exports.getQuestion = async (req, res) => {
    try {
        const question = await Question
            .findOne({ questionnaireID: req.params.questionnaireID, qID: req.params.questionID })
            .select('-_id -wasAnsweredBy -__v')
            .populate('options', 'optID opttxt nextqID -_id');

        return res.status(200).json({
            status: 'success',
            data: {
                question
            }
        });
    } catch (err) {
        return res.status(404).json({
            status: 'fail',
            msg: err
        });
    }
    next();
};
