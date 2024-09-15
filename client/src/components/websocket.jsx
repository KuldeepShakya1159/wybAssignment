import React, { useEffect, useState } from "react";
import "./websocket.css"
const WebSocketConnection = () => {
  const [ws, setws] = useState(null);
  const [message, setMessage] = useState("");
  let [optionValue, setOptionValue] = useState("");
  const [roomId, setRoomId] = useState("");
  const[serverMessage,setServerMessage] = useState("");
  const[wsStatus,setWsStatus] = useState(false);
  const[urgency,setUrgency] = useState(false);

  useEffect(() => {
    const wss = new WebSocket("ws://localhost:8080");
    wss.onopen = () => {
      setWsStatus(false);
      console.log("WebSocket connection established");
    };

    setws(wss);
    wss.onmessage = (event) => {
      setWsStatus(false)
        const data = JSON.parse(event.data);
        console.log(data)
        setServerMessage((prevmessage)=>[...prevmessage,data]);

        if(data.type==="message"){
          setServerMessage(data.payload.message);
        }
      };

      wss.onclose=()=>{
        setWsStatus(true)
        console.log(`websocket connection closed`)
      }

      wss.onerror = (error)=>{
        console.log(`Error in ws : ${error}`)
      }
      
  }, []);

  

  const handleClickEvent = () => {
    optionValue = !optionValue ? "join" : optionValue;
    console.log(roomId);

    ws.send(
      JSON.stringify({
        type: optionValue,
        payload: {
          message: message,
          roomId: roomId,
          urgent:urgency
        },
      })
    );
  };

  return (
    <div className="container">
      <h2> Welcome to Scalable WebSocket Architecture</h2>
    <div className="inputcontrols">

      <span>Enter your message</span>
      <input
        type="message"
        value={message}
        placeholder="Enter your message here"
        onChange={(e) => setMessage(e.target.value)}
      />
      <span>Select Room</span>
      <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
        <option value={"Room1"}>Room1</option>
        <option value={"Room2"}>Room2</option>
        <option value={"Room3"}>Room3</option>
      </select>

      <span>Join/Message</span>
      <select
        value={optionValue}
        onChange={(e) => setOptionValue(e.target.value)}
      >
        <option value={"join"}>Join</option>
        <option value={"message"}>Message</option>
      </select>
      <span>Select Urgency</span>
      <select
        value={urgency}
        onChange={(e) => setUrgency(e.target.value)}
      >
        <option value={false}>false</option>
        <option value={true}>true</option>
      </select>
      <input type="button" onClick={handleClickEvent} value={"send"} />
      </div>
      <div className="div">
        {wsStatus?<div>WEBSOCKET STATUS : WS Disconnected </div>:<div>WEBSOCKET STATUS : WS Connected</div>}
      </div>

      <div className="howitworks">
        <h3>How it works</h3>
        <div>1.Select room to join</div>
        <div>2.Select message option to send</div>
        <div>3.Select urgency option to true if its urgent</div>
      </div>
      <h2>
        SERVER MESSAGES
      </h2>
      <div className="servermessage">{serverMessage}</div>
    </div>
  );
};

export default WebSocketConnection;
