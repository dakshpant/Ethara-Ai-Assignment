export const roleMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      // check role
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };
};