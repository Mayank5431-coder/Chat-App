import  {WebSocketServer,WebSocket} from 'ws';

const wss = new WebSocketServer({port : 8080});

interface User{
  socket : WebSocket,
  room : string
}

/*
{
  "type": "xyz",
  "payload": {
    "xyz" : "123@"
  }
}
*/

let numberofconnections = 0;
let allSockets: User[] = [];

wss.on("connection",(socket)=>{
  socket.on("message",(event)=>{
    const Parsed_message = JSON.parse(event as unknown as string);
    if(Parsed_message.type === "join"){
      allSockets.push({
        socket,
        room: Parsed_message.payload.roomId 
      })
    }
    if(Parsed_message.type === "chat"){
      const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room;
      for(let i=0 ; i<allSockets.length ; i++){
        if(allSockets[i].room == currentUserRoom){
          allSockets[i].socket.send(Parsed_message.payload.message)
        }
      }
    }
    socket.on("close", () => {
      console.log("Client disconnected");
      allSockets = allSockets.filter((user) => user.socket !== socket); // Remove the disconnected socket
    });
  })
  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
})