import type { Step } from "@/types/step";

export interface MapEntryState {
  resolveQueue: string[]; // IDs of callers waiting for success
  rejectQueue: string[]; // IDs of callers waiting for failure
  isPending: boolean;
  key: string;
}

export interface SimulationState {
  callers: {
    id: string;
    status: "idle" | "pending" | "resolved" | "rejected";
    result?: any;
  }[];
  map: Record<string, MapEntryState | null>;
  apiStatus: "idle" | "fetching" | "success" | "error";
  highlightedLine: number;
  description: string;
}

export interface AnimationStep extends Step {
  state: SimulationState;
}
