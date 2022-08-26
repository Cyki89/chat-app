import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

import groupChatImg from "./../../group-chat.png";

const ChatThumbnail = ({ chat, user }) => {
  const getPrivateChatName = () => {
    const participant = chat.participants.find((el) => el.id !== user.id);
    return participant.username;
  };

  return (
    <Stack direction="horizontal" className="message-otherclickable" gap={1}>
      <img className="message-avatar" src={groupChatImg} alt="" />
      <Card bg="dark" className="message-body w-100 bg-light-black my-2 p-2">
        <div className="message-info mb-1">
          <span className="message-info-title">
            {chat.name || getPrivateChatName()}
          </span>{" "}
          {chat.date_created}
        </div>
        <div>Last Message</div>
      </Card>
    </Stack>
  );
};

export default ChatThumbnail;
