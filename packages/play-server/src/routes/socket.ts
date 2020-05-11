import express from "express";
import { Map } from "immutable";
import ws from "ws";

const router = express.Router();

let coords = Map<string, number>();
let connectedClients = Map<ws, typeof coords>();

const sendActionCreator = (ws: ws) => (action: any) => {
  ws.send(JSON.stringify(action));
};

router.ws("/", (ws, req) => {
  connectedClients = connectedClients.set(ws, Map());
  ws.on("message", (msg) => {
    const msgObj = JSON.parse(msg as string);
    const sendAction = sendActionCreator(ws);

    if (msgObj.type === "COORD_UPDATE") {
      coords = coords.merge(msgObj.payload);

      let updated = connectedClients;
      connectedClients.entrySeq().forEach((valuePack) => {
        const [client, lastSentValues] = valuePack;
        const patchedCoords = {};
        coords
          .entrySeq()
          .filter(([key, value]) => {
            const lastVal = lastSentValues.get(key);
            return lastVal !== value;
          })
          .forEach((valuePack) => {
            patchedCoords[valuePack[0]] = valuePack[1];
          });
        sendActionCreator(client)({
          type: "COORD_UPDATE",
          payload: patchedCoords,
        });

        updated = updated.set(client, coords);
      });
      connectedClients = updated;
    } else if (msgObj.type === "COORDS_GET") {
      sendAction({
        type: "COORD_UPDATE",
        payload: coords.toJS(),
      });
    }
  });
  ws.on("close", () => {
    connectedClients = connectedClients.remove(ws);
  });
});

export default router;
