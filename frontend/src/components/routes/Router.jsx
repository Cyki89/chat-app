import { Routes, Route } from "react-router-dom";

import Layout from "../Layout";

import Home from "./Home";
import Missing from "./Missing";
import Authenticated from "./Authenticated";
import Unauthenticated from "./Unauthenticated";
import Unauthorized from "./Unauthorized";
import Unconnected from "./Unconnected";

import PersistLogin from "../functional/PersistLogin";
import ProtectedRoute from "../functional/ProtectedRoute";
import OnlyUnauthRoute from "../functional/OnlyUnauthRoute";

import Chat from "./../chat/Chat";
import BlankChatWindow from "../chat/BlankChatWindow";
import ChatWindow from "../chat/ChatWindow";

import Login from "../users/Login";
import Logout from "../users/Logout";
import Register from "../users/Register";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<PersistLogin />}>
          <Route element={<OnlyUnauthRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="chat" element={<ProtectedRoute />}>
            <Route path="" element={<Chat />}>
              <Route path="" element={<BlankChatWindow />} />
              <Route path=":uuid" element={<ChatWindow />} />
            </Route>
          </Route>
          <Route path="" element={<Home />} />
          <Route path="authenticated" element={<Authenticated />} />
          <Route path="logout" element={<Logout />} />
          <Route path="unconnected" element={<Unconnected />} />
          <Route path="unauthenticated" element={<Unauthenticated />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Missing />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
