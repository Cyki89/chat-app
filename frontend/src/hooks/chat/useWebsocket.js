import { useRef, useCallback } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import useEffectOnce from "../useEffectOnce";

const SERVER_HOST = "127.0.0.1:8000";

const useWebsocket = (user) => {
  const { name: roomName } = useParams();
  const [error, setError] = useState(false);
  const [messages, setMessages] = useState([]);
  const webSocketRef = useRef();

  const onMessage = useCallback((e) => {
    const data = JSON.parse(e.data);
    if (data.type === "fetch_messages") setMessages(data.messages);
    if (data.type === "group_message") {
      console.log("group message send");
      setMessages((prevState) => [...prevState, data.message]);
    }
  }, []);

  const onClose = useCallback(() => {
    webSocketRef.current = new WebSocket(
      "ws://" + SERVER_HOST + "/ws/chat/" + roomName + "/"
    );
    console.log("Unexpected clossing ...");
    setError("Server is currently unavailable. Try again in a moment.");
  }, []);

  const onError = useCallback(() => {
    console.log("Unexpected error ...");
    setError("Unexpected error occurs. Try again in a moment.");
  }, []);

  useEffectOnce(() => {
    webSocketRef.current = new WebSocket(
      "ws://" + SERVER_HOST + "/ws/chat/" + roomName + "/"
    );

    webSocketRef.current.onmessage = onMessage;
    webSocketRef.current.onerror = onError;
    webSocketRef.current.onclose = onClose;
  }, [onMessage, onClose, onError]);

  const sendMessage = (rawMessage) => {
    const message = rawMessage.trim();
    if (!message) return;

    if (webSocketRef.current.readyState !== 1) return;

    webSocketRef.current.send(
      JSON.stringify({ message: message, user_id: user.id })
    );

    setError(null);
  };

  return [messages, sendMessage, error];
};

export default useWebsocket;
