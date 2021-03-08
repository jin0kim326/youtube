import getBlobDuration from "get-blob-duration";

const videoContainer = document.querySelector("#jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.querySelector("#jsPlayButton");
const volumeBtn = document.querySelector("#jsVolumeButton");
const fullScreenBtn = document.querySelector("#jsScreenButton");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const volumeRange = document.querySelector("#jsVolume");

const registerView = () => {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, {
    method: "POST",
  });
};

const formatDate = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours}:${minutes}:${totalSeconds}`;
};

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function handleVolumnClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeRange.value = videoPlayer.volume;
  } else {
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    volumeRange.value = 0;
  }
}

function exitFullScreen() {
  fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullScreenBtn.addEventListener("click", goFullScreen);
  document.exitFullscreen();
}

function goFullScreen() {
  videoContainer.requestFullscreen();
  fullScreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullScreenBtn.removeEventListener("click", goFullScreen);
  fullScreenBtn.addEventListener("click", exitFullScreen);
}

function getCurrentTime() {
  currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
}

async function setTotalTime() {
  const blob = await fetch(videoPlayer.src).then((response) => response.blob());
  const duration = await getBlobDuration(blob);

  const totalTimeString = formatDate(duration);
  totalTime.innerHTML = totalTimeString;
}
function handleEnded() {
  registerView();
  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function handleDrag(event) {
  const {
    target: { value },
  } = event;
  console.log("drag");
  videoPlayer.volume = value;
  if (value >= 0.6) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (value >= 0.2) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
  }
}

const handleKeyEvent = (event) => {
  const keyName = event.key;

  switch (keyName) {
    case " ":
      event.preventDefault();
      handlePlayClick();
      break;
    case "ArrowUp":
      console.log(volumeRange);
      console.log(volumeRange.value);
      event.preventDefault();
      volumeRange.value = volumeRange + 0.1;
      videoPlayer.volume += 0.1;
      break;
    case "ArrowDown":
      console.log(volumeRange.value);
      event.preventDefault();
      volumeRange.value -= 0.1;
      videoPlayer.volume -= 0.1;
      break;
    default:
  }
};

function init() {
  videoPlayer.volume = 1;
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumnClick);
  fullScreenBtn.addEventListener("click", goFullScreen);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener("timeupdate", getCurrentTime);
  videoPlayer.addEventListener("ended", handleEnded);
  volumeRange.addEventListener("input", handleDrag);
  if (videoPlayer) {
    document.addEventListener("keydown", handleKeyEvent);
  }
}

if (videoContainer) {
  init();
}
