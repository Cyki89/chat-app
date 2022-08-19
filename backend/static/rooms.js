const form = document.getElementById("chat-form");
const roomNameInput = document.getElementById("room-name");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  window.location.pathname = "/chat/" + roomNameInput.value + "/";
});
