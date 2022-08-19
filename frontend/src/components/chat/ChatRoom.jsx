import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

import useAuth from "./../../hooks/useAuth";
import useWebsocket from "../../hooks/chat/useWebsocket";
import useEventListener from "../../hooks/useEventListener";
import useScrollToBottom from "../../hooks/layout/useScrollToBottom";

import Message from "./Message";
import Input from "../forms/Input";
import ErrorContainer from "../forms/ErrorContainer";

const ChatRoom = () => {
  const { name } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, sendMessage, error] = useWebsocket(user);

  const messageContainerRef = useRef(null);
  const scrollToBottom = useScrollToBottom(messageContainerRef);

  useEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendMessage(message);
      if (!error) setMessage("");
    }
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <h1 className="text-capitalize fg-white mb-3">Chat Room: "{name}"</h1>
      {error && <ErrorContainer errors={error} />}
      <div className="message-container" ref={messageContainerRef}>
        {messages &&
          messages.map((message) => (
            <Message key={message.id} message={message} user={user} />
          ))}
        <Input
          title=""
          value={message}
          setValue={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
          style={{ width: "100%" }}
          as="textarea"
        />
      </div>
      <div ref={messageContainerRef} />
    </>
  );
};

export default ChatRoom;
