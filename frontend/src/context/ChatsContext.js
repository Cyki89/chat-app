import { createContext, useState, useContext } from "react";
import { useLocalStorage } from "../hooks/useStorage";
import useAuth from "./../hooks/useAuth";

const ChatsContext = createContext();

export const ChatsProvider = ({ children }) => {
  const { user } = useAuth();
  const [localChats, setLocalChats] = useState([]);
  const [files, setFiles, resetFiles, removeFiles] = useLocalStorage(
    `${user.id}:files`,
    []
  );

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
