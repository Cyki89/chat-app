import { useState, useRef, useCallback, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";

import { useChatsContext } from "../../context/ChatsContext";

import { useAuth } from "../../context/AuthContext";
import useWebsocket from "../../hooks/chat/useWebsocket";
import useEventListener from "../../hooks/utils/useEventListener";
import useScrollToBottom from "../../hooks/layout/useScrollToBottom";

import Input from "../forms/Input";
import ErrorContainer from "../forms/ErrorContainer";
import useEffectOnce from "../../hooks/utils/useEffectOnce";
import ChatMessage from "./ChatMessage";
import FilesUploadContainer from "./FilesUploadContainer";

const ChatWindow = ({ showSidePanel }) => {
  const { uuid } = useParams();
  const { user } = useAuth();
  const { localChats, files, resetFiles } = useChatsContext();
  const [message, setMessage] = useState("");
  const [currChat, setCurrChat] = useState(null);
  const { messages, sendMessage, fetchNewMessages, error, hasNext } =
    useWebsocket(user, uuid);

  const inputRef = useRef(null);
  const lastRef = useRef(null);
  const messageContainerRef = useRef(null);
  const scrollToBottom = useScrollToBottom(lastRef, messageContainerRef);

  useEffectOnce(() => {
    setCurrChat(localChats.find((chat) => chat.uuid === uuid));
  }, [uuid, localChats]);

  const chatName = useCallback(() => {
    if (!currChat) return "Select Chat";

    if (currChat.is_group_chat) return currChat.name;

    const participant = currChat.participants.find((el) => el.id !== user.id);
    return participant.username;
  }, [currChat]);

  useEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      sendMessage(message, files);
      if (error) return;

      setMessage("");
      resetFiles();
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

  const intObserver = useRef();
  const firstMsgRef = useCallback(
    (node) => {
      if (!hasNext) return;
      if (intObserver.current) intObserver.current.disconnect();
      intObserver.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNext) {
            fetchNewMessages();
          }
        },
        { rootMargin: "-50px" }
      );
      if (node) intObserver.current.observe(node);
    },
    [messages, hasNext]
  );

  const getMsgRef = (idx) => {
    let ref = null;
    if (idx === 0) ref = firstMsgRef;
    else if (idx + 1 === messages.length) ref = lastRef;
    return ref;
  };

  const renderMessages = () => {
    if (!messages.length) return null;
    return messages.map((message, idx) => (
      <div ref={getMsgRef(idx)} key={message.id}>
        {<ChatMessage user={user} message={message} />}
      </div>
    ));
  };

  return (
    <div className="chat-window-container">
      <h2 className="chat-title text-center text-capitalize fg-white">
        {chatName()}
        <a className="btn-show-chats d-md-none" onClick={showSidePanel}>
          {"<<"}
        </a>
      </h2>
      {error && <ErrorContainer errors={error} />}
      <div className="message-container">
        <div className="message-container-messages" ref={messageContainerRef}>
          {renderMessages()}
        </div>
        <div>
          <FilesUploadContainer />
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
            disabled={!uuid}
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
