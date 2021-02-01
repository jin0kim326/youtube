import routes from "./routes";

export const localsMiddlewares = (req, res, next) => {
  res.locals.siteName = "YouTube";
  res.locals.routes = routes;
  res.locals.user = {
    isAuthenticated: true,
    id: 333,
  };
  next();
};
