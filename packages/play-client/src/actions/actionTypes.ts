export enum ActionTypes {
  COORD_UPDATE,
  CLEAR_ALL,
  CLICK_CELL,
  COORDS_SENT,
}

export interface Action<T extends ActionTypes> {
  type: T;
}

export interface ActionPayload<T extends ActionTypes, P> extends Action<T> {
  payload: P;
}
