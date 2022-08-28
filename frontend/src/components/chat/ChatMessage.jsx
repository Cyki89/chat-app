import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

const ChatMessage = ({ user, message }) => {
  const user_is_author = user.id === message.author_id;
  const messageClass = user_is_author ? "message-author" : "message-other";

  const MessageAvatar = (
    <img className="message-avatar" src={message.author_profile_image} alt="" />
  );

  const MessageBody = (
    <Card bg="dark" className="message-body bg-light-black my-2 p-2">
      <div className="message-info mb-1">
        {message.author} {message.timestamp}
      </div>
      <div>{message.body}</div>
    </Card>
  );

  const AuthorMsg = (
    <>
      {MessageBody}
      {MessageAvatar}
    </>
  );

  const OtherMsg = (
    <>
      {MessageAvatar}
      {MessageBody}
    </>
  );

  return (
    <Stack direction="horizontal" className={messageClass} gap={1}>
      {user_is_author ? AuthorMsg : OtherMsg}
    </Stack>
  );
};

export default ChatMessage;
