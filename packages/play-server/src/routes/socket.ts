import express from "express";
import { Map } from "immutable";
import ws from "ws";

const router = express.Router();

let coords = Map();
let connectedClients = new Set<ws>();

const sendActionCreator = (ws: ws) => (action: any) => {
  ws.send(JSON.stringify(action));
};

router.ws("/", (ws, req) => {
  connectedClients.add(ws);
  ws.on("message", (msg) => {
    const msgObj = JSON.parse(msg as string);
    const sendAction = sendActionCreator(ws);

    if (msgObj.type === "COORD_UPDATE") {
      coords = coords.merge(msgObj.payload);

      connectedClients.forEach((client) => {
        sendActionCreator(client)({
          type: "COORD_UPDATE",
          payload: coords.toJS(),
        });
      });
    } else if (msgObj.type === "COORDS_GET") {
      sendAction({
        type: "COORD_UPDATE",
        payload: coords.toJS(),
      });
    }
  });
  ws.on("close", () => {
    connectedClients.delete(ws);
  });
});

export default router;
