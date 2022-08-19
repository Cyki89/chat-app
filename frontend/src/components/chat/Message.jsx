import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

const Message = ({ message, user }) => {
  const authorMessage = (
    <Stack direction="horizontal" className="message-author" gap={1}>
      <img
        className="message-avatar"
        src={message.author_profile_image}
        alt=""
      />
      <Card bg="dark" className="my-2 message-body p-2">
        <div className="message-info mb-1">
          {message.author} {message.timestamp}
        </div>
        <div>{message.body}</div>
      </Card>
    </Stack>
  );

  const otherMessage = (
    <Stack direction="horizontal" className="message-other" gap={1}>
      <Card bg="dark" className="my-2 message-body p-2">
        <div className="message-info mb-1">
          {message.author} {message.timestamp}
        </div>
        <div>{message.body}</div>
      </Card>
      <img
        className="message-avatar"
        src={message.author_profile_image}
        alt=""
      />
    </Stack>
  );

  return <>{user.id === message.author_id ? authorMessage : otherMessage}</>;
};

export default Message;
