declare class State {
    constructor(name: string, parentState?: string, startState?: string);
    handle(event: number, payload?: any): boolean;
    addChildren(...stateNames: Array<string>): void;
    emit(event: number, payload?: any): void;
    transition(to: string): void;
    equals(state: State | string): boolean;
    hasChildren(): boolean;
    isParent(state: State): boolean;
    isAncestor(state: State): boolean;
    isChild(state: State): boolean;
    isSibling(state: State): boolean;
    isDescendant(state: State): boolean;
    setStateMachine(stateMachine: StateMachine): void;
}

declare class StateMachine {
    constructor(queueCapacity?: number, topState?: State, topStartState?: string);
    registerStates(...states: Array<State>): void;
    registerEvents(...events: Array<number>): void;
    registerStateMachines(...stateMachines: Array<StateMachine>): void;
    initialize(): void;
    reset(): void;
    handle(event: number, payload?: any): void;
    transition(to: string): void;
}

declare var ENTER: number;
declare var EXIT: number;

declare var TOP_STATE_NAME: string;