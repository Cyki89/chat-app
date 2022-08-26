import { useState, useRef, useCallback, useLayoutEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useWebsocket from "../../hooks/chat/useWebsocket";
import useEventListener from "../../hooks/useEventListener";
import useScrollToBottom from "../../hooks/layout/useScrollToBottom";

import Input from "../forms/Input";
import ErrorContainer from "../forms/ErrorContainer";
import AuthorMessage from "./AuthorMessage";
import OtherMessage from "./OtherMessage";
import useEffectOnce from "./../../hooks/useEffectOnce";

const ChatWindow = () => {
  const { uuid } = useParams();
  const { user } = useAuth();
  const { showSidePanel } = useOutletContext();
  const [message, setMessage] = useState("");
  const { messages, sendMessage, fetchNewMessages, error, hasNext } =
    useWebsocket(user, uuid);

  const inputRef = useRef(null);
  const lastRef = useRef(null);
  const messageContainerRef = useRef(null);
  const scrollToBottom = useScrollToBottom(lastRef, messageContainerRef);

  useEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(message);
      if (!error) setMessage("");
    }
  });

  useLayoutEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffectOnce(() => {
    inputRef?.current.focus();
  }, [inputRef.current]);

  const msgType = (message) => {
    if (user.id === message.author_id)
      return <AuthorMessage message={message} />;
    return <OtherMessage message={message} />;
  };

  const intObserver = useRef();
  const firstMsgRef = useCallback(
    (node) => {
      if (!hasNext) return;
      if (intObserver.current) intObserver.current.disconnect();
      intObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          fetchNewMessages();
        }
      });
      if (node) intObserver.current.observe(node);
    },
    [messages, hasNext]
  );

  return (
    <div className="chat-window-container">
      <h2 className="chat-title text-center text-capitalize fg-white">
        ChatWindow
        <a className="btn-show-chats d-md-none" onClick={showSidePanel}>
          {"<<"}
        </a>
      </h2>
      {error && <ErrorContainer errors={error} />}
      <div className="message-container">
        <div className="message-container-messages" ref={messageContainerRef}>
          {messages.length > 0 &&
            messages.map((message, idx) => (
              <div
                ref={
                  idx === 0
                    ? firstMsgRef
                    : idx + 1 === messages.length
                    ? lastRef
                    : null
                }
                key={message.id}>
                {msgType(message)}
              </div>
            ))}
        </div>
        <Input
          title=""
          value={message}
          setValue={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
          style={{
            width: "100%",
            paddingInline: "1em",
          }}
          as="textarea"
          ref={inputRef}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
