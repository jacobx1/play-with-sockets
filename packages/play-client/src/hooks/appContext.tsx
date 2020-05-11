import React, {
  createContext,
  useContext,
  useCallback,
  useReducer,
} from "react";
import { CoordAction } from "../actions/coordActions";
import { StateRecord, StateRecordType } from "../data/StateRecord";
import appStateReducer from "../reducers/appStateReducer";

const initialState = StateRecord();

interface AppContextProps {
  state: StateRecordType;
  dispatch: React.Dispatch<CoordAction>;
}

const AppContext = createContext<AppContextProps>({
  state: null,
  dispatch: null,
});

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
  const [state, dispatch] = useReducer(appStateReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
