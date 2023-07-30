const {Server, Socket} =require("socket.io");

const io=new Server(8000,{
    cors:true
});

const EmailToSocketIdMap=new Map();
const SocketIdToEmailMap=new Map();

io.on("connection",Socket =>{
    
    console.log("Connection connected",Socket.id)
    Socket.on("room:join",(data)=>{
       const { email,room }= data;
       EmailToSocketIdMap.set(email,Socket.id);
       SocketIdToEmailMap.set(Socket.id,email);
       io.to(room).emit("user:joined",{email,id:Socket.id})
       Socket.join(room);
       io.to(Socket.id).emit("room:join",data)
    });

    Socket.on("user:call",({to,offer})=>{
        io.to(to).emit("incomming:call",{from:Socket.id,offer})
    })

    Socket.on("call:accepted",({to,ans})=>{
        io.to(to).emit("call:accepted",{from:Socket.id,ans})
    })

    Socket.on("peer:nego:needed",({to,offer})=>{
        io.to(to).emit("peer:nego:needed",{from:Socket.id,offer})
    })
    
    Socket.on("peer:nego:done",({to,ans})=>{
        io.to(to).emit("peer:nego:final",{from:Socket.id,ans})
    })

    
})