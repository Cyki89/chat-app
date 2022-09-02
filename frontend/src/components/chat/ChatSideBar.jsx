import { useRef, useCallback } from "react";
import { Link } from "react-router-dom";

import { useChatsContext } from "../../context/ChatsContext";

import { useAuth } from "../../context/AuthContext";
import useAxiosFunction from "../../hooks/axios/useAxiosFunction";
import useAxiosPrivate from "./../../hooks/axios/useAxiosPrivate";
import useEffectOnce from "../../hooks/utils/useEffectOnce";

import Button from "react-bootstrap/Button";

import ChatThumbnail from "./ChatThumbnail";
import PrivateChatModal from "./PrivateChatModal";
import GroupChatModal from "./GroupChatModal";

import ErrorScreen from "../special_screens/ErrorScreen";

const ChatSideBar = ({ hideSidePanel }) => {
  const { user } = useAuth();
  const { localChats, setLocalChats } = useChatsContext();
  const nextChats = useRef();

  const privateChatModalRef = useRef();
  const groupChatModalRef = useRef();

  const openPrivateChatModal = () => {
    privateChatModalRef.current.openModal();
  };

  const openGroupChatModal = () => {
    groupChatModalRef.current.openModal();
  };

  const axios = useAxiosPrivate();
  const [response, error, loading, axiosFetch] = useAxiosFunction();
  const fetchMoreChats = () => {
    if (nextChats.current === null) return;

    axiosFetch({
      axiosInstance: axios,
      method: "GET",
      url: nextChats.current || "/chat/api/",
    });
  };

  useEffectOnce(() => {
    fetchMoreChats();
  }, []);

  useEffectOnce(() => {
    if (response) {
      setLocalChats((prev) => [...prev, ...response.results]);
      nextChats.current = response.next;
    }
  }, [response]);

  const intObserver = useRef();
  const lastChatRef = useCallback(
    (node) => {
      if (loading) return;
      if (intObserver.current) intObserver.current.disconnect();
      intObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextChats.current) {
          fetchMoreChats();
        }
      });
      if (node) intObserver.current.observe(node);
    },
    [loading, nextChats.current]
  );

  const context = () => {
    if (error) return <ErrorScreen>{error.message}</ErrorScreen>;
    return (
      <div className="chat-window-container">
        <h2 className="chat-title text-center text-capitalize fg-white">
          Conversations
        </h2>
        <div className="chat-sidebar">
          <div className="chat-sidebar-contacts w-100">
            {localChats.length > 0 &&
              localChats.map((chat, idx) => (
                <Link
                  ref={idx + 1 === localChats.length ? lastChatRef : null}
                  key={chat.uuid}
                  to={`/chat/${chat.uuid}`}
                  replace={true}
                  onClick={hideSidePanel}>
                  <ChatThumbnail chat={chat} user={user} />
                </Link>
              ))}
          </div>
          <div className="chat-sidebar-buttons my-3">
            <Button
              className="btn-chat btn-block mb-2"
              onClick={openPrivateChatModal}>
              Add Conversation
            </Button>
            <Button className="btn-chat btn-block" onClick={openGroupChatModal}>
              Add Group Chat
            </Button>
          </div>
        </div>
        <PrivateChatModal ref={privateChatModalRef} />
        <GroupChatModal ref={groupChatModalRef} />
      </div>
    );
  };

  return context();
};

export default ChatSideBar;
