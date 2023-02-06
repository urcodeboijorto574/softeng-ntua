const converter = require('json-2-csv');
const csv = require('csv-express');

// handle responses (send json or csv either)
exports.handleResponse = (req, res, statusCode, responseMessage) => {
    if (req.query.format === 'json' || !req.query.format) {
        return res.status(statusCode).json(responseMessage);
    } else if (req.query.format === 'csv') {
        res.set({
            'Content-Type': 'text/csv',
        });
        converter.json2csv(responseMessage, (err, csv) => {
            console.log(csv);
            res.status(statusCode).send(csv);
        });
    } else {
        return res.status(400).json({
            status: 'failed',
            message: 'Response format is json or csv!',
        });
    }
};
