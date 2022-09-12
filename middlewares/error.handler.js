const { ValidationError }= require('sequelize');
function logErrors (err, req, res, next) {
  console.error(err);
  next(err);
}

function errorHandler(err, req, res) {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
}
const ormErrorHandler=(err, req, res, next)=>{
  if(err instanceof ValidationError){ //si mi error es una instancia de mi ORM...
    res.status(409).json({ //todos estos errores serán 409
      statusCode: 409,
      message: err.name,
      errors: err.errors
    });
  }
  next(err); //devuelve esto en caso de error.
}

module.exports = { logErrors, errorHandler, boomErrorHandler,ormErrorHandler}
