import { createContext, useState, useContext } from "react";

const ChatsContext = createContext();

export const ChatsProvider = ({ children }) => {
  const [localChats, setLocalChats] = useState([]);

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
