import { useState, useContext, useEffect } from "react";
import { useThrottle } from "react-use";
import { useSelector, useAction } from "./appContext";
import { coordUpdate } from "../actions/coordActions";

const sendAction = (ws: WebSocket, action: any) => {
  ws.send(JSON.stringify(action));
};

export const useServerCommunication = () => {
  const [socket, setSocket] = useState<WebSocket>();

  const localUpdates = useSelector((state) => state.localUpdates);
  const cellValues = useSelector((state) => state.cellValues);

  const coordUpdateAction = useAction(coordUpdate);
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
    }
  }, [socket, throttledUpdate]);
};
