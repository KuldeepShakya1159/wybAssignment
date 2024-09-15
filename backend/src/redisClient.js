const { createClient } = require("redis");
const PRIORITY_MESSAGE = "PREMIUMROOM"

class RedisSubscriptionManager {
  constructor() {
    this.subscriber = createClient({
      password: "Wf1f59bYjMQyVzJdnhYZKn9qGuzQU9oG",
      socket: {
        host: "redis-15345.c325.us-east-1-4.ec2.redns.redis-cloud.com",
        port: 15345,
      },
    });

    this.publisher = createClient({
      password: "Wf1f59bYjMQyVzJdnhYZKn9qGuzQU9oG",
      socket: {
        host: "redis-15345.c325.us-east-1-4.ec2.redns.redis-cloud.com",
        port: 15345,
      },
    });
    
    this.redisClient =createClient({
      password: "Wf1f59bYjMQyVzJdnhYZKn9qGuzQU9oG",
      socket: {
        host: "redis-15345.c325.us-east-1-4.ec2.redns.redis-cloud.com",
        port: 15345,
      },
    });

    this.subscriptions = new Map();
    this.reverseSubscriptions = new Map();

    // Connect both clients
    this.connectClients();
  }

  connectClients() {
    try {
      this.subscriber.connect();
      console.log("Redis subscriber connected");
      this.subscriber.on("error", (error) =>
        console.log("Error While Connecting to Redis Subscriber:", error)
      );
    } catch (error) {
      console.error("Error connecting subscriber:", error);
    }

    try {
      this.publisher.connect();
      console.log("Redis publisher connected");
      this.publisher.on("error", (error) =>
        console.log("Error While Connecting to Redis Publisher:", error)
      );
    } catch (error) {
      console.error("Error connecting publisher:", error);
    }
    try {
      this.redisClient.connect();
      console.log("Redis client connected");
      this.publisher.on("error", (error) =>
        console.log("Error While Connecting to Redis client:", error)
      );
    } catch (error) {
      console.error("Error connecting redis client:", error);
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RedisSubscriptionManager();
    }
    return this.instance;
  }

  subscribe(userId, room, ws) {
    this.subscriptions.set(userId, [
      ...(this.subscriptions.get(userId) || []),
      room,
    ]);

    this.reverseSubscriptions.set(room, {
      ...(this.reverseSubscriptions.get(room) || {}),
      [userId]: { userId: userId, ws },
    });
    console.log(Object.keys(this.reverseSubscriptions.get(room)) , "reverse subscription keys");
    console.log(this.reverseSubscriptions,"rever subscription map");
    console.log(this.subscriptions,"subscriptions mappp");
    let counter = 0;
    if (Object.keys(this.reverseSubscriptions.get(room) || {})?.length === 1) {
      console.log(`subscribing message from ${room}`);
      // This is the first subscriber to this room
      this.subscriber.subscribe(room, (payload) => {
        try {
          // const parsedPayload = JSON.parse(payload);
          const subscribers = this.reverseSubscriptions.get(room) || {};
          console.log("counter form inside subscribe function",counter);
          counter++;
          Object.values(subscribers).forEach(({ ws }) => ws.send(payload));
        } catch (e) {
          console.error("erroneous payload found?");
        }
      });
    }
  }

  unsubscribe(userId, room) {
    this.subscriptions.set(
        userId,
        this.subscriptions.get(userId)?.filter((x) => x !== room) || []
    );
    if (this.subscriptions.get(userId)?.length === 0) {
        this.subscriptions.delete(userId);
    }
    delete this.reverseSubscriptions.get(room)?.[userId];
    if (
        !this.reverseSubscriptions.get(room) ||
        Object.keys(this.reverseSubscriptions.get(room) || {}).length === 0
    ) {
        console.log("unsubscribing from " + room);
        this.subscriber.unsubscribe(room);
        this.reverseSubscriptions.delete(room);
    }
}

  async addChatMessage(room, message) {
    this.publish(room, {
      type: "message",
      payload: {
        message,
      },
    });
  }

  publish(room, message) {
    console.log(`publishing message to ${room} with message :`,message);
    this.publisher.publish(room, JSON.stringify(message));
  }
q
  addToPriority(payload){
    try{
      // console.log(payload);
      this.redisClient.lPush(PRIORITY_MESSAGE,JSON.stringify(payload))
    }catch(error){
      console.log(`error at addtoPremiumRoom : ${error}`)
    }
  }

  // async processPriorityQueue(){
  //   try{
  //     while(true){
  //       const payload =await this.redisClient.brPop(PRIORITY_MESSAGE,0);
  //       console.log(payload.element,"payload in processpriorityQueue")
  //       // const data = JSON.parse()
  //     }
  //   }catch(error){

  //   }
  // }
  
}

module.exports = RedisSubscriptionManager;
