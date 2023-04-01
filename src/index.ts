import express, { Express, Request, Response, json } from "express";
import "reflect-metadata";
import { config } from "./config";
import { MongoClient } from "mongodb";
import { AuthRouter } from "./routes/AuthRouter";

const app = express();
app.use(json());

const client = new MongoClient(config.DB_URI);

async function main() {
  await client.connect();

  app.use("/auth", AuthRouter(client.db("products")));





  app.listen(config.PORT, () => {
    console.log(
      `⚡️[server]: Server is running at http://localhost:${config.PORT}`
    );
  });
}

main();
