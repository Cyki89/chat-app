import { useOutletContext } from "react-router-dom";

import Input from "../forms/Input";

const BlankChatWindow = () => {
  const { showSidePanel } = useOutletContext();
  return (
    <div className="chat-window-container">
      <h2 className="chat-title text-center text-capitalize fg-white">
        ChatWindow
        <a className="btn-show-chats d-md-none" onClick={showSidePanel}>
          {"<<"}
        </a>
      </h2>
      <div className="message-container">
        <div className="message-container-messages"></div>
        <Input
          title=""
          placeholder="Enter message"
          style={{
            width: "100%",
            paddingInline: "1em",
          }}
          as="textarea"
        />
      </div>
    </div>
  );
};

export default BlankChatWindow;
