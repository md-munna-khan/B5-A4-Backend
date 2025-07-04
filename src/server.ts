import { Server } from "http";
import mongoose from "mongoose";
import config from "./config";
import app from "./app";

let server: Server;

const port = 5000;

async function main() {
  try {
    mongoose.connect(config.database_url!);

     server = app.listen(port, () => {
    console.log(` app listening on port ${port}`);
  });
  } catch (error) {
    console.log(error);
  }
}
main()