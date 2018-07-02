function logger (req, res, next) {
  console.log('📝   %s %s %s', req.method, req.url, req.path);
  next();
};

export default logger;
