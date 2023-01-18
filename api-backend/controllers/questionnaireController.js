const Questionnaire = require(`${__dirname}/../models/questionnaireModel`);
const Question = require(`${__dirname}/../models/questionModel`);

exports.getAllQuestionnaires = async (req, res) => {
    try {
        const questionnaires = await Questionnaire
            .find()
            .select({ _id: 0 })
            .populate('questions', { options: 0, _id: 0, __v: 0, questionnaireID: 0, wasAnsweredBy: 0 });

        return res.status(200).json({
            status: 'success',
            data: {
                questionnaires
            }
        });
    } catch (err) {
        return res.status(404).json({
            status: 'fail',
            msg: err
        });
    }
    next();
};

exports.getQuestionnaire = async (req, res) => {
    try {
        const questionnaire = await Questionnaire
            .findOne({ questionnaireID: req.params.questionnaireID })
            .select({ questionnaireID: 1, questionnaireTitle: 1, keywords: 1, questions: 1 })
            .populate('questions', { qID: 1, qtxt: 1, required: 1, type: 1 });

        console.log(questionnaire.questionnaireTitle);

        return res.status(200).json({
            status: 'success',
            data: {
                questionnaire
            }
        });
    } catch (err) {
        return res.status(404).json({
            status: 'fail',
            msg: err
        });
    }
    next();
};
