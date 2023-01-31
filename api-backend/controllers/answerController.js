const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Session = require(`${__dirname}/../models/sessionModel.js`);
const Answer = require(`${__dirname}/../models/answerModel.js`);
const User = require(`${__dirname}/../models/userModel.js`);

/**
 * Stores an answer object in the database.
 * @param {JSON} req - JSON object of which req.params contains the questionnaireID, questionID, sessionID and optionID, and req.body contains the answer text.
 * @param {JSON} res - JSON object that contains a confirmation or decline of the request.
 * @return {JSON} - The response object created.
 * 
 * URL: {baseURL}/doanswer/:questionnaireID/:questionID/:session/:optionID
*/
exports.doAnswer = async (req, res, next) => { /* OK, NEEDS TESTING... */
    let session, option,
        newAnswer = {
            qID: req.params.questionID,
            optID: req.params.optionID,
            sessionID: req.params.session,
            questionnaireID: req.params.questionnaireID,
            answertext: req.body.answertext ? req.body.answertext : ''
        },
        newAnswerCreated = false, optionUpdated = false, questionUpdated = false;

    try {
        /* 1) CHECK VALIDITY OF PARAMETERS GIVEN */

        /* If user is not allowed to answer, reject the request */
        let user = await User.findOne({ username: req.params.username /*req.username */, role: 'user' }, 'questionnairesAnswered');
        if (!user) {
            return res.status(400).json({
                status: 'failed',
                message: 'User doesn\t have permissions to answer'
            });
        }

        /* If questionnaireID or questionID or optionID is unvalid, reject the request */
        const questionnaire = await Questionnaire
            .findOne({ questionnaireID: req.params.questionnaireID }, 'questionnaireID questions')
            .populate({
                path: 'questions',
                model: 'Question',
                filter: { qID: req.params.questionID },
                select: 'qID options wasAnsweredBy',
                populate: {
                    path: 'options',
                    model: 'Option',
                    filter: { optID: req.params.optionID },
                    select: 'optID wasChosenBy _id',
                }
            });

        let inputValid = true;
        const questionnaireValid = questionnaire;
        if (questionnaireValid) {
            const questionValid = questionnaire.questions.length;
            if (questionValid) {
                const optionValid = questionnaire.questions[0].options.length;
                inputValid = optionValid;
            } else inputValid = false;
        } else inputValid = false;
        if (!inputValid) {
            return res.status(400).json({
                status: 'failed',
                message: 'Arguments provided are invalid'
            });
        }

        question = questionnaire.questions[0];
        option = question.options[0];

        /* 2) CHECK IF A SESSION ALREADY EXISTS */

        session = await Session
            .findOne({ sessionID: req.params.session })
            .populate('answers', '_id qID answertext');
        if (session) {
            /* Search session.answers[] for an answer._id  */
            const answersArrayEmpty = session.answers.length == 0;
            if (!answersArrayEmpty && session.answers.some(ans => ans.qID === req.params.questionID)) {
                console.log('session.answers:', session.answers);
                await Answer.deleteMany(session.answers[0].sessionID);
                await Session.deleteOne(session);
                return res.status(400).json({
                    status: 'failed',
                    message: 'An answer has already been submitted for this question',
                    'previous answer': session.answers[0].answertext
                });
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

        /* 4) UPDATE FIELDS IN RELEVANT DOCUMENTS */
        option.wasChosenBy = option.wasChosenBy + 1;
        // ++(option.wasChosenBy);
        option = await option.save();
        optionUpdated = true;

        question.wasAnsweredBy += 1;
        question = await question.save();
        questionUpdated = true;

        user.questionnairesAnswered.push(questionnaire._id);
        console.log('point 0');
        // user = await user.save();

        console.log('point 1');

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
