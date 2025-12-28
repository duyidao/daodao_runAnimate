export enum PromiseStatus {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export interface TaskState {
  id: number;
  status: PromiseStatus;
  result: any | null;
  isStale: boolean;
}

export interface Step {
  id: number;
  highlightLines: number[];
  description: string;
  actionTitle: string;
  cancelVariableStatus?: "initial" | "set-for-1" | "set-for-2";
  tasks: TaskState[];
  terminalOutput: string[];
  // Vue specific or generic metadata for visualization
  metadata?: any;
}

export interface Scenario {
  id: string;
  name: string;
  code: string;
  steps: Step[];
}

export interface Category {
  id: string;
  name: string;
  scenarios: Scenario[];
}
