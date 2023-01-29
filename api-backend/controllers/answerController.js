const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const json2csv = require('json2csv');

/**
 * URL: /intelliq_api/doanswer/:questionnaireID/:questionID/:session/:optionID
 */
exports.doAnswer = async (req, res, next) => {
    try {
        /* Check if the questionID is valid */
        const question = await Question
            .findOne({ qID: req.params.questionID, questionnaireID: req.params.questionnaireID }, '_id qID questionnaireID options')
            .populate('options', '-wasChosenBy -opttxt -nextqID -__v');
        if (!question) {
            /* Reject the request */
            return res.status(400).json({
                status: 'bad request',
                msg: 'The question specified doesn\'t exist',
            });
        }

        /* Check if the optionID is valid */
        const option = question.options.some(el => el.optID === req.params.optionID);
        if (!option) {
            /* Reject the request */
            return res.status(400).json({
                status: 'bad request',
                msg: 'The option specified doesn\'t exist'
            });
        }

        /* Check if username is valid */
        const user = await Session.findOne({ username: req.body.username }, '_id');
        if (!user) {
            /* Reject the request */
            return res.status(400).json({
                status: 'bad request',
                msg: 'The user specified doesn\'t exist'
            })
        }

        /* Check if a session already exists */
        const oldSession = await Session
            .findOne({ sessionID: req.params.session, user: user._id }, '-__v')
            .populate('answers', '-questionnaireID');

        let currSession = oldSession;

        if (!oldSession) {
            /* Create new session */
            let newSession = await Session.create({
                sessionID: req.params.session,
                questionnaireID: req.params.questionnaireID,
                answers: [],
                user: user._id
            });
            currSession = newSession;
            const questionnaire_id = await Questionnaire
                .findOne({ questionnaireID: req.params.questionnaireID }, '_id');

            user.questionnaires.push(questionnaire_id);
        }

        /* Check if there's an old answer submitted to this session */
        const queryObj = {
            qID: req.params.questionID,
            sessionID: req.params.session,
            optID: req.params.optionID,
        };
        const oldAnswer = await Answer.findOne(queryObj).select('-__v');
        if (oldAnswer) {
            /* Reject the new answer */
            return res.status(400).json({
                status: 'bad request',
                msg: 'There\'s already a submitted answer for this session',
                oldAnswer
            });
        }

        let newAnswer = queryObj;
        newAnswer['answertext'] = req.body.answertext, newAnswer['questionnaireID'] = req.params.questionnaireID;
        ++option['wasChosenBy'];

        const newDoc = await Answer.create(newAnswer);
        currSession['answers'] = [newDoc._id];
        await currSession.save();
        console.log('Answer submitted and sessions\' answers array updated!');

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
