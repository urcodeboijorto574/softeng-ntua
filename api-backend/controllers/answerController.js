const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const json2csv = require('json2csv');

/**
 * URL: /intelliq_api/doanswer/:questionnaireID/:questionID/:session/:optionID
 * 
 * Κλήση http POST η οποία καταχωρεί την απάντηση optionID η οποία δόθηκε στο γεγονός απάντησης
 * session στην ερώτηση questionID του ερωτηματολογίου questionnaireID. Δεν επιστρέφει κάποιο
 * αντικείμενο. Το αναγνωριστικό session είναι μια συμβολοσειρά με 4 τυχαίους χαρακτήρες που
 * αντιστοιχούν στο γεγονός απάντησης του ερωτηματολογίου (προσοχή: όχι της ερώτησης) από
 * κάποιον χρήστη.
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
        const optionValid = question.options.some(el => el.optID === req.params.optionID);
        if (!optionValid) {
            /* Reject the request */
            return res.status(400).json({
                status: 'bad request',
                msg: 'The option specified doesn\'t exist'
            });
        }

        /* Check if username is valid */
        const user = await Session.findOne({ username: req.query.username }, '_id');
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

exports.getSessionAnswers = async (req, res, next) => {
    try {
        const answers = await Answer
            .find({ questionnaireID: req.params.questionnaireID, sessionID: req.params.session })
            .select('qID answertext -_id');

        res.status(answers.length !== 0 ? 200 : 402);

        if (!req.query.format || req.query.format === 'json') {
            return res.status(answers.length !== 0 ? 200 : 402).json({
                status: answers.length !== 0 ? 'success' : 'no data',
                data: {
                    questionnaireID: req.params.questionnaireID,
                    session: req.params.session,
                    answers
                }
            });
        } else if (req.query.format === 'csv') {
            const fieldNames = ['QuestionnaireID', 'SessionID', 'QuestionID', 'Answer'];
            let retval = [];

            if (answers.length === 0) {
                /* Send 'empty' array */
                retval[0] = {
                    QuestionnaireID: req.params.questionnaireID,
                    SessionID: req.params.session,
                    QuestionID: '',
                    Answer: ''
                }
            } else {
                /* Fill retval array */
                for (let i = 0; i < answers.length; ++i) {
                    retval[i] = {
                        QuestionnaireID: req.params.questionnaireID,
                        SessionID: req.params.session,
                        QuestionID: answers[i].qID,
                        Answer: answers[i].answertext
                    }
                }
            }

            /* Parse data to result: csv variable */
            const json2csvparser = new json2csv.Parser({ fieldNames });
            const result = json2csvparser.parse(retval);
            console.log('result:'); console.log(result);

            return res.send(result);
        } else {
            return res.status(400).json({
                status: 'fail',
                msg: 'Content-type can be either application/json or text/csv'
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            mes: err
        });
    }
    next();
};

exports.getQuestionAnswers = async (req, res, next) => {
    try {
        const answers = await Answer
            .find({ questionnaireID: req.params.questionnaireID, qID: req.params.questionID })
            .select('sessionID _id');

        res.status(answers.length !== 0 ? 200 : 402);

        if (!req.query.format || req.query.format === 'json') {
            return res.json({
                status: answers.length !== 0 ? 'success' : 'no data',
                data: {
                    questionnaireID: req.params.questionnaireID,
                    questionID: req.params.questionID,
                    answers
                }
            });
        } else if (req.query.format === 'csv') {
            const fieldNames = ['QuestionnaireID', 'QuestionID', 'SessionID', 'Answer'];
            let retval = [];

            if (answers.length === 0) {
                /* Send 'empty' array */
                retval[0] = {
                    QuestionnaireID: req.params.questionnaireID,
                    QuestionID: req.params.questionID,
                    SessionID: '',
                    Answer: ''
                }
            } else {
                /* Fill retval array */
                for (let i = 0; i < answers.length; ++i) {
                    retval[i] = {
                        QuestionnaireID: req.params.questionnaireID,
                        QuestionID: req.params.questionID,
                        SessionID: answers[i].sessionID,
                        Answer: answers[i].answertext
                    }
                }
            }

            /* Parse data to result: csv variable */
            const json2csvparser = new json2csv.Parser({ fieldNames });
            const result = json2csvparser.parse(retval);
            console.log('result:'); console.log(result);

            return res.send(result);
        } else {
            return res.status(400).json({
                status: 'fail',
                msg: 'Content-type can be either application/json or text/csv'
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            mes: err
        });
    }
    next();
};
