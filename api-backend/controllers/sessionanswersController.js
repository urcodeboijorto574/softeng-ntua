const session = require('../models/sessionModel');

exports.getSessionanswers = async (req, res) => {
    try {
        const sessionanswers = await session
            .findOne({
                questionnaireID: req.params.questionnaireID,
                session: req.params.session,
            })
            .select({ _id: 0, __v: 0, submitter: 0 })
            .populate({
                path: 'answers',
                select: {
                    _id: 0,
                    optID: 0,
                    sessionID: 0,
                    questionnaireID: 0,
                    __v: 0,
                },
                options: { sort: { qID: 1 } },
            });
        if (!sessionanswers) {
            return res
                .status(400)
                .json({
                    status: 'Fail',
                    message: `Session ID ${req.params.session} not found`,
                });
        }
        if (!req.username === questionnaire.creator){return res.json({status: 'Fail', message: 'Access denied'})}
        return res
            .status(200)
            .json({ status: 'OK', sessionanswers: sessionanswers });
    } catch (err) {
        return res
            .status(500)
            .json({ status: 'Fail', message: 'internal server error' });
    }
};
