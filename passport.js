import passport from "passport";
import dotenv from "dotenv";
import GitHubStrategy from "passport-github";
import { gitHubLoiginCallback } from "./controllers/userController";
import User from "./models/User";
import routes from "./routes";

dotenv.config();

passport.use(User.createStrategy());

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: `http://localhost:4000${routes.gitHubCallback}`,
    },
    gitHubLoiginCallback
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
