import type { Step } from "@/types/step";

export interface SimulationState {
  callers: {
    id: string;
    status: "idle" | "pending" | "resolved" | "rejected";
    result?: any;
  }[];
  map: Record<string, any>;
  apiStatus: "idle" | "fetching" | "success" | "error";
  highlightedLine: number;
  description: string;
}

export interface AnimationStep extends Step {
  state: SimulationState;
}
