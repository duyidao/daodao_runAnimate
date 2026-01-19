type OperationType =
  | "INIT"
  | "HAS"
  | "GET"
  | "SET"
  | "EVICT"
  | "MOVE"
  | "CREATE"
  | "RUN"
  | "FINISH"
  | "REUSED";

export interface Step {
  highlightLines: number | number[];
  description: string;
  operation?: OperationType;
  title?: string;
}
