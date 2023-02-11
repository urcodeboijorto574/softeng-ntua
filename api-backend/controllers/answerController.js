const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const User = require(`${__dirname}/../models/userModel.js`);
const mongoose = require('mongoose');

/**
 * Creates and stores an answer object in the database.
 * @param {JSON} req - JSON request object containing questionnaireID, questionID, sessionID and optionID (req.params), answer text (req.body).
 * @param {JSON} res - JSON response object containing a confirmation/rejection of the request.
 * @return {JSON} - The response object.
 *
 * URL: {baseURL}/doanswer/:questionnaireID/:questionID/:session/:optionID
 */
exports.doAnswer = async (req, res, next) => {
    let session,
        option,
        question,
        questionnaire,
        newAnswer = {
            qID: req.params.questionID,
            optID: req.params.optionID,
            sessionID: req.params.session,
            questionnaireID: req.params.questionnaireID,
            answertext: req.body.answertext ? req.body.answertext : '',
        },
        newAnswerCreated = false,
        optionUpdated = false,
        questionUpdated = false;
    try {
        /* 1) CHECK VALIDITY OF PARAMETERS GIVEN */
        /* If user is not allowed to answer, reject the request */
        let user = await User.findOne(
            { username: req.username, role: 'user' },
            '_id role questionnairesAnswered'
        ).populate('questionnairesAnswered', 'questionnaireID');
        if (!user || user.role !== 'user') {
            /* This check happens in authorization. It unnecessary here. */
            return res.status(400).json({
                status: 'failed',
                message: !user
                    ? 'User does not exist'
                    : "User doesn't have permissions to answer",
            });
        }

        /* If questionnaireID or questionID or optionID is unvalid, reject the request */
        questionnaire = await Questionnaire.findOne(
            { questionnaireID: req.params.questionnaireID },
            '_id questionnaireID questions'
        ).populate({
            path: 'questions',
            model: 'Question',
            match: { qID: req.params.questionID },
            select: '_id qID options wasAnsweredBy',
            populate: {
                path: 'options',
                model: 'Option',
                match: { optID: req.params.optionID },
                select: '_id optID wasChosenBy nextqID opttxt',
            },
        });

        let inputValid = true;
        const questionnaireValid = questionnaire;
        question = questionnaire.questions[0];
        option = question.options[0];
        if (questionnaireValid) {
            const questionValid = questionnaire.questions.length;
            if (questionValid) {
                const optionValid = question.options.length;
                inputValid = optionValid;
            } else inputValid = false;
        } else inputValid = false;
        if (!inputValid) {
            return res.status(400).json({
                status: 'failed',
                message: 'Arguments provided are invalid',
            });
        }

        /* 2) CHECK IF A SESSION ALREADY EXISTS */
        session = await Session.findOne(
            { sessionID: req.params.session },
            '-questionnaireID -__v'
        ).populate('answers', '_id qID optID answertext');

        if (session) {
            /* Search session.answers[] for an answer._id  */
            const answersArrayEmpty = session.answers.length === 0;
            if (!answersArrayEmpty) {
                let answerIndex = session.answers.findIndex(
                    (ans) => ans.qID === req.params.questionID
                );
                if (answerIndex > -1) {
                    session.answers.forEach(async (ans) => {
                        let ques = await Question.findOne(
                            { qID: ans.qID },
                            'wasAnsweredBy'
                        );
                        ques.wasAnsweredBy -= 1;
                        ques = await ques.save();

                        let opt = await Option.findOne(
                            { optID: ans.optID },
                            'wasChosenBy'
                        );
                        opt.wasChosenBy -= 1;
                        opt = await opt.save();

                        await Answer.findByIdAndDelete(ans._id);
                    });

                    await Answer.deleteMany({ sessionID: req.params.session });
                    await Session.findOneAndRemove({
                        sessionID: req.params.session,
                    });

                    return res.status(400).json({
                        status: 'failed',
                        message:
                            'An answer has already been submitted for this question',
                        'previous answer':
                            session.answers[answerIndex].answertext !== ''
                                ? session.answers[answerIndex].answertext
                                : (
                                      await Option.findOne({
                                          optID: session.answers[answerIndex]
                                              .optID,
                                      })
                                  ).opttxt,
                    });
                }
            }
        } else {
            session = await Session.create({
                sessionID: req.params.session,
                questionnaireID: req.params.questionnaireID,
                answers: [],
                submitter: req.username,
            });
        }

        /* 3) SUBMIT NEW ANSWER TO DB */
        newAnswer = await Answer.create(newAnswer);
        newAnswerCreated = true;
        session.answers.push(newAnswer._id);
        session = await session.save();

        /* 4) UPDATE FIELDS IN RELEVANT DOCUMENTS (questions & options) */
        option.wasChosenBy += 1;
        option = await option.save();
        optionUpdated = true;

        question.wasAnsweredBy += 1;
        question = await question.save();
        questionUpdated = true;

        if (option.nextqID === '-') {
            const alreadyAnswered = user['questionnairesAnswered'].some(
                (q) => q['_id'].toString() === questionnaire._id.toString()
            );
            if (!alreadyAnswered) {
                await user.update({
                    $push: { questionnairesAnswered: questionnaire._id },
                });
            }
        }

        /* 5) SEND RESPONSE */
        const message = 'Answer submitted!';
        console.log(message);
        return res.status(200).json({
            status: 'OK',
            message,
        });
    } catch (err) {
        console.log(err);
        await Session.findByIdAndDelete(session['_id']);
        if (newAnswerCreated) {
            await Answer.findByIdAndDelete(newAnswer._id);

            if (optionUpdated) {
                option.wasChosenBy = option.wasChosenBy - 1;
                await option.save();

                if (questionUpdated) {
                    --question.wasAnsweredBy;
                    await question.save();
                }
            }
        }

        return res.status(500).json({
            status: 'failed',
            message: err,
        });
    }
    next();
};

/**
 * Returns all the answers of a specified session.
 * @param {JSON} req - JSON object containing questionnaireID and sessionID (req.params).
 * @param {JSON} res - JSON object containing the data to send.
 * @return {JSON} - The response object.
 *
 * URL: {baseURL}/getsessionanswers/:questionnaireID/:session
 */
exports.getSessionAnswers = async (req, res, next) => {
    try {
        let questionnaireCreator = await Questionnaire.findOne({
            questionnaireID: req.params.questionnaireID,
        }).select({ creator: 1, _id: 0 });
        if (!questionnaireCreator) {
            return res.status(400).json({
                status: 'failed',
                message: `Questionnaire ID ${req.params.questionnaireID} not found`,
            });
        }
        if (!(req.username === questionnaireCreator.creator)) {
            return res.status(401).json({ status: 'failed', message: 'User unauthorized to continue!' });
        }
        let sessionanswers = await Session.findOne({
            questionnaireID: req.params.questionnaireID,
            sessionID: req.params.session,
        })
            .select({ _id: 0, __v: 0, submitter: 0 })
            .populate({
                path: 'answers',
                select: {
                    _id: 0,
                    sessionID: 0,
                    questionnaireID: 0,
                    __v: 0,
                },
                options: { sort: { qID: 1 } },
            })
            .lean(true);
        if (!sessionanswers) {
            return res.status(400).json({
                status: 'failed',
                message: `Session ID ${req.params.session} not found`,
            });
        }

        for (let i = 0; i < sessionanswers.answers.length; i++) {
            sessionanswers.answers[i].submittedAt = undefined;
            // questions with type question
            if (sessionanswers.answers[i].answertext === ' ') {
                sessionanswers.answers[i].answertext = undefined;
                sessionanswers.answers[i].ans = sessionanswers.answers[i].optID;
                delete sessionanswers.answers[i].optID;
            }
            // questions with type profile
            else {
                sessionanswers.answers[i].optID = undefined;
                sessionanswers.answers[i].ans =
                    sessionanswers.answers[i].answertext;
                delete sessionanswers.answers[i].answertext;
            }
        }
        return res.status(200).json({ status: 'OK', data: sessionanswers });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
        });
    }
};

/**
 * Returns all the answers of a specified question.
 * @param {JSON} req - JSON object containing qustionnaireID and questionID (req.params).
 * @param {JSON} res - JSON object containing the data to send.
 * @return {JSON} - The response object.
 *
 * URL: {baseURL}/getquestionanswers/:questionnaireID/:questionID
 */
exports.getQuestionAnswers = async (req, res, next) => {
    try {
        let questionnaireCreator = await Questionnaire.findOne({
            questionnaireID: req.params.questionnaireID,
        }).select({ creator: 1, _id: 0 });
        if (!questionnaireCreator) {
            return res.status(400).json({
                status: 'failed',
                message: `Questionnaire ID ${req.params.questionnaireID} not found`,
            });
        }
        let question = await Question.findOne({
            qID: req.params.questionID, questionnaireID: req.params.questionnaireID,
        });
        if (!question) {
            return res.status(400).json({
                status: 'failed',
                message: `Question ID ${req.params.questionID} not found`,
            });
        }
        if (!(req.username === questionnaireCreator.creator)) {
            return res.status(401).json({ status: 'failed', message: 'User unauthorized to continue!' });
        }
        let questionanswers = await Answer.find({
            questionnaireID: req.params.questionnaireID,
            qID: req.params.questionID,
        })
            .select({
                _id: 0,
                submittedAt: 1,
                sessionID: 1,
                optID: 1,
                answertext: 1,
            })
            .sort({ submittedAt: 1 })
            .lean(true);

        for (let i = 0; i < questionanswers.length; i++) {
            questionanswers[i].submittedAt = undefined;
            questionanswers[i].session = questionanswers[i].sessionID;
            delete questionanswers[i].sessionID;
            if (questionanswers[i].answertext === ' ') {
                questionanswers[i].answertext = undefined;
                questionanswers[i].ans = questionanswers[i].optID;
                delete questionanswers[i].optID;
            }
            // questions with type profile
            else {
                questionanswers[i].optID = undefined;
                questionanswers[i].ans = questionanswers[i].answertext;
                delete questionanswers[i].answertext;
            }
        }       
        data = {
            questionnnaireID: req.params.questionnaireID,
            questionID: req.params.questionID,
            answers: questionanswers,
        };
        return res.status(200).json({ status: 'OK', data: data });
    } catch (err) {
        return res
            .status(500)
            .json({ status: 'failed', message: 'Internal server error' });
    }
};
