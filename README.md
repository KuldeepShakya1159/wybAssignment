### connection throtlling and rate limiting ###
Implementation: A map is used to store the IP address of each client. Once the connection limit exceeds for any client, the WebSocket connection is automatically closed. This helps prevent abuse or overuse of server resources.

### Session Management and State Sharing ###
Implementation: Redis Pub/Sub is utilized for session management. This external system allows multiple WebSocket servers to communicate with each other and manage the state, offloading the task from the backend and improving scalability.

### Optimizing Heartbeat Intervals ###
Implementation: The heartbeat interval dynamically changes based on the server load. When the number of clients increases, the server adjusts the frequency of heartbeat messages to optimize performance.

### Message Priority ###
Implementation: A Redis queue is used to handle message prioritization. Messages are pushed into the queue using LPUSH and processed using BRPOP, ensuring that high-priority messages are handled first.

### HealthCheck EndPoint ###
``` /healthCheck ```
An HTTP endpoint that provides a health check of active connections.

Implementation: A map is used to track the number of active WebSocket connections. The /healthCheck endpoint returns this information, providing an easy way to monitor the health and load of the WebSocket serve

### How to Setup ###

Clone this Repiostory 
```git clone <repo url>```
```once cloned move to client and backend folder and run the following commands```
```cd client npm install```
```cd backend npm install```
```to run client - > npm start```
```to run backend - > npm start```



