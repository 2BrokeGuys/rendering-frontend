import express from "express";
import amqp from "amqplib";

const app = express();

app.post("/job", async (request, response) => {
  const connection = await amqp.connect("http://localhost:5672");
  const channel = await connection.createChannel();
  const queue = "jobs";

  channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(request.body)), {
    persistent: true,
  });

  response.status(201).send({ message: "Job sent to the queue" });
});

app.listen(3000, "0.0.0.0", () => console.log("Job Manager listening..."));
