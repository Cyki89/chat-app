import { useState, useRef, useCallback } from "react";

import useEffectOnce from "../useEffectOnce";

const SERVER_HOST = "127.0.0.1:8000";

const useWebsocket = (user, uuid) => {
  const [error, setError] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [messages, setMessages] = useState([]);
  const webSocketRef = useRef();

  const onOpen = useCallback(() => {
    fetchNewMessages();
  }, []);

  const onMessage = useCallback((e) => {
    const data = JSON.parse(e.data);
    if (data.type === "fetch_messages") {
      setHasNext(data["has_next"]);
      setMessages((prevState) => [...data.messages, ...prevState]);
    }
    if (data.type === "group_message") {
      setMessages((prevState) => [...prevState, data.message]);
    }
  }, []);

  // const onClose = useCallback(() => {
  //   console.log("Unexpected clossing ...");
  // }, []);

  const onError = useCallback(() => {
    setError("Unexpected error occurs. Try again in a moment.");
  }, []);

  useEffectOnce(() => {
    if (webSocketRef.current) {
      setMessages([]);
      webSocketRef.current.close();
    }

    webSocketRef.current = new WebSocket(
      "ws://" + SERVER_HOST + "/ws/chat/" + uuid + "/"
    );

    webSocketRef.current.onopen = onOpen;
    webSocketRef.current.onmessage = onMessage;
    webSocketRef.current.onerror = onError;
    // webSocketRef.current.onclose = onClose;
  }, [uuid]);

  const sendMessage = (rawMessage) => {
    const message = rawMessage.trim();
    if (!message) return;

    if (webSocketRef.current.readyState !== 1) return;

    webSocketRef.current.send(
      JSON.stringify({
        type: "chat_message",
        payload: { message: message, user_id: user.id },
      })
    );

    setError(null);
  };

  const fetchNewMessages = () => {
    if (webSocketRef.current.readyState !== 1) return;
    webSocketRef.current.send(
      JSON.stringify({
        type: "fetch_messages",
        payload: { offset: messages.length },
      })
    );

    setError(null);
  };

  return { messages, sendMessage, fetchNewMessages, hasNext, error };
};

export default useWebsocket;
