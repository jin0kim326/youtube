import axios from "axios";

const addCommentForm = document.querySelector("#jsAddComment");
const commentList = document.querySelector("#jsCommentList");
const commentNumber = document.querySelector("#jsCommentNumber");
const commentInput = document.querySelector("#jsCommentInput");
const commentBtns = document.querySelector("#jsCommentBtns");
const commentUnderLine = document.querySelector("#jsCommentUnderLine");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = (comment) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerHTML = comment;
  li.appendChild(span);
  commentList.prepend(li);
  increaseNumber();
};

const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    addComment(comment);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

const focusInInput = () => {
  commentBtns.style.display = "flex";
};

const focusOutInput = () => {};
function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
  commentInput.addEventListener("focusin", focusInInput);
  commentInput.addEventListener("focusout", focusOutInput);
}

if (addCommentForm) {
  init();
}
