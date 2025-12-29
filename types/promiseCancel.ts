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
