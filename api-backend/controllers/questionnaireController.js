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
exports.getUserAnsweredQuestionnaires = async (req, res, next) => { /* Inspection finished */
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

        const questionnaires = user.questionnairesAnswered;

        const questionnairesFound = user && questionnaires.length > 0;

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
 * Middleware that returns all the questionnaires that have not been answered by the logged-in user yet.
 * @param {JSON} req - JSON request object containing the username of the logged-in user (req.username).
 * @param {JSON} res - JSON response object containing the requested questionnaires (res.data.questionnaires).
 * @param {function} next - the next middleware in the middleware stack.
 * @returns {JSON} - The response object res.
 * 
 * URL: {baseURL}/questionnaire/getusernotansweredquestionnaires
 */
exports.getUserNotAnsweredQuestionnaires = async (req, res, next) => { /* (NOT FINISHED) */
    try { /* Vassiliki */
        const queryObj = req.param;
        // const queryObj = {username: req.username};
        const user = await User.findOne({ username: req.username }).populate({
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
                    sort: 'optID',
                },
            },
        });

        let questionnaires = await Questionnaire.find({}, '-_id')
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

        temp = 0;
        let questionnairesLeft = [];

        for (i = 0; i < user.questionnairesAnswered.length; i++) {
            while (
                questionnaires[temp]['questionnaireID'] !=
                user.questionnairesAnswered[i]['questionnaireID']
            ) {
                questionnairesLeft.push(questionnaires[temp]);
                temp++;
            }
            temp++;
        }

        for (i = temp; i < questionnaires.length; i++) {
            questionnairesLeft.push(questionnaires[i]);
        }

        return res.status(questionnairesLeft ? 200 : 402).json({
            status: 'OK',
            data: questionnairesLeft,
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            msg: err.message,
        });
    }
    next();
};

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
