export interface Step {
  line: number;
  description: string;
}

export interface Scenario {
  id: string;
  name: string;
  code: string;
  steps: Step[];
  path: string;
  description: string;
  tag: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  scenarios: Scenario[];
}
