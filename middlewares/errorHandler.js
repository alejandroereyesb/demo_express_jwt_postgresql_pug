function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);

    // Responder con un mensaje de error genérico o específico
    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Error interno del servidor',
    });
}

module.exports = errorHandler;
