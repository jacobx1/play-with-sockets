import { StateRecordType } from "../data/StateRecord";

export const localCellValues = (state: StateRecordType) =>
  state.localCellValues;

export const cellValuesSelector = (state: StateRecordType) =>
  state.cellValues.merge(localCellValues(state));
