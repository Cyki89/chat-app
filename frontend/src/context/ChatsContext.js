import { createContext, useState } from "react";
import { useContext } from "react";

const ChatsContext = createContext();

export const ChatsProvider = ({ children }) => {
  const [chats, setChats] = useState([]);

  const contextData = {
    chats,
    setChats,
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
