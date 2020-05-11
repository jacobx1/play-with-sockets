import { useState, useEffect } from "react";
import { useThrottle } from "react-use";
import { useSelector, useAction } from "./appContext";
import { coordUpdate, coordsSent } from "../actions/coordActions";
import { localCellValues } from "../selectors/coordSelectors";

const sendAction = (ws: WebSocket, action: any) => {
  ws.send(JSON.stringify(action));
};

export const useServerCommunication = () => {
  const [socket, setSocket] = useState<WebSocket>();

  const localUpdates = useSelector((state) => state.localUpdates);
  const cellValues = useSelector(localCellValues);

  const coordUpdateAction = useAction(coordUpdate);
  const coordsSentAction = useAction(coordsSent);
  const throttledUpdate = useThrottle(localUpdates, 200);
  useEffect(() => {
    const ws = new WebSocket("wss://localhost:8080/socket");
    ws.onopen = () => {
      sendAction(ws, {
        type: "COORDS_GET",
      });
    };
    ws.onmessage = (ev) => {
      const msgObj = JSON.parse(ev.data);
      if (msgObj.type === "COORD_UPDATE") {
        coordUpdateAction(msgObj.payload);
      }
    };
    setSocket(ws);
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        type: "COORD_UPDATE",
        payload: cellValues.toJS(),
      };
      socket.send(JSON.stringify(message));
      coordsSentAction(cellValues);
    }
  }, [socket, throttledUpdate]);
};
