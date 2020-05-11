import { StateRecord } from "../data/StateRecord";
import { CoordAction } from "../actions/coordActions";
import { ActionTypes } from "../actions/actionTypes";
import { Map } from "immutable";

export default function appStateReducer(
  state = StateRecord(),
  action: CoordAction
) {
  switch (action.type) {
    case ActionTypes.COORD_UPDATE:
      return state
        .mergeIn(["cellValues"], action.payload)
        .update("localCellValues", (value) =>
          value.removeAll(state.lastCoordsSent.keySeq())
        );
    case ActionTypes.CLEAR_ALL:
      return state
        .set(
          "localCellValues",
          Map(state.cellValues.keySeq().map((key) => [key, 0]))
        )
        .update("localUpdates", (val) => val + 1);
    case ActionTypes.CLICK_CELL:
      return state
        .updateIn(
          ["localCellValues", `${action.payload.x},${action.payload.y}`],
          (val) => (val === 1 ? 0 : 1)
        )
        .update("localUpdates", (val) => val + 1);
    case ActionTypes.COORDS_SENT:
      return state.set("lastCoordsSent", action.payload);
  }
}
