export const throwError = (err, statusCode) => {
  const error = new Error(err);
  error.status = statusCode;
  throw error;
};
