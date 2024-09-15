const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {WebSocketServer} = require('ws');
const RedisSubscritionManager = require('./redisClient');
// const {subscribe} = require("./redis.js");
require('./messageQueue');
const connections = new Map();
const MAX_CONNECTIONS_LIMIT = 10;

app.get('/healthCheck',(req,res)=>{
    const totalWsConnections = connections.size;
    console.log(totalWsConnections);
    res.send(totalWsConnections.toString());
})

const wss = new WebSocketServer({server});
const users = {}

let counter = 0; 
wss.on("connection",async(ws,req)=>{
    console.log("someone Connected...");
    const ip = req.socket.remoteAddress;
    if(connections.has(ip)){
        const currentConnections = connections.get(ip);
        if(currentConnections>MAX_CONNECTIONS_LIMIT){
            ws.send(JSON.stringify("Connections Limit Exceeded.."))
            ws.close(1008,"Too Many connections");
            return
        }
        connections.set(ip,connections.get(ip)+1)
    }else{
        connections.set(ip,1);
    }
    const id = counter++;
    console.log(id);
    ws.on("message",(message)=>{
        const data = JSON.parse(message.toString());
        console.log(typeof(data.payload.roomId));
        if(data.type==="join"){
            console.log("user joind room : ",data.payload.roomId);
            users[id]={
                room:data.payload.roomId,
                ws
            }
            
            RedisSubscritionManager.getInstance().subscribe(id.toString(),data.payload.roomId,ws)

        }

        if(data.type==="message"){
            const roomid = users[id].room.toString();
            const message = data.payload.message;
            const isUrgent = data.payload.urgent
            if(isUrgent){
                RedisSubscritionManager.getInstance().addToPriority({room:data.payload.roomId,message:message});
            }
            
            RedisSubscritionManager.getInstance().publish(roomid,message);     
        }
    })  
    ws.on("disconnect", () => {
        RedisSubscritionManager.getInstance().unsubscribe(wsId.toString(), users[wsId].room);
    })  
})

server.listen(8080,(err)=>{
    if(err){
        console.log(` Error while starting server at 8080`);
    }else{
        console.log(` server started at port 8080`)
    }
    
});