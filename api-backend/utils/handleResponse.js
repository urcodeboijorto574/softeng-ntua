const converter = require('json-2-csv');
const csv = require('csv-express');

// handle responses (send json or csv either)
exports.handleResponse = (req, res, statusCode, responseMessage) => {
    if (req.query.format === 'json' || !req.query.format) {
        return res.status(statusCode).json(responseMessage);
    } else if (req.query.format === 'csv') {
        return res.csv([responseMessage], true, {}, statusCode);
    } else {
        return res.status(400).json({
            status: 'failed',
            message: 'Response format must be either json or csv!',
        });
    }
};
