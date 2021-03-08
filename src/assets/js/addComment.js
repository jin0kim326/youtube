import axios from "axios";

const addCommentForm = document.querySelector("#jsAddComment");
const commentList = document.querySelector("#jsCommentList");
const commentNumber = document.querySelector("#jsCommentNumber");
const commentInput = document.querySelector("#jsCommentInput");
const commentBtns = document.querySelector("#jsCommentBtns");
const commentUpload = document.querySelector("#jsCommentUpload");
const commentCancel = document.querySelector("#jsCommentCancel");

let loggedUser;
let avatarUrl;

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = (comment) => {
  const commentBlock = document.createElement("li");
  commentBlock.setAttribute("class", "commentBlock");
  commentBlock.innerHTML = `
    <img src="${avatarUrl}" class="u-avatar--comment" />
    <div class="commentBlock-main">
      <div class="commentBlock-user">
        <a href="">
          <span class="comment-username">${loggedUser}</span>
        </a>
        <span class="comment-uploadTime">방금전</span>
      </div>
      <div class="commentBlock-text">
        <span class="comment-text">${comment}</span>
      </div>
    </div>
  `;
  commentList.prepend(commentBlock);

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
  avatarUrl =
    event.target.parentNode.parentNode.previousSibling.previousSibling
      .currentSrc;
  loggedUser = event.target.parentNode.parentNode.previousSibling.outerText;

  const comment = commentInput.value;
  if (comment === "") {
    return;
  }

  sendComment(comment);
  commentInput.value = "";
};

const focusInInput = () => {
  commentBtns.style.display = "flex";
};

const focusOutInput = () => {};

const changeInput = () => {
  if (commentInput.value === "") {
    commentUpload.classList.remove("existValue");
  } else {
    commentUpload.classList.add("existValue");
  }
};

const handleCancel = () => {
  commentInput.value = "";
  commentBtns.style.display = "none";
};

function init() {
  commentUpload.addEventListener("click", handleSubmit);
  commentCancel.addEventListener("click", handleCancel);
  commentInput.addEventListener("focusin", focusInInput);
  commentInput.addEventListener("input", changeInput);
  commentInput.addEventListener("focusout", focusOutInput);
}

if (addCommentForm) {
  init();
}
