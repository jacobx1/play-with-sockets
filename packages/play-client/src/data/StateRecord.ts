import { Record, Map } from "immutable";

interface AppState {
  cellValues: Map<string, number>;
  localCellValues: Map<string, number>;
  lastCoordsSent: Map<string, number>;
  localUpdates: number;
}

export const StateRecord = Record<AppState>(
  {
    cellValues: Map(),
    localCellValues: Map(),
    lastCoordsSent: Map(),
    localUpdates: 0,
  },
  "StateRecord"
);

export type StateRecordType = ReturnType<typeof StateRecord>;
