import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

const ChatMessage = ({ user, message }) => {
  const user_is_author = user.id === message.author_id;
  const messageClass = user_is_author ? "message-author" : "message-other";
  const alignClass = user_is_author ? "ml" : "mr";

  const MessageAvatar = (
    <img className="message-avatar" src={message.author_profile_image} alt="" />
  );

  const MessageBody = (
    <Card bg="dark" className="message-body bg-light-black my-2 p-2">
      <div className={`${alignClass}-auto mb-1`}>
        <span className="message-info-title mr-2">{message.author}</span>
        <span className="fg-primary">{message.timestamp}</span>
      </div>
      <div className={`${alignClass}-auto fs-11`}>{message.body}</div>
      <div className={`message-files ${alignClass}-auto`}>
        {message.attachments.map((attachment) => (
          <a
            href={attachment.file_url}
            className={`text-nowrap ${alignClass}-2`}>
            {attachment.name}
          </a>
        ))}
      </div>
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
