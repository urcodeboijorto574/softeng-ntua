
exports.getHealthcheck = (res, req) => {
    res.status(200).json({
        status: 'success',
        message: 'Everything is fine!'
    });
}
