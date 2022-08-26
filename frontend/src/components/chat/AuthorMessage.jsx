import { forwardRef } from "react";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

const AuthorMessage = ({ message }, ref) => {
  return (
    <Stack direction="horizontal" className="message-author" gap={1}>
      <Card bg="dark" className="message-body bg-secondary my-2 p-2">
        <div className="message-info mb-1">
          <span className="message-info-title">{message.author}</span>{" "}
          {message.timestamp}
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
};

export default forwardRef(AuthorMessage);
