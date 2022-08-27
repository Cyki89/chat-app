import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

import groupChatImg from "./../../group-chat.png";

const ChatThumbnail = ({ chat, user }) => {
  const chatName = () => {
    if (chat.is_group_chat) return chat.name;

    const participant = chat.participants.find((el) => el.id !== user.id);
    return participant.username;
  };

  const chatAvatar = () => {
    if (chat.is_group_chat) return groupChatImg;

    const participant = chat.participants.find((el) => el.id !== user.id);
    return participant.avatar;
  };

  const lastMessageAuthor = () => {
    const last_message = chat.last_message;
    if (!last_message) return "";

    return user.username === last_message.user ? "you" : last_message.user;
  };

  return (
    <Stack direction="horizontal" className="message-otherclickable" gap={1}>
      <img className="message-avatar" src={chatAvatar()} alt="" />
      <Card bg="dark" className="message-body w-100 bg-light-black my-2 p-2">
        <div className="message-info mb-1">
          <span className="message-info-title">{chatName()}</span>{" "}
          {chat.timestamp}
        </div>
        <div>
          <span className="fw-bold">{lastMessageAuthor()}: </span>
          {chat.last_message.message}
        </div>
      </Card>
    </Stack>
  );
};

export default ChatThumbnail;
