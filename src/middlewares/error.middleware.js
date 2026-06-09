const errorMiddleware = (err, req , res, next) =>   
{
    console.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (err.code === 'LIMIT_PART_COUNT') { 
        return res.status(400).json({
            success: false,
            message: 'Too many parts in the request'
        });
    } 
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File size exceeds the allowed limit'
        });
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
            success: false,
            message: 'Too many files uploaded'
        });
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...process.env.NODE_ENV === 'development' && { stack: err.stack }
    });
};

module.exports = errorMiddleware;
        














