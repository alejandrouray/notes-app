const ERROR_HANDLERS = {
  CastError: res =>
    res.status(404).json({ error: 'id used is malformed' }),

  ValidationError: (res, { message }) =>
    res.status(409).json({ error: message }),

  JsonWebTokenError: (res) =>
    res.status(401).json({ error: 'token missing or invalid' }),

  TokenExpirerError: res =>
    res.status(401).json({ error: 'token expired' }),

  defaultError: (res, error) => {
    console.error(error.name);
    res.status(500).end();
  }
};

module.exports = (error, request, response, next) => {
  const handler =
    ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError;

  handler(response, error);
};
