import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const WebSock = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const socket = useRef();
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");

  const subscribe = async () => {
    const eventSource = new EventSource("http://localhost:5000/connect");
    eventSource.onmessage = function (event) {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };
  };

  const sendMessage = async () => {
    const message = {
      event: "message",
      username,
      message: value,
      id: Date.now(),
    };
    socket.current.send(JSON.stringify(message))
    setValue('')
  };

  function connect() {
    socket.current = new WebSocket("ws://localhost:5000/connect");

    socket.current.onopen = () => {
      setIsConnected(true);
      const message = {
        event: "connection",
        username,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };
    socket.current.onclose = () => {
      console.log("ws has ben closed");
    };
    socket.current.onerror = () => {
      console.log("ws has error");
    };
  }

  if (!isConnected) {
    return (
      <div className="center">
        <div className="form">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Введіть ім'я"
          />
          <button onClick={connect}>Ввійти</button>
        </div>
      </div>
    );
  }
  return (
    <div className="center">
      <div>
        <div className="form">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
          />
          <button onClick={sendMessage}>Отправить</button>
        </div>
        <div className="messages">
          {messages.map((mess) => (
            <div key={mess.id}>
              {mess.event === "connection" ? (
                <div className="connection_message">
                  Користувач {mess.username} підключився
                </div>
              ) : (
                <div className="message">
                  {mess.username}- {mess.message}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebSock;
