import React, { useCallback, useEffect, useState } from "react";
import {useSocket} from "../contexts/SocketProvider"
import { useNavigate } from "react-router-dom";

function Lobby() {
  const [email, setemail] = useState("");
  const [room, setroom] = useState("");
    
  const socket=useSocket();
  const navigate=useNavigate();

  const HandleJoinRoom=useCallback((data)=>{
    const {email,room}=data;
    navigate(`/room/${room}`)
  },[navigate]);

  useEffect(()=>{
    socket.on("room:join",HandleJoinRoom)
    return ()=>{
      socket.off("room:join")
    }
  },[])

  const HandleSubmit=useCallback((e)=>{
    e.preventDefault();
    socket.emit("room:join",{email,room})
  },[email,room,socket])
  return (
    <div>
        <h1>Lobby</h1>
      <form onSubmit={HandleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        <br />
        <label htmlFor="room">Room:</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setroom(e.target.value)}
        />
        <br />
        <button>Join</button>
      </form>
    </div>
  );
}

export default Lobby;
