import passport from "passport";
import routes from "../routes";
import User from "../models/User";
import Video from "../models/Video";
import { printUploadTime } from "./functions";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({
        name,
        email,
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
    // To Do: Log user in``
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
});

export const gitHubLogin = passport.authenticate("github");

export const gitHubLoiginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, email, name },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    } else {
      const newUser = await User.create({
        githubId: id,
        avatarUrl,
        email,
        name,
      });
      return cb(null, newUser);
    }
  } catch (error) {
    return cb(error);
  }
};

export const postGitHubLogin = (req, res) => {
  res.redirect(routes.home);
};

export const kakaoLogin = passport.authenticate("kakao");

export const kakaoLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: {
      id,
      properties: { profile_image: avatarUrl },
      kakao_account: { email },
    },
    username: name,
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.kakaoId = id;
      user.save();
      return cb(null, user);
    } else {
      const newUser = await User.create({
        name,
        email,
        avatarUrl,
        kakaoId: id,
      });
      return cb(null, newUser);
    }
  } catch (error) {
    return cb(error);
  }
};

export const postKakaoLogin = (req, res) => {
  res.redirect(routes.home);
};
export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

const findBestVideoId = (user) => {
  let maxViews = 0;
  let willReturnId;

  user.videos.forEach((video) => {
    if (video.views > maxViews) {
      maxViews = video.views;
      willReturnId = video.id;
    }

    if (maxViews === 0) {
      willReturnId = video.id;
    }
  });
  return willReturnId;
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).populate("videos");
  const bestVideo = await Video.findById(findBestVideoId(user));
  printUploadTime(bestVideo);
  printUploadTime(user.videos);
  res.render("userDetail", { pageTitle: "Profile", user, bestVideo });
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    const bestVideo = await Video.findById(findBestVideoId(user));
    printUploadTime(bestVideo);
    printUploadTime(user.videos);
    res.render("userDetail", { pageTitle: "Profile", user, bestVideo });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) => {
  res.render("editProfile", { pageTitle: "Edit Profile" });
};

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? `/${file.path}` : req.user.avatarUrl,
    });
    res.redirect(routes.me);
  } catch (error) {
    res.redirect(routes.editProfile);
  }
};
export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  try {
    if (newPassword !== newPassword1) {
      res.status(400);
      res.redirect(`${routes.users}${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    res.redirect(`${routes.users}${routes.changePassword}`);
  }
};
