const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const User = require(`${__dirname}/../models/userModel.js`);
const mongoose = require('mongoose');
const handleResponse =
    require(`${__dirname}/../utils/handleResponse.js`).handleResponse;

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

        /* If at least one of questionnaireID, questionID, optionID is unvalid, reject the request */
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
        if (questionnaireValid) {
            question = questionnaire.questions[0];
            const questionValid = questionnaire.questions.length;
            if (questionValid) {
                option = question.options[0];
                const optionValid = question.options.length;
                inputValid = optionValid;
            } else inputValid = false;
        } else inputValid = false;
        if (!inputValid) {
            return handleResponse(req, res, 400, {
                status: 'failed',
                message: 'Arguments provided are invalid',
            });
        }

        /* If the user has already answered the questionnaire, reject the request */
        let user = await User.findOne(
            { username: req.username, role: 'user' },
            'questionnairesAnswered'
        ).populate('questionnairesAnswered', '_id questionnaireID');
        if (
            user.questionnairesAnswered.find(
                (q_id) => q_id == questionnaire._id
            )
        ) {
            return handleResponse(req, res, 400, {
                status: 'failed',
                message:
                    'You have already submitted a session for this questionnaire',
            });
        }

        /* 2) CHECK IF THE NEW SESSION IS ALREADY CREATED */
        session = await Session.findOne(
            { sessionID: req.params.session },
            '-questionnaireID -__v'
        ).populate('answers', '_id qID optID answertext');

        if (session) {
            /* Check if the question has already been answered */
            const answerIndex = session.answers.findIndex(
                (ans) => ans.qID === req.params.questionID
            );
            const questionAlreadyAnswered = answerIndex > -1;
            if (questionAlreadyAnswered) {
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

                return handleResponse(req, res, 400, {
                    status: 'failed',
                    message:
                        'An answer has already been submitted for this question',
                    'previous answer':
                        session.answers[answerIndex].answertext !== ''
                            ? session.answers[answerIndex].answertext
                            : (
                                  await Option.findOne({
                                      optID: session.answers[answerIndex].optID,
                                  })
                              ).opttxt,
                });
            }
        } else {
            session = await Session.create({
                sessionID: req.params.session,
                questionnaireID: req.params.questionnaireID,
                answers: [],
                submitter: req.username,
            });
        }

        /* 3) SUBMIT NEW ANSWER TO DB AND UPDATE FIELDS IN RELEVANT DOCUMENTS (questions & options) */
        newAnswer = await Answer.create(newAnswer);
        newAnswerCreated = true;
        session.answers.push(newAnswer._id);
        session = await session.save();

        option.wasChosenBy += 1;
        option = await option.save();
        optionUpdated = true;
        question.wasAnsweredBy += 1;
        question = await question.save();
        questionUpdated = true;

        if (option.nextqID === '-') {
            const alreadyAnswered = user.questionnairesAnswered.some(
                (q) => q['_id'].toString() === questionnaire._id.toString()
            );
            if (!alreadyAnswered) {
                await user.updateOne({
                    $push: { questionnairesAnswered: questionnaire._id },
                });
            }
        }

        /* 4) SEND RESPONSE */
        return handleResponse(req, res, 200, {
            status: 'OK',
            message: 'Answer submitted!',
        });
    } catch (error) {
        console.log(error);
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

        return handleResponse(req, res, 500, {
            status: 'failed',
            message: error.name + error.message,
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
        const sessionanswers = await Session.findOne({
            questionnaireID: req.params.questionnaireID,
            sessionID: req.params.session,
        })
            .select({ _id: 0, __v: 0, submitter: 0 })
            .populate({
                path: 'answers',
                select: {
                    _id: 0,
                    optID: 0,
                    sessionID: 0,
                    questionnaireID: 0,
                    __v: 0,
                },
                options: { sort: { qID: 1 } },
            });
        if (!sessionanswers) {
            return res.status(400).json({
                status: 'failed',
                message: `Session ID ${req.params.session} not found`,
            });
        }
        if (!req.username === Questionnaire.creator) {
            return res.json({ status: 'failed', message: 'Access denied' });
        }
        return res.status(200).json({ status: 'OK', data: sessionanswers });
    } catch (err) {
        return res
            .status(500)
            .json({ status: 'failed', message: 'Internal server error' });
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
        const getanswers = await Answer.find({
            questionnaireID: req.params.questionnaireID,
            qID: req.params.questionID,
        }).select({ _id: 0, __v: 0, optID: 0 });

        if (!getanswers) {
            return res.status(400).json({
                status: 'failed',
                message: `Answers not found`,
            });
        }
        /* if (!(req.username === Questionnaire.creator)) {
            return res
                .status(401)
                .json({ status: 'failed', message: 'Access denied' });
        }*/
        return res.status(200).json({ status: 'OK', data: getanswers });
    } catch (err) {
        return res
            .status(500)
            .json({ status: 'failed', message: 'Internal server error' });
    }
};
