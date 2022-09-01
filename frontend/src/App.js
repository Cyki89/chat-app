import { BrowserRouter } from "react-router-dom";

import { ApiProvider } from "./context/ApiContext";
import { AuthProvider } from "./context/AuthContext";
// import { ChatsProvider } from "./context/ChatsContext";

import Router from "./components/routes/Router";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <ApiProvider>
        <AuthProvider>
          {/* <ChatsProvider> */}
          <Router />
          {/* </ChatsProvider> */}
        </AuthProvider>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
