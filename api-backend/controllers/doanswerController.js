const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);

exports.doAnswer = async (req, res) => {
    try {
        console.log('req.params:', req.params);

        const session = await Session
            .findOne({
                sessionID: req.params.session
            });

        console.log('session:', session);

        if (!session) {
            return res.status(202).json({
                status: 'invalidSession',
                msg: 'There\'s no existing session to submit this answer'
            });
        }

        const oldAnswer = await Answer
            .findOne({
                qID: req.params.questionID,
                sessionID: req.params.session,
                questionnaireID: req.params.questionnaireID,
                optID: req.params.optionID
            });

        console.log('oldAnswer:', oldAnswer);

        if (oldAnswer)
            return res.status(202).json({
                status: 'fail',
                msg: 'There\'s already a submitted answer for this session'
            });

        console.log('Came through');

        const answer = await Answer.create({
            qID: req.params.questionID,
            optID: req.params.optionID,
            sessionID: req.params.session,
            questionnaireID: req.params.questionnaireID,
            answertext: req.body.answertext
        });

        return res.status(200).json({
            status: 'success',
            msg: 'All good'
        });
    } catch (err) {
        return res.status(404).json({
            status: 'fail',
            msg: err
        });
    }
    next();
};
