const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);

exports.doAnswer = async (req, res) => {
    try {
        const oldAnswer = await Answer
            .findOne({
                qID: req.params.questionID,
                sessionID: req.params.session,
                questionnaireID: req.params.questionnaireID,
                optID: req.params.optionID
            });

        if (oldAnswer)
            return res.status(400).json({
                status: 'bad request',
                msg: 'There\'s already a submitted answer for this session',
                oldAnswer
            });

        const session = await Session.findOne({ sessionID: req.params.session });

        if (!session) {
            return res.status(400).json({
                status: 'bad request',
                msg: 'There\'s no existing session to submit this answer'
            });
        }

        const answer = await Answer.create({
            qID: req.params.questionID,
            optID: req.params.optionID,
            sessionID: req.params.session,
            questionnaireID: req.params.questionnaireID,
            answertext: req.body.answertext
        });

        return res.status(200).json({
            status: 'success',
            msg: 'Answer submitted'
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            msg: err
        });
    }
    next();
};
