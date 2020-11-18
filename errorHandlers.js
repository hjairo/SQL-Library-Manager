// 404 Error handler and sends it to the global handler
const pageErrorHandler = (req, res, next) => {
  const err = new Error();
  err.message = "Whoops, that page doesn't exist.";
  err.status = 404;
  next(err);
};

// Global error handler
const globalHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.render("page-not-found", { err });
  } else {
    err.message = err.message || "Wot'n tornation? There was an error with the server.";
    err.status = err.status || 500;
    res.render("error", { err });
  }
};

module.exports = { pageErrorHandler, globalHandler };