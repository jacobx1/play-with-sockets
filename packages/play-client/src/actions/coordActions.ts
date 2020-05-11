import { ActionTypes, ActionPayload, Action } from "./actionTypes";
import { Map } from "immutable";

type ClearAllAction = Action<ActionTypes.CLEAR_ALL>;
export const clearAll = (): ClearAllAction => ({
  type: ActionTypes.CLEAR_ALL,
});

type ClickCellAction = ActionPayload<
  ActionTypes.CLICK_CELL,
  { x: number; y: number }
>;
export const clickCell = (x: number, y: number): ClickCellAction => ({
  type: ActionTypes.CLICK_CELL,
  payload: {
    x,
    y,
  },
});

type CoordsType = {
  [key: string]: number;
};
type CoordUpdateAction = ActionPayload<ActionTypes.COORD_UPDATE, CoordsType>;
export const coordUpdate = (coords: CoordsType): CoordUpdateAction => ({
  type: ActionTypes.COORD_UPDATE,
  payload: coords,
});

type CoordsSentAction = ActionPayload<
  ActionTypes.COORDS_SENT,
  Map<string, number>
>;
export const coordsSent = (coords: Map<string, number>): CoordsSentAction => ({
  type: ActionTypes.COORDS_SENT,
  payload: coords,
});

export type CoordAction =
  | ClearAllAction
  | ClickCellAction
  | CoordUpdateAction
  | CoordsSentAction;
