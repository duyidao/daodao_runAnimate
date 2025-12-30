import { Step } from './step'

export enum NodeType {
  REF = 'REF',
  EFFECT = 'EFFECT',
  LINK = 'LINK'
}

export interface Link {
  id: string;
  depId: string; // Points to Ref (Dependency)
  subId: string; // Points to Effect (Subscriber)
  nextDepId?: string;
  prevDepId?: string;
  nextSubId?: string;
  prevSubId?: string;
}

export interface RefNode {
  id: string;
  name: string;
  value: any;
  subsHeadId?: string; // Head of subscribers link list
  subsTailId?: string; // Tail of subscribers link list
}

export interface EffectNode {
  id: string;
  name: string;
  depsHeadId?: string; // Head of dependencies link list
  depsTailId?: string | 'undefined'; // Tail of dependencies link list
  active?: boolean;
}

export interface SimulationState {
  refs: Record<string, RefNode>;
  effects: Record<string, EffectNode>;
  links: Record<string, Link>;
  activeSubId?: string;
  highlightedLine: number;
  description: string;
  operationType: string;
}

export interface AnimationStep extends Step {
  operationType: string;
  state: SimulationState;
}
