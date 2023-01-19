const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);

exports.doAnswer = async (req, res) => {
    try {
        const answer = await Answer.create(req.body);

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
