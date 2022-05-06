const requireUser = (req, res, next) => {
  // const user = res.locals.user;
   const user = req.user;
  if (!user) {
    return res.status(403).send({
      success: false,
      message: 'You must be logged in to access this resource',
    });
  }

  return next();
};

module.exports = requireUser;
