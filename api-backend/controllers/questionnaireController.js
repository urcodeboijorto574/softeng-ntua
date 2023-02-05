const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const Question = require(`${__dirname}/../models/questionModel.js`);
const Option = require(`${__dirname}/../models/optionModel.js`);
const User = require(`${__dirname}/../models/userModel.js`);


/**
 * Middleware that returns all the questionnaires that have been created by the logged-in admin.
 * @param {JSON} req - JSON request object containing the username of the logged-in admin (req.username).
 * @param {JSON} res - JSON response object containing the requested questionnaires (res.data.questionnaires).
 * @param {function} next - the next middleware in the middleware stack.
 * @returns {JSON} - The response object res.
 * 
 * URL: {baseURL}/questionnaire/getadmincreatedquestionnaires
 */
exports.getAdminCreatedQuestionnaires = async (req, res, next) => { /* Inspection finished */
    try {
        let questionnaires = await Questionnaire
            .find({ creator: req.username }, '-_id -creator')
            .sort('questionnaireID')
            .populate({
                path: 'questions',
                model: 'Question',
                select: '-_id -__v -questionnaireID -wasAnsweredBy',
                sort: 'qID',
                populate: {
                    path: 'options',
                    model: 'Option',
                    select: '-_id -__v',
                    sort: 'optID',
                },
            });

        const questionnairesFound = questionnaires && questionnaires.length !== 0;
        return res.status(questionnairesFound ? 200 : 402).json({
            status: questionnairesFound ? 'OK' : 'no data',
            data: {
                questionnaires: questionnairesFound ? questionnaires : []
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: error
        });
    }
    next();
};

/**
 * Middleware that returns all the questionnaires that have been answered by the logged-in user.
 * @param {JSON} req - JSON request object containing the username of the logged-in user (req.username).
 * @param {JSON} res - JSON response object containing the requested questionnaires (res.data.questionnaires).
 * @param {function} next - the next middleware in the middleware stack.
 * @returns {JSON} - The response object res.
 * 
 * URL: {baseURL}/questionnaire/getuseransweredquestionnaires
 */
exports.getUserAnsweredQuestionnaires = async (req, res, next) => {
    try {
        let user = await User
            .findOne({ username: req.username }, 'questionnairesAnswered')
            .populate({
                path: 'questionnairesAnswered',
                model: 'Questionnaire',
                select: '-_id',
                sort: 'questionnaireID',
                populate: {
                    path: 'questions',
                    model: 'Question',
                    select: '-_id -__v -questionnaireID -wasAnsweredBy',
                    sort: 'qID',
                    populate: {
                        path: 'options',
                        model: 'Option',
                        select: '-_id -__v',
                        sort: 'optID'
                    }
                }
            });

        if (!user) {
            return res.status(400).json({
                status: 'failed',
                message: 'invalid username'
            });
        }

        const answeredQuestionnaires = user.questionnairesAnswered;
        const questionnairesFound = answeredQuestionnaires.length > 0;

        return res.status(questionnairesFound ? 200 : 402).json({
            status: questionnairesFound ? 'OK' : 'no data',
            data: {
                answeredQuestionnaires
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err
        });
    }
    next();
};

/**
 * Middleware that returns all the questionnaires that have not been answered by the logged-in user yet.
 * @param {JSON} req - JSON request object containing the username of the logged-in user (req.username).
 * @param {JSON} res - JSON response object containing the requested questionnaires (res.data.questionnaires).
 * @param {function} next - the next middleware in the middleware stack.
 * @returns {JSON} - The response object res.
 * 
 * URL: {baseURL}/questionnaire/getusernotansweredquestionnaires
 */
exports.getUserNotAnsweredQuestionnaires = async (req, res, next) => { /* (NOT FINISHED) */
    try {
        const user = await User.findOne({ username: req.username }, 'questionnairesAnswered');

        const notAnsweredQuestionnaires = await Questionnaire
            .find({}, '_id keywords questions questionnaireID questionnaireTitle')
            .sort('_id')
            .where('_id').nin(user.questionnairesAnswered)
            .populate({
                path: 'questions',
                model: 'Question',
                select: '-_id qID qtext required type options',
                sort: 'qID',
                populate: {
                    path: 'options',
                    model: 'Option',
                    select: '-_id optID opttxt nextqID wasChosenBy',
                    sort: 'optID'
                }
            });

        const questionnairesFound = notAnsweredQuestionnaires.length > 0;
        return res.status(questionnairesFound ? 200 : 402).json({
            status: questionnairesFound ? 'OK' : 'no data ',
            data: {
                notAnsweredQuestionnaires
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            message: err
        });
    }
    next();
};

/**
 * Middlware that remove a particular questionnaire from the data base.
 * @param {JSON} req - JSON request object containing the questionnaireID of the to-be-deleted questionnaire (req.params).
 * @param {JSON} res - JSON respnse object containing a confirmation/rejection of the request.
 * @param {*} next - the next middlware in the middleware stack.
 * @returns - The response object res.
 */
exports.deleteQuestionnaire = async (req, res, next) => {
    try {
        /* This line is added only for temporary purposes */
        return res.status('418').json({ status: 'no operation', message: 'I\'m a teapot' });
    } catch (err) {
        return res.status(500).json({
            status: 'failed',
            msg: err.message,
        });
    }
}

/**
 * Middleware that returns a particular questionnaire by the logged-in ***.
 * @param {JSON} req - JSON object of which req.params contains the questionnaireID (req.params.questionnaireID).
 * @param {JSON} res - JSOn object that contains the data to send.
 * @param {function} next - the next middleware in the middleware stack.
 * @returns {JSON} - The response object res.
 * 
 * URL: {baseURL}/questionnaire/:questionnaireID/
 */
exports.getQuestionnaire = async (req, res, next) => {
    /* This line is added only for temporary purposes */
    return res.status('418').json({ status: 'no operation', message: 'I\'m a teapot' });
};
