// const videoContainer = document.querySelector("#jsVideoPlayer");
// const videoPlayer = document.querySelector("#jsVideoPlayer video");
// const playBtn = document.querySelector("#jsPlayBtn");

// function handlePlayClick() {
//   if (videoPlayer.paused) {
//     videoPlayer.play();
//   } else {
//     videoPlayer.pause();
//   }
// }

// function init() {
//   playBtn.addEventListener("click", handlePlayClick);
// }

// if (videoContainer) {
//   init();
// }

const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
  } else {
    videoPlayer.pause();
  }
}

function init() {
  playBtn.addEventListener("click", handlePlayClick);
} //

if (videoContainer) {
  init();
}
