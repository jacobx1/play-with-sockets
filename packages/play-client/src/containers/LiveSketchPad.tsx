import React, { useEffect, useRef, useLayoutEffect } from "react";
import { useAction, useSelector } from "../hooks/appContext";
import { clickCell, clearAll } from "../actions/coordActions";
import { useServerCommunication } from "../hooks/serviceHooks";
import { useDrawBehavior } from "../hooks/drawInteractionHooks";
import { Map } from "immutable";

const use2dContext = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const ctx = useRef<CanvasRenderingContext2D>();
  useLayoutEffect(() => {
    ctx.current = canvasRef.current.getContext("2d");
  }, []);
  return ctx;
};

const useDrawContextUpdate = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  cellValues: Map<string, number>,
  watchForForceUpdate = []
) => {
  const ctx = use2dContext(canvasRef);
  useEffect(() => {
    ctx.current.fillStyle = "black";
    ctx.current.fillRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    cellValues.entrySeq().forEach((entry) => {
      const [key, value] = entry;
      if (value !== 1) {
        return;
      }
      const [xStr, yStr] = key.split(",");
      ctx.current.beginPath();
      ctx.current.fillStyle = "green";
      ctx.current.fillRect(+xStr, +yStr, 10, 10);
      ctx.current.closePath();
    });
  }, [cellValues, ...watchForForceUpdate]);
};

const LiveSketchPad = () => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const cellValues = useSelector((state) => state.cellValues);
  const localUpdates = useSelector((state) => state.localUpdates);

  const onDrawPixel = useAction(clickCell);
  const onClear = useAction(clearAll);

  useDrawBehavior(canvasRef, onDrawPixel);
  useDrawContextUpdate(canvasRef, cellValues, [localUpdates]);
  useServerCommunication();

  return (
    <>
      <canvas height="480" width="640" ref={canvasRef} />
      <div>
        <button onClick={onClear}>Clear</button>
      </div>
    </>
  );
};

export default LiveSketchPad;
