function exceptionHandler(err, req, res, next) {
    // Log the exception
    productService.logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    if (err.status) {
        res.status(err.status).send(err.message);
    } else {
        res.status(500).send('Internal Server Error');
    }
}

module.exports = exceptionHandler;
