import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { router } from "./router";

const app = express();

const handleHome = (req, res) => res.send("Hi from Home!dd");

const handleProfile = (req, res) => res.send("You are on my profile");

const handleRedirect = (req, res, next) => res.redirect("/");

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.get("/", handleHome);
app.get("/profile", handleRedirect, handleProfile);
app.use("/user", router);

export default app;
