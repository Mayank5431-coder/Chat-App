import { useEffect, useRef, useState } from "react";

export default function App() {
  const wsRef = useRef<WebSocket | null>(null);
  const messageRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<string[]>(["Hi There", "I don't want to talk"]);

  function sendMessage() {
    const value = messageRef.current?.value; 
    if (!value) {
      alert("First write a message");
      return;
    }
    if (!wsRef.current) {
      return;
    }
    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: value,
        },
      })
    );
    if (messageRef.current) {
      messageRef.current.value = ""; 
    }
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      setMessage((m) => [...m, event.data]);
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="h-screen bg-black">
      <br />
      <br />
      <br />
      <div className="h-[85vh] overflow-y-auto">
        {message.map((message, index) => (
          <div className="m-8" key={index}>
            <span className="bg-white text-black rounded p-4">{message}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-white flex">
        <input ref={messageRef} className="flex-1 border-4 p-4" type="text" />
        <button onClick={sendMessage} className="bg-purple-500 text-white p-4">
          Send Message
        </button>
      </div>
    </div>
  );
}
