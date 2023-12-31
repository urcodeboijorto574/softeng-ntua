const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const User = require(`${__dirname}/../models/userModel.js`);
const mongoose = require('mongoose');
const handleResponse =
    require(`${__dirname}/../utils/handleResponse.js`).handleResponse;

const handleResponsePrevAns = (req, res, statusCode, messageResponse) => {
    if (!req.query.format || req.query.format == 'json') {
        return res.status(statusCode).json(messageResponse);
    } else if (req.query.format == 'csv') {
        return res.csv([messageResponse], true, {}, statusCode);
    } else {
        return res.status(400).json({
            status: 'failed',
            message: 'Response format must be either json or csv!',
        });
    }
};

/**
 * Creates and stores an answer object in the database.
 * @param {JSON} req - JSON request object containing questionnaireID, questionID, sessionID and optionID (req.params), answer text (req.body).
 * @param {JSON} res - JSON response object containing a confirmation/rejection of the request.
 * @return {JSON} - The response object.
 *
 * URL: {baseURL}/doanswer/:questionnaireID/:questionID/:session/:optionID
 */
exports.doAnswer = async (req, res, next) => {
    let session, option, question, questionnaire,
        newAnswer = {
            qID: req.params.questionID,
            optID: req.params.optionID,
            sessionID: req.params.session,
            questionnaireID: req.params.questionnaireID,
            answertext: req.body.answertext ? req.body.answertext : ' ',
        },
        newAnswerCreated = false, optionUpdated = false, questionUpdated = false;
    try {
        /* 1) CHECK VALIDITY OF PARAMETERS GIVEN */

        /* If at least one of questionnaireID, questionID, optionID is unvalid, reject the request */
        questionnaire = await Questionnaire.findOne({ questionnaireID: req.params.questionnaireID }, '_id questionnaireID questions'
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
        let user = await User.findOne({ username: req.username, role: 'user' }, 'questionnairesAnswered'
        );
        if (user.questionnairesAnswered.find((q_id) => q_id.toString() == questionnaire._id.toString())) {
            return handleResponse(req, res, 400, {
                status: 'failed',
                message: 'You have already submitted a session for this questionnaire',
            });
        }

        /* 2) CHECK IF THE NEW SESSION IS ALREADY CREATED */
        session = await Session.findOne({ sessionID: req.params.session }, '-questionnaireID -__v'
        ).populate('answers', '_id qID optID answertext');

        if (session) {
            /* Check if the question has already been answered */
            const answerIndex = session.answers.findIndex((ans) => ans.qID === req.params.questionID);
            const questionAlreadyAnswered = answerIndex > -1;
            if (questionAlreadyAnswered) {
                session.answers.forEach(async (ans) => {
                    let ques = await Question.findOne({ qID: ans.qID }, 'wasAnsweredBy');
                    ques.wasAnsweredBy -= 1;
                    ques = await ques.save();

                    let opt = await Option.findOne({ optID: ans.optID }, 'wasChosenBy');
                    opt.wasChosenBy -= 1;
                    opt = await opt.save();

                    await Answer.findByIdAndDelete(ans._id);
                });

                await Answer.deleteMany({ sessionID: req.params.session });
                await Session.findOneAndRemove({ sessionID: req.params.session, });

                return handleResponsePrevAns(req, res, 400, {
                    status: 'failed',
                    message: 'An answer has already been submitted for this question',
                    'previous answer':
                        session.answers[answerIndex].answertext !== ' '
                            ? session.answers[answerIndex].answertext
                            : (await Option.findOne({ optID: session.answers[answerIndex].optID, }, '-_id opttxt')).opttxt,
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
            const alreadyAnswered = user.questionnairesAnswered.some((q) => q['_id'].toString() === questionnaire._id.toString());
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
                --option.wasChosenBy;
                await option.save();

                if (questionUpdated) {
                    --question.wasAnsweredBy;
                    await question.save();
                }
            }
        }

        return handleResponse(req, res, 500, {
            status: 'failed',
            message: error,
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
        let responseMessage;
        let questionnaireCreator = await Questionnaire.findOne({
            questionnaireID: req.params.questionnaireID,
        }).select({ creator: 1, _id: 0 });
        if (!questionnaireCreator) {
            responseMessage = {
                status: 'failed',
                message: `Questionnaire ID ${req.params.questionnaireID} not found`,
            }
            return handleResponse(req, res, 400, responseMessage);
        }
        if (!(req.username === questionnaireCreator.creator)) {
            responseMessage = { status: 'failed', message: 'User unauthorized to continue!' };
            return handleResponse(req, res, 401, responseMessage);
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
            responseMessage = {
                status: 'failed',
                message: `Session ID ${req.params.session} not found`,
            }
            return handleResponse(req, res, 400, responseMessage);
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
        if (req.query.format === 'json' || !req.query.format) {
            return res.status(200).json({ status: 'OK', data: sessionanswers });
        }
        else if (req.query.format === 'csv') {
            // json to be converted to csv
            let retval = [];

            /* Fill retval array */
            for (let i = 0; i < sessionanswers.answers.length; i++) {
                retval[i] = {
                    status: 'OK',
                    questionnaireID: sessionanswers.questionnaireID,
                    session: sessionanswers.session,
                    qID: sessionanswers.answers[i].qID,
                    ans: sessionanswers.answers[i].ans
                }
            }
            return res.status(200).csv(retval, true);
        }
        else {
            return res.status(400).json({
                status: 'failed',
                message: 'Response format is json or csv!',
            })
        }
    } catch (err) {
        responseMessage = {
            status: 'failed',
            message: 'Internal server error',
        };
        return handleResponse(req, res, 500, responseMessage);
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
        let responseMessage;
        let questionnaireCreator = await Questionnaire.findOne({
            questionnaireID: req.params.questionnaireID,
        }).select({ creator: 1, _id: 0 });
        if (!questionnaireCreator) {
            responseMessage = {
                status: 'failed',
                message: `Questionnaire ID ${req.params.questionnaireID} not found`,
            };
            return handleResponse(req, res, 400, responseMessage);
        }
        let question = await Question.findOne({
            qID: req.params.questionID, questionnaireID: req.params.questionnaireID,
        });
        if (!question) {
            responseMessage = {
                status: 'failed',
                message: `Question ID ${req.params.questionID} not found`,
            };
            return handleResponse(req, res, 400, responseMessage);
        }
        if (!(req.username === questionnaireCreator.creator)) {
            responseMessage = { status: 'failed', message: 'User unauthorized to continue!' };
            return handleResponse(req, res, 401, responseMessage);
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
        let data = {
            questionnaireID: req.params.questionnaireID,
            questionID: req.params.questionID,
            answers: questionanswers,
        };
        console.log(data);
        if (req.query.format === 'json' || !req.query.format) {
            return res.status(200).json({ status: 'OK', data: data }); 
        }
        else if (req.query.format === 'csv') {
            // json to be converted to csv
            let retval = [];

            /* Fill retval array */
            for (let i = 0; i < data.answers.length; i++) {
                retval[i] = {
                    status: 'OK',
                    questionnaireID: data.questionnaireID,
                    questionID: data.questionID,
                    session: data.answers[i].session,
                    ans: data.answers[i].ans
                }
            }
            return res.status(200).csv(retval, true);
        }
        else {
            return res.status(400).json({
                status: 'failed',
                message: 'Response format is json or csv!',
            })
        }
       
    } catch (err) {
        responseMessage = { status: 'failed', message: 'Internal server error' };
        return handleResponse(req, res, 500, responseMessage);
    }
};
