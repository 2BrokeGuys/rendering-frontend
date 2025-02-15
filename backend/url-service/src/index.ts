import express from "express"
import router from "./routes";

const app = express();

app.use(express.json())

app.use("/url", router)

app.listen(3000, "0.0.0.0", () => {console.log("URL Service is listening...")})