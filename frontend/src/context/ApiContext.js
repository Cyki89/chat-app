import { createContext, useState, useContext } from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [apiAvailable, setApiAvailable] = useState(true);

  const contextData = {
    apiAvailable,
    setApiAvailable,
  };

  return (
    <ApiContext.Provider value={contextData}>{children}</ApiContext.Provider>
  );
};

export const useApi = () => {
  return useContext(ApiContext);
};
