import { useLayoutEffect } from "react";

export const useDrawBehavior = (
  elementRef: React.RefObject<HTMLElement>,
  onDrawPixel: (x: number, y: number) => void
) => {
  useLayoutEffect(() => {
    const getCoords = (e: MouseEvent) => {
      const boundingBox = elementRef.current.getBoundingClientRect();
      const currX = e.clientX - boundingBox.left;
      const currY = e.clientY - boundingBox.top;
      return [currX, currY];
    };
    let drawing = false;
    const drawPixel = (e: MouseEvent) => {
      if (!drawing) {
        return;
      }

      const [x, y] = getCoords(e);
      onDrawPixel(x, y);
    };

    elementRef.current.addEventListener("mousedown", (e) => {
      drawing = true;
      drawPixel(e);
    });
    elementRef.current.addEventListener("mousemove", (e) => {
      drawPixel(e);
    });
    elementRef.current.addEventListener("mouseup", (e) => {
      drawing = false;
    });
    elementRef.current.addEventListener("mouseout", (e) => {
      drawing = false;
    });
  }, []);
};
