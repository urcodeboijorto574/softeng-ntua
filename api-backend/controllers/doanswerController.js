const Question = require(`${__dirname}/../models/questionModel`);
const Option = require(`${__dirname}/../models/optionModel`);
const Answer = require(`${__dirname}/../models/answerModel`);
const Session = require(`${__dirname}/../models/sessionModel`);

exports.doAnswer = async (req, res) => {
    try {

        return res.status(200).json({
            status: 'success'
        });
    } catch (err) {
        return res.status(404).json({
            status: 'fail',
            msg: err
        });
    }
};
