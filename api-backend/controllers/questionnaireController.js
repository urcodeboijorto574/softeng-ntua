const mongoose = require('mongoose');
const json2csv = require('json2csv');
const Questionnaire = require('./../models/questionnaireModel');
const Question = require('./../models/questionModel');
const Option = require(`${__dirname}/../models/optionModel`);

exports.getQuestionnaire = async (req, res) => {
    try {
        const questionnaire = await Questionnaire.findOne({
            questionnaireID: req.params.questionnaireID,
        }).populate('questions', 'qID qtext required type -_id');

        res.status(questionnaire ? 200 : 400);

        if (req.query.format === 'json') {
            return res.json({
                status: questionnaire ? 'success' : 'bad request',
                data: { questionnaire },
            });
        } else if (req.query.format === 'csv') {
            const fieldNames = ['ID', 'Title', 'Question', 'Keyword'];
            let retval = [];

            /* Fill retval array */
            for (
                let i = 0, index = 0;
                i < questionnaire.questions.length;
                ++i
            ) {
                for (let j = 0; j < questionnaire.keywords.length; ++j) {
                    retval[index++] = {
                        ID: questionnaire.questionnaireID,
                        Title: questionnaire.questionnaireTitle,
                        Question: questionnaire.questions[i],
                        Keyword: questionnaire.keywords[j],
                    };
                }
            }

            /* Parse data to result: csv variable */
            const json2csvparser = new json2csv.Parser({ fieldNames });
            const result = json2csvparser.parse(retval);
            console.log('result:');
            console.log(result);

            return res.send(result);
        } else {
            return res.status(400).json({
                status: 'fail',
                msg: 'Content-type can be either application/json or text/csv',
            });
        }
    } catch (err) {
        console.error(err);
        ``;
        return res.status(500).json({
            status: 'fail',
            msg: err,
        });
    }
    next();
};
