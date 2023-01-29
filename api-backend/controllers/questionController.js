const Question = require(`${__dirname}/../models/questionModel`);
const Option = require(`${__dirname}/../models/optionModel`);
const json2csv = require('json2csv');

exports.getQuestion = async (req, res) => {
    try {
        const question = await Question
            .findOne({ questionnaireID: req.params.questionnaireID, qID: req.params.questionID })
            .select('-_id -wasAnsweredBy -__v')
            .populate('options', 'optID opttxt nextqID -_id');

        res.status(question ? 200 : 400);

        if (!req.query.format || req.query.format === 'json') {
            return res.json({
                status: question ? 'success' : 'bad request',
                data: { question }
            });
        } else if (req.query.format === 'csv') {
            const fieldNames = ['ID', 'Question', 'Type', 'Required', 'QuestionnaireID', 'OptionID', 'OptionContext', 'FollowingQuestion'];
            let retval = [];

            /* Fill retval array */
            for (let i = 0; i < question.options.length; ++i) {
                retval[i] = {
                    ID: question.qID,
                    Question: question.qtext,
                    Type: question.type,
                    Required: question.required,
                    QuestionnaireID: question.questionnaireID,
                    OptionID: question.options[i].optID,
                    OptionContext: question.options[i].opttxt,
                    FollowingQuestion: question.options[i].nextqID
                }
            }
            console.log('came here');

            /* Parse data to result: cvs variable */
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
            msg: err
        });
    }
    next();
};
