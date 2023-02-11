const Question = require(`${__dirname}/../models/questionModel.js`);
const Questionnaire = require(`${__dirname}/../models/questionnaireModel.js`);
const handleResponse =
    require(`${__dirname}/../utils/handleResponse`).handleResponse;

/**
 * Returns all the info about a question (and its options).
 * @param {JSON} req - JSON request object containing the questionnaireID and questionID (req.params).
 * @param {JSON} res - JSOn response object containing the data to send.
 * @return {JSON} - The response object created.
 *
 * URL: {baseURL}/question/:questionnaireID/:questionID
 */
exports.getQuestion = async (req, res) => {
    try {
        let responseMessage;
        const question = await Question.findOne({
            questionnaireID: req.params.questionnaireID,
            qID: req.params.questionID,
        })
            .select({ _id: 0, __v: 0, wasAnsweredBy: 0 })
            .populate({
                path: 'options',
                select: {
                    _id: 0,
                    wasChosenBy: 0,
                    qID: 0,
                    questionnaireID: 0,
                    __v: 0,
                },
                options: { sort: { qID: 1 } },
            });       
        if (!question) {
            responseMessage = {
                status: 'failed',
                message: `Question not found`,
            };
            return handleResponse(req, res, 400, responseMessage);
        }  
        const questionnaire = await Questionnaire.findOne({
            questionnaireID: req.params.questionnaireID,
        }).select({
            _id: 0,
            __v: 0,
            keywords: 0,
            questions: 0,
            questionnaireID: 0,
            questionnaireTitle: 0,
        });   
        if (!(req.username === questionnaire.creator)) {
            responseMessage = { status: 'failed', message: 'Access denied' }
            return handleResponse(req, res, 401, responseMessage);
        } 
        
        if (req.query.format === 'json' || !req.query.format) {
            return res.status(200).json({ status: 'OK', data: question });
        }
        else if (req.query.format === 'csv') {
            // json to be converted to csv
            let retval = [];

            /* Fill retval array */
            for (let i = 0; i < question.options.length; i++) {
                retval[i] = {
                    status: 'OK',
                    questionnaireID: question.questionnaireID,
                    qtext: question.qtext,
                    required: question.required,
                    type: question.type,
                    optID: question.options[i].optID,
                    opttxt: question.options[i].opttxt,
                    nextqID: question.options[i].nextqID
                };
            }
            return handleResponse(req, res, 200, retval);

        }
        else {
            return res.status(400).json({
                status: 'failed',
                message: 'Response format must be either json or csv!',
            });
        }
    } catch (err) {
        console.log(err);
        responseMessage = { status: 'failed', message: 'Internal server error' };
        return handleResponse(req, res, 500, responseMessage);
    }
};
