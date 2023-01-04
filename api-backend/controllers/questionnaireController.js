const Questionnaire = require('./../models/questionnaireModel');

exports.getAllQuestionnaires = async (req, res, next) => {
    try {
        console.log('here');
        const questionnaires = await Questionnaire.find()
            .populate({
                path: 'questions',
                select: { qID: 1, qtext: 1, required: 1, type: 1, _id: 0 },
                options: { sort: { qID: 1 } },
                populate: {
                    path: 'options',
                    model: 'Option',
                    //select: 'optID opttxt nextqID',
                    select: { _id: 0, __v: 0 },
                },
            })
            .select({ _id: 0, __v: 0 });
        res.status(200).json({
            status: 'success',
            data: {
                questionnaires,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
    next();
};

exports.getQuestionnaire = async (req, res, next) => {
    try {
        /* const questionnaire = await Questionnaire.findById(
            req.params.questionnaireID
        ) */
        const questionnaire = await Questionnaire.find({
            questionnaireID: req.params.questionnaireID,
        })
            .populate({
                path: 'questions',
                select: { qID: 1, qtext: 1, required: 1, type: 1, _id: 0 },
                options: { sort: { qID: 1 } },
            })
            .select({ _id: 0, __v: 0 });
        res.status(200).json({
            status: 'success',
            data: {
                questionnaire,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
    next();
};
