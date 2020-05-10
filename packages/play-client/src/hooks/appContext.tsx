import React, {
  createContext,
  useContext,
  useCallback,
  useReducer,
} from "react";
import { Map, Record } from "immutable";
import { ActionTypes } from "../actions/actionTypes";
import { CoordAction } from "../actions/coordActions";

interface AppState {
  cellValues: Map<string, number>;
  localUpdates: number;
}

const StateRecord = Record<AppState>(
  {
    cellValues: Map(),
    localUpdates: 0,
  },
  "StateRecord"
);

const initialState = StateRecord();

type StateRecordType = typeof initialState;

interface AppContextProps {
  state: StateRecordType;
  dispatch: React.Dispatch<CoordAction>;
}

const AppContext = createContext<AppContextProps>({
  state: null,
  dispatch: null,
});

const reducer = (state = StateRecord(), action: CoordAction) => {
  switch (action.type) {
    case ActionTypes.COORD_UPDATE:
      return state.mergeIn(["cellValues"], action.payload);
    case ActionTypes.CLEAR_ALL:
      return state
        .update("cellValues", (value) =>
          Map(value.keySeq().map((key) => [key, 0]))
        )
        .update("localUpdates", (val) => val + 1);
    case ActionTypes.CLICK_CELL:
      return state
        .updateIn(
          ["cellValues", `${action.payload.x},${action.payload.y}`],
          (val) => (val === 1 ? 0 : 1)
        )
        .update("localUpdates", (val) => val + 1);
  }
};

export const useSelector = <T,>(selector: (state: StateRecordType) => T) => {
  const { state } = useContext(AppContext);
  return selector(state);
};

export const useAction = <A extends any[], R extends CoordAction>(
  action: (...args: A) => R
) => {
  const { dispatch } = useContext(AppContext);
  const actionCallback = useCallback(
    (...args: A) => dispatch(action(...args)),
    [action, dispatch]
  );
  return actionCallback;
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
