import express from "express";
import { SERVICE_ENDPOINTS } from "./types/route";
import {
  JOB_MANAGER_ENDPOINT,
  URL_SERVICE_ENDPOINT,
  USER_SERVICE_ENDPOINT,
} from "./config";

const app = express();

app.use("*", async (request, response) => {
  const url = request.originalUrl;
  const method = request.method;

  let targetUrl;

  if (url === SERVICE_ENDPOINTS.USER_SERVICE) {
    targetUrl = USER_SERVICE_ENDPOINT + url;
  } else if (url === SERVICE_ENDPOINTS.URL_SERVICE) {
    targetUrl = URL_SERVICE_ENDPOINT + url;
  } else if (url === SERVICE_ENDPOINTS.JOB_MANAGER) {
    targetUrl = JOB_MANAGER_ENDPOINT + url;
  } else {
    response.sendStatus(400);
    return;
  }

  try {
    const res = await fetch(targetUrl, {
      method: method,
      headers: request.headers as HeadersInit,
      body: method !== "GET" ? JSON.stringify(request.body) : undefined,
    });

    const resBody = await res.json();

    response.status(res.status).send(resBody);
  } catch (error) {
    console.log(error);
    response.sendStatus(500);
  }
});

app.listen(3000, "0.0.0.0", () => console.log("Gateway listening..."));
