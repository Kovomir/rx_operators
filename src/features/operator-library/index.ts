import {
  FILTER_OPERATOR_LIBRARY_ENTRY,
  type FilterOperatorLibraryEntry,
} from "./filter";
import { MAP_OPERATOR_LIBRARY_ENTRY, type MapOperatorLibraryEntry } from "./map";
import { SKIP_OPERATOR_LIBRARY_ENTRY, type SkipOperatorLibraryEntry } from "./skip";

export type OperatorLibraryEntry =
  | MapOperatorLibraryEntry
  | FilterOperatorLibraryEntry
  | SkipOperatorLibraryEntry;

export const OPERATOR_LIBRARY = [
  MAP_OPERATOR_LIBRARY_ENTRY,
  FILTER_OPERATOR_LIBRARY_ENTRY,
  SKIP_OPERATOR_LIBRARY_ENTRY,
] satisfies OperatorLibraryEntry[];

export { FILTER_OPERATOR_LIBRARY_ENTRY } from "./filter";
export type {
  FilterOperatorLibraryEntry,
  FilterOperatorResourceLink,
} from "./filter";
export { MAP_OPERATOR_LIBRARY_ENTRY } from "./map";
export type { MapOperatorLibraryEntry, MapOperatorResourceLink } from "./map";
export { SKIP_OPERATOR_LIBRARY_ENTRY } from "./skip";
export type {
  SkipOperatorLibraryEntry,
  SkipOperatorResourceLink,
} from "./skip";
