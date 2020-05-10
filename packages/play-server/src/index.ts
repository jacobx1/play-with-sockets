import express from "express";
import expressWs from "express-ws";
import https from "https";
import fs from "fs";
import path from "path";
import helmet from "helmet";

const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      connectSrc: ["'self'"],
    },
  })
);

const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "../private.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../localhost.pem")),
    passphrase: "password here",
  },
  app
);

const appWs = expressWs(app, server);

import routes from "./routes";
app.use(routes);

server.listen(8080, () => {
  console.log("started");
});
