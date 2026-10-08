import {
  FILTER_OPERATOR_LIBRARY_ENTRY,
  type FilterOperatorLibraryEntry,
} from "./filter";
import {
  DISTINCT_UNTIL_CHANGED_OPERATOR_LIBRARY_ENTRY,
  type DistinctUntilChangedOperatorLibraryEntry,
} from "./distinct-until-changed";
import {
  DEBOUNCE_TIME_OPERATOR_LIBRARY_ENTRY,
  type DebounceTimeOperatorLibraryEntry,
} from "./debounce-time";
import {
  DELAY_OPERATOR_LIBRARY_ENTRY,
  type DelayOperatorLibraryEntry,
} from "./delay";
import { MAP_OPERATOR_LIBRARY_ENTRY, type MapOperatorLibraryEntry } from "./map";
import { SCAN_OPERATOR_LIBRARY_ENTRY, type ScanOperatorLibraryEntry } from "./scan";
import { SKIP_OPERATOR_LIBRARY_ENTRY, type SkipOperatorLibraryEntry } from "./skip";
import {
  START_WITH_OPERATOR_LIBRARY_ENTRY,
  type StartWithOperatorLibraryEntry,
} from "./start-with";
import { TAP_OPERATOR_LIBRARY_ENTRY, type TapOperatorLibraryEntry } from "./tap";
import { TAKE_OPERATOR_LIBRARY_ENTRY, type TakeOperatorLibraryEntry } from "./take";

export type OperatorLibraryEntry =
  | MapOperatorLibraryEntry
  | FilterOperatorLibraryEntry
  | SkipOperatorLibraryEntry
  | TakeOperatorLibraryEntry
  | DistinctUntilChangedOperatorLibraryEntry
  | TapOperatorLibraryEntry
  | StartWithOperatorLibraryEntry
  | ScanOperatorLibraryEntry
  | DebounceTimeOperatorLibraryEntry
  | DelayOperatorLibraryEntry;

export const OPERATOR_LIBRARY = [
  MAP_OPERATOR_LIBRARY_ENTRY,
  FILTER_OPERATOR_LIBRARY_ENTRY,
  SKIP_OPERATOR_LIBRARY_ENTRY,
  TAKE_OPERATOR_LIBRARY_ENTRY,
  DISTINCT_UNTIL_CHANGED_OPERATOR_LIBRARY_ENTRY,
  TAP_OPERATOR_LIBRARY_ENTRY,
  START_WITH_OPERATOR_LIBRARY_ENTRY,
  SCAN_OPERATOR_LIBRARY_ENTRY,
  DEBOUNCE_TIME_OPERATOR_LIBRARY_ENTRY,
  DELAY_OPERATOR_LIBRARY_ENTRY,
] satisfies OperatorLibraryEntry[];

export {
  DEBOUNCE_TIME_DEMO_DURATION_MS,
  DEBOUNCE_TIME_OPERATOR_LIBRARY_ENTRY,
} from "./debounce-time";
export type {
  DebounceTimeOperatorLibraryEntry,
  DebounceTimeOperatorResourceLink,
} from "./debounce-time";
export { DELAY_OPERATOR_LIBRARY_ENTRY } from "./delay";
export type {
  DelayOperatorLibraryEntry,
  DelayOperatorResourceLink,
} from "./delay";
export { DISTINCT_UNTIL_CHANGED_OPERATOR_LIBRARY_ENTRY } from "./distinct-until-changed";
export type {
  DistinctUntilChangedOperatorLibraryEntry,
  DistinctUntilChangedOperatorResourceLink,
} from "./distinct-until-changed";
export { FILTER_OPERATOR_LIBRARY_ENTRY } from "./filter";
export type {
  FilterOperatorLibraryEntry,
  FilterOperatorResourceLink,
} from "./filter";
export { MAP_OPERATOR_LIBRARY_ENTRY } from "./map";
export type { MapOperatorLibraryEntry, MapOperatorResourceLink } from "./map";
export { SCAN_OPERATOR_LIBRARY_ENTRY } from "./scan";
export type { ScanOperatorLibraryEntry, ScanOperatorResourceLink } from "./scan";
export { SKIP_OPERATOR_LIBRARY_ENTRY } from "./skip";
export type {
  SkipOperatorLibraryEntry,
  SkipOperatorResourceLink,
} from "./skip";
export { START_WITH_OPERATOR_LIBRARY_ENTRY } from "./start-with";
export type {
  StartWithOperatorLibraryEntry,
  StartWithOperatorResourceLink,
} from "./start-with";
export { TAP_OPERATOR_LIBRARY_ENTRY } from "./tap";
export type { TapOperatorLibraryEntry, TapOperatorResourceLink } from "./tap";
export { TAKE_OPERATOR_LIBRARY_ENTRY } from "./take";
export type {
  TakeOperatorLibraryEntry,
  TakeOperatorResourceLink,
} from "./take";
