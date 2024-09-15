const { createClient } = require("redis");
const RedisSubscriptionManager = require("./redisClient");
const PRIORITY_MESSAGE = "PREMIUMROOM";

const RedisClient = createClient({
  password: "Wf1f59bYjMQyVzJdnhYZKn9qGuzQU9oG",
  socket: {
    host: "redis-15345.c325.us-east-1-4.ec2.redns.redis-cloud.com",
    port: 15345,
  },
});

async function processPriorityQueue() {
  try {
    RedisClient.connect();
    console.log("connected to redisClient for processPriorrityQueue");
    while (true) {
      const data = await RedisClient.brPop(PRIORITY_MESSAGE, 0);
      const parsedData = JSON.parse(data.element);
      RedisSubscriptionManager.getInstance().addChatMessage(parsedData.room,parsedData.message)
    }
  } catch (error) {
    console.log(`Error from processPriorityQueue : ${error}`);
  }
}
processPriorityQueue();
