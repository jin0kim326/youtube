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
    req.flash("error", "동일한 비밀번호를 입력하세요.");
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
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "환영합니다.",
  failureFlash: "로그인에 실패했습니다. 이메일/비밀번호를 확인하세요.",
});

export const gitHubLogin = passport.authenticate("github", {
  successFlash: "환영합니다.",
  failureFlash: "로그인에 실패했습니다. 이메일/비밀번호를 확인하세요.",
});

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

export const kakaoLogin = passport.authenticate("kakao", {
  successFlash: "환영합니다.",
  failureFlash: "로그인에 실패했습니다. 이메일/비밀번호를 확인하세요.",
});

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
  req.flash("info", "로그아웃 완료");
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
    req.flash("error", "존재하지 않는 사용자");
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
    req.flash("success", "프로필 업데이트 완료");
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl,
    });
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "프로필 업데이트 실패");
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
      req.flash("error", "동일한 비밀번호를 입력하세요.");
      res.status(400);
      res.redirect(`${routes.users}${routes.changePassword}`);
      return;
    }
    req.flash("success", "비밀번호 변경 완료");
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "비밀번호를 변경할 수 없습니다.");
    res.status(400);
    res.redirect(`${routes.users}${routes.changePassword}`);
  }
};
