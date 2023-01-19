const Questionnaire = require(`${__dirname}/../models/questionnaireModel`);
const Question = require(`${__dirname}/../models/questionModel`);

exports.getAllQuestionnaires = async (req, res) => {
    try {
        const questionnaires = await Questionnaire
            .find()
            .select({ _id: 0 })
            .populate('questions', { options: 0, _id: 0, __v: 0, questionnaireID: 0, wasAnsweredBy: 0 });

        return res.status(questionnaires.length !== 0 ? 200 : 402).json({
            status: questionnaires.length !== 0 ? 'success' : 'no data',
            data: {
                questionnaires
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            msg: err
        });
    }
    next();
};

exports.getQuestionnaire = async (req, res) => {
    try {
        const questionnaire = await Questionnaire
            // .findOne({ questionnaireID: req.params.questionnaireID })
            .findOne(req.params)
            .select('-_id')
            // .populate('questions', { qID: 1, qtext: 1, required: 1, type: 1, _id: 0 });
            .populate('questions', 'qID qtext required type -_id');

        /* The query could be built by mongoose function, as so: */
        // const questionnaire = await Questionnaire.findOne()
        //     .where('questionnaireID')
        //     .equals(req.params.questionnaireID);
        // // .where('(other field)')
        // // .equals('(value)');

        return res.status(questionnaire ? 200 : 400).json({
            status: questionnaire ? 'success' : 'bad request',
            data: {
                questionnaire
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            msg: err
        });
    }
    next();
};
