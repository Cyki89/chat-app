import { createContext, useState, useContext } from "react";
import { useLocalStorage } from "../hooks/utils/useStorage";

import axios from "../api/axios";
import useAxios from "../hooks/axios/useAxios";
import { useAuth } from "./AuthContext";
import useEffectOnce from "../hooks/utils/useEffectOnce";

const ChatsContext = createContext();

export const ChatsProvider = ({ children }) => {
  const { user } = useAuth();
  const [localChats, setLocalChats] = useState([]);
  const [files, setFiles, resetFiles, removeFiles] = useLocalStorage(
    `${user.id}:files`,
    []
  );
  const [chatUsers, setChatUsers] = useState([]);
  const [response, error, loading] = useAxios({
    axiosInstance: axios,
    method: "GET",
    url: "chat/api/users/",
  });

  useEffectOnce(() => {
    if (response) setChatUsers(response);
  }, [response]);

  const updateChat = (uuid, message) => {
    setLocalChats((chats) => {
      const changedChat = { ...chats.find((chat) => chat.uuid === uuid) };
      changedChat.timestamp = message.timestamp;
      changedChat.last_message.message = message.body;
      changedChat.last_message.user = message.author;

      return [changedChat, ...chats.filter((chat) => chat.uuid !== uuid)];
    });
  };

  const contextData = {
    localChats,
    setLocalChats,
    updateChat,
    chatUsers,
    files,
    setFiles,
    resetFiles,
    removeFiles,
  };

  return (
    <ChatsContext.Provider value={contextData}>
      {children}
    </ChatsContext.Provider>
  );
};

export const useChatsContext = () => {
  return useContext(ChatsContext);
};
