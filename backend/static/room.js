const roomName = JSON.parse(document.getElementById("room-name").textContent);
const form = document.getElementById("chat-form");
const messageInput = document.getElementById("chat-message-input");
const chatLog = document.getElementById("chat-log");

const chatSocket = new WebSocket(
  "ws://" + window.location.host + "/ws/chat/" + roomName + "/"
);

chatSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  if (data.type === "fetch_messages") {
    data.messages.forEach((message) => {
      chatLog.value += message + "\n";
    });
  }
  if (data.type === "group_message") chatLog.value += data.message + "\n";
};

chatSocket.onclose = function (e) {
  console.error("Chat socket closed unexpectedly");
};

document.querySelector("#chat-message-input").focus();
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  chatSocket.send(JSON.stringify({ message: message }));
  messageInput.value = "";
});
