import passport from "passport";
import dotenv from "dotenv";
import GitHubStrategy from "passport-github";
import KakaoStrategy from "passport-kakao";
import {
  kakaoLoginCallback,
  gitHubLoiginCallback,
} from "./controllers/userController";
import User from "./models/User";
import routes from "./routes";

dotenv.config();

passport.use(User.createStrategy());

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://jin-youtube.herokuapp.com/${routes.githubCallback}`
        : `http://localhost:4000${routes.githubCallback}`,
    },
    gitHubLoiginCallback
  )
);

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_ID,
      clientSecret: process.env.KAKAO_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://jin-youtube.herokuapp.com/${routes.kakaoCallback}`
        : `http://localhost:4000${routes.kakaoCallback}`,
    },
    kakaoLoginCallback
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
