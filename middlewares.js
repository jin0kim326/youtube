import routes from "./routes";
import multer from "multer";

const multerVideo = multer({ dest: "uploads/videos/" });

export const localsMiddlewares = (req, res, next) => {
  res.locals.siteName = "YouTube";
  res.locals.routes = routes;
  res.locals.user = req.user || {};
  next();
};

export const uploadVideo = multerVideo.single("videoFile");
