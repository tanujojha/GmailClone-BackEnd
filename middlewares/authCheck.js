
//AUTH CHECKER
export const authCheck = (req, res, next) => {
  // console.log(req.user);
  if (!req.user) {
    res.status(401).send({
      authenticated: false,
      message: "user has not been authenticated",
    });
  } else {
    next();
  }
};


