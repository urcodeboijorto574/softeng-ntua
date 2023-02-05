const Questionnaire = require('../models/questionnaireModel');

exports.getQuestionnaire = async (req, res) => {
    try {
        const questionnaire = await Questionnaire.findOne({
            questionnaireID: req.params.questionnaireID,
        })
            .select({ _id: 0, __v: 0 })
            .populate({
                path: 'questions',
                select: {
                    _id: 0,
                    __v: 0,
                    wasAnsweredBy: 0,
                    options: 0,
                    questionnaireID: 0,
                },
                options: { sort: { qID: 1 } },
            });
        if (!questionnaire) {
            return res.status(400).json({
                status: 'fail',
                message: `Questionnaire ID ${req.params.questionnaireID} not found`,
            });
        }

        if (!req.username = questionnaire.creator){return res.json({status: 'Fail', message: 'Access denied'})}
        return res
            .status(200)
            .json({ status: 'OK', questionnaire: questionnaire });
    } catch (err) {
        return res
            .status(500)
            .json({ status: 'Fail', message: 'Internal server error' });
    }
};