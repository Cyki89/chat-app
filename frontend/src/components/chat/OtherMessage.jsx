import { forwardRef } from "react";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

const OtherMessage = ({ message }, ref) => {
  return (
    <Stack direction="horizontal" className="message-other" gap={1}>
      <img
        className="message-avatar"
        src={message.author_profile_image}
        alt=""
      />
      <Card bg="dark" className="message-body bg-light-black my-2 p-2">
        <div className="message-info mb-1">
          {message.author} {message.timestamp}
        </div>
        <div>{message.body}</div>
      </Card>
    </Stack>
  );
};

export default forwardRef(OtherMessage);
