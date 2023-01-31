const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const User = require(`${__dirname}/../models/userModel.js`);
const mongoose = require('mongoose');

/**
 * Creates and stores an answer object in the database.
 * @param {JSON} req - JSON object of which req.params contains the questionnaireID, questionID, sessionID and optionID, and req.body contains the answer text.
 * @param {JSON} res - JSON object that contains a confirmation or decline of the request.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/doanswer/:questionnaireID/:questionID/:session/:optionID
*/
exports.doAnswer = async (req, res, next) => { /* WORKING ON IT... */
    let session, option, question, questionnaire,
        newAnswer = {
            qID: req.params.questionID,
            optID: req.params.optionID,
            sessionID: req.params.session,
            questionnaireID: req.params.questionnaireID,
            answertext: req.body.answertext ? req.body.answertext : ''
        },
        newAnswerCreated = false, optionUpdated = false, questionUpdated = false;
    // let userName = req.params.username;
    // let userName = req.username;
    let userName = 'john-user';
    try {
        /* 1) CHECK VALIDITY OF PARAMETERS GIVEN */

        /* If user is not allowed to answer, reject the request */
        let user = await User
            .findOne({ username: userName, role: 'user' }, '_id role questionnairesAnswered')
            .populate('questionnairesAnswered', 'questionnaireID');
        if (!user || user.role !== 'user') {
            if (!user) console.log('!user');
            else if (user.role !== 'user') console.log('user.role !== \'user\'');
            return res.status(400).json({
                status: 'failed',
                message: 'User doesn\'t have permissions to answer'
            });
        }

        /* If questionnaireID or questionID or optionID is unvalid, reject the request */
        questionnaire = await Questionnaire
            .findOne({ questionnaireID: req.params.questionnaireID }, '_id questionnaireID questions')
            .populate({
                path: 'questions',
                model: 'Question',
                match: { qID: req.params.questionID },
                select: '_id qID options wasAnsweredBy',
                populate: {
                    path: 'options',
                    model: 'Option',
                    match: { optID: req.params.optionID },
                    select: '_id optID wasChosenBy nextqID',
                }
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
                message: 'Arguments provided are invalid'
            });
        }



        /* 2) CHECK IF A SESSION ALREADY EXISTS */

        session = await Session
            .findOne({ sessionID: req.params.session }, '-questionnaireID -__v')
            .populate('answers', '_id qID optID answertext');

        if (session) {
            /* Search session.answers[] for an answer._id  */
            const answersArrayEmpty = (session.answers.length === 0);
            if (!answersArrayEmpty) {
                let answerIndex = session.answers.findIndex(ans => ans.qID === req.params.questionID);
                if (answerIndex > -1) {
                    session.answers.forEach(async ans => {
                        let ques = await Question.findOne({ qID: ans.qID }, 'wasAnsweredBy');
                        ques.wasAnsweredBy -= 1;
                        ques = await ques.save();

                        let opt = await Option.findOne({ optID: ans.optID }, 'wasChosenBy');
                        opt.wasChosenBy -= 1;
                        opt = await opt.save();

                        await Answer.findByIdAndDelete(ans._id);
                    });

                    await Answer.deleteMany({ sessionID: req.params.session });
                    await Session.findOneAndRemove({ sessionID: req.params.session });

                    return res.status(400).json({
                        status: 'failed',
                        message: 'An answer has already been submitted for this question',
                        'previous option': session.answers[answerIndex].opttxt,
                        'previous answer': session.answers[answerIndex].answertext,
                    });
                }
            }
        } else {
            session = await Session.create({
                sessionID: req.params.session,
                questionnaireID: req.params.questionnaireID,
                answers: [],
                submitter: user._id
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

        if (!option.nextqID) {
            user.questionnairesAnswered.push(questionnaire._id);
            /* This is where the problematic middleware breaks the program. (This is a reference to an issue with a middleware in userModel.js) */
            user = await user.save();
        }


        /* 5) SEND RESPONSE */

        const message = 'Answer submitted!';
        console.log(message);

        return res.status(200).json({
            status: 'OK',
            message
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
                    --(question.wasAnsweredBy);
                    await question.save();
                }
            }
        }

        return res.status(500).json({
            status: 'failed',
            message: err
        });
    }
    next();
};
