import * as _ from 'lodash';

// Infrasturcture events
const EXIT: number = -2;
const ENTER: number = -1;

// Name of top state.
const TOP_STATE_NAME: string = "top";

/**
 * 
 * Defines supported transition types.
 * 
 * @enum {number}
 */
enum InstructionTypes { Event, Transition }


/**
 * 
 * Defines an instruction.
 * 
 * @abstract
 * @class Instruction
 */
abstract class Instruction {
    /**
     * Creates an instance of Instruction.
     * 
     * @param {InstructionTypes} type Specifies instruction type (i.e. Event or Transition)
     * 
     * @memberOf Instruction
     */
    protected constructor(public type: InstructionTypes) { }
}

/**
 *  
 * Defines an event instruction.
 * 
 * @class Event
 * @extends {Instruction}
 */
class Event extends Instruction {
    /**
     * Creates an instance of Event.
     * 
     * @param {number} id
     * @param {*} [payload]
     * 
     * @memberOf Event
     */
    constructor(public id: number, public payload?: any) {
        super(InstructionTypes.Event);
    }

    /**
     * 
     * Determines whether an event is an infrastructure (or reserved) event.
     * 
     * @static
     * @param {number} id Specifies event ID.
     * @returns Indicates wehtehr an event is an infrastructure event.
     * 
     * @memberOf Event
     */
    static isInfrastructureEvent(id: number) {
        return id === ENTER || id === EXIT;
    }
}

/**
 * 
 * Defines a transition instruction.
 * 
 * @class Transition
 * @extends {Instruction}
 */
class Transition extends Instruction {
    /**
     * Creates an instance of Transition.
     * 
     * @param {string} state Specifies name of state to transition to.
     * 
     * @memberOf Transition
     */
    constructor(public state: string) {
        super(InstructionTypes.Transition);
    }
}

/**
 * Defines an interface for handling events.
 * 
 * @interface IEventHandler
 */
interface IEventHandler {
    /**
     * 
     * Handles events.
     * 
     * @param {number} event Specifies event ID to handle.
     * @param {*} [payload] Specifies payload of event.
     * @returns {boolean} Indicates whether the event was handled.
     * 
     * @memberOf IEventHandler
     */
    handle(event: number, payload?: any): boolean;
}

/**
 * 
 * Handles transitions.
 * 
 * Defines an interface for handling transitions.
 * 
 * @interface ITransitionHandler
 */
interface ITransitionHandler {
    (to: string): void;
}

/**
 * 
 * Defines a state.
 * 
 * @class State
 * @implements {IEventHandler}
 */
class State implements IEventHandler {
    /**
     * 
     * 
     * @type {string}
     * @memberOf State
     */
    public name: string;

    /**
     * 
     * 
     * @type null
     * @memberOf State
     */
    public canTransition: true;

    /**
     * 
     * Gets or sets parent state name.
     * 
     * @type {string}
     * @memberOf State
     */
    public parentState: string = null;

    /**
     * 
     * Gets or set start state name.
     * 
     * @type {string}
     * @memberOf State
     */
    public startState: string = null;

    /**
     * 
     * Gets or sets children.
     * 
     * @type {Array<string>}
     * @memberOf State
     */
    public children: Array<string> = [];

    /**
     * 
     * Gets or sets siblings.
     * 
     * @type {Array<string>}
     * @memberOf State
     */
    public siblings: Array<string> = [];

    /**
     * 
     * Gets or sets ancestors.
     * 
     * @type {Array<string>}
     * @memberOf State
     */
    public ancestors: Array<string> = [];

    /**
     * 
     * Gets or sets descendants.
     * 
     * @type {Array<string>}
     * @memberOf State
     */
    public descendants: Array<string> = [];
    
    /**
     * 
     * Stores state machine.
     * 
     * @private
     * @type {StateMachine}
     * @memberOf State
     */
    private _stateMachine: StateMachine = null;

    /**
     * Creates an instance of State.
     * 
     * @param {string} name Specifies name of state.
     * @param {string} [parentState=TOP_STATE_NAME] Specifies name of parent.
     * @param {string} [startState=null] Specifies name of start state.
     * 
     * @memberOf State
     */
    public constructor(name: string, parentState: string = null, startState: string = null) {
        if (!name || !name.trim()) throw "A state must have a valid name.";
        if (parentState && !parentState.trim()) throw "A parent state must have a valid name if specified.";
        if (startState && !startState.trim()) throw "A start state must have a valid name if specified.";

        this.name = _.lowerCase(_.trim(name));
        this.parentState = _.lowerCase(_.trim(parentState ? parentState : ""));
        this.startState = _.lowerCase(_.trim(startState ? startState : ""));
    }

    /**
     * 
     * Handles an event delegated by its state machine.
     * 
     * @param {number} event Specifies an event ID.
     * @param {*} [payload] Specifies a payload.
     * @returns {boolean} Indicates whether the event was handle by the state.
     * 
     * @memberOf State
     */
    public handle(event: number, payload?: any): boolean {
        return false;
    }

    /**
     * 
     * Adds 1 or more children.
     * 
     * @param {...Array<string>} stateNames Specifies name of children.
     * 
     * @memberOf State
     */
    public addChildren(...stateNames: Array<string>): void {
        _.forEach(stateNames, stateName => {
            let s = _.trim(stateName);

            if (!s) throw "You must add a valid string as a state name.";

            this.children.push(_.toLower(s));

            this.children = _.uniq(this.children);
        });
    }
    
    /**
     * 
     * Emits an event.
     * 
     * @protected
     * @param {number} event Specifies event ID.
     * @param {*} [payload] Specifies an event payload.
     * 
     * @memberOf State
     */
    protected emit(event: number, payload?: any): void {
        this._stateMachine.handle(event, payload);
    }
    
    /**
     * 
     * Transitions states.
     * 
     * @protected
     * @param {string} to Specifies name of state to transition to.
     * 
     * @memberOf State
     */
    protected transition(to: string): void {
        this._stateMachine.transition(to);
    }

    /**
     * 
     * Determines if a state is equal.
     * 
     * @param {(State | string)} state Specifies either state or state name.
     * @returns {boolean} Indicates whether state met criteria.
     * 
     * @memberOf State
     */
    public equals(state: State | string): boolean {
        let name: string = null;

        if (state instanceof State) {
            name = state.name;
        } else {
            name = state;
        }

        name = _.lowerCase(_.trim(name ? name : ""));

        return this.name === name;
    }

    /**
     * 
     * Determines if a state has children.
     * 
     * @param {State} state Specifies state name being tested.
     * @returns {boolean} Indicates whether state met criteria.
     * 
     * @memberOf State
     */
    public hasChildren(): boolean {
        return this.children.length > 0;
    }

    /**
     * 
     * Determines if a state is the parent state.
     * 
     * @param {State} state Specifies state name being tested.
     * @returns {boolean} Indicates whether state met criteria.
     * 
     * @memberOf State
     */
    public isParent(state: State): boolean {
        return this.parentState === state.name;
    }

    /**
     * 
     * Determines if a state is an ancestor.
     * 
     * @param {State} state Specifies state name being tested.
     * @returns {boolean} Indicates whether state met criteria.
     * 
     * @memberOf State
     */
    public isAncestor(state: State): boolean {
        return _.findIndex(this.ancestors, ancestor => ancestor === state.name) > -1;
    }

    /**
     * 
     * Determines if a state is a child.
     * 
     * @param {State} state Specifies state name being tested.
     * @returns {boolean} Indicates whether state met criteria.
     * 
     * @memberOf State
     */
    public isChild(state: State): boolean {
        return _.findIndex(this.children, child => child === state.name) > -1;
    }

    /**
     * 
     * Determines if a state is a sibling.
     * 
     * @param {State} state Specifies state name being tested.
     * @returns {boolean} Indicates whether state met criteria.
     * 
     * @memberOf State
     */
    public isSibling(state: State): boolean {
        return _.findIndex(this.siblings, sibling => sibling === state.name) > -1;
    }

    /**
     * 
     * Determines if a state is a descendant.
     * 
     * @param {State} state
     * @returns {boolean}
     * 
     * @memberOf State
     */
    public isDescendant(state: State): boolean {
        return _.findIndex(this.descendants, descendant => descendant === state.name) > -1;
    }

    
    /**
     * 
     * Associates a state machine with a state
     * NOTE: This method should never be called by user; it is used internally.
     * 
     * @param {StateMachine} stateMachine Specifies state machine.
     * 
     * @memberOf State
     */
    public setStateMachine(stateMachine: StateMachine) {
        if (!stateMachine) throw "State machine is invalid.";

        this._stateMachine = stateMachine;
    }
}

/**
 * 
 * Defines a state machine.
 * 
 * @abstract
 * @class StateMachine
 * @implements {IEventHandler}
 */
abstract class StateMachine {
    /**
     * 
     * Stores queue capacity.
     * Defaults to 0.
     * 
     * @private
     * @type {number}
     * @memberOf StateMachine
     */
    private _queueCapacity: number = 0;

    /**
     * 
     * Specifies instruction queue that is used for queuing instructions.
     * 
     * @private
     * @type {Array<Instruction>}
     * @memberOf StateMachine
     */
    private _instructionQueue: Array<Instruction> = [];

    /**
     * 
     * Stores currenet state.
     * 
     * @private
     * @type {State}
     * @memberOf StateMachine
     */
    private _currentState: State = null;

    /**
     * 
     * Stores top state.
     * 
     * @private
     * @type {State}
     * @memberOf StateMachine
     */
    private _topState: State = new State(TOP_STATE_NAME);

    /**
     * 
     * Stores registered states.
     * 
     * @private
     * @type {{ [key: string]: State }}
     * @memberOf StateMachine
     */
    private _states: { [key: string]: State } = {};
    
    /**
     * 
     * Stores registered events.
     * 
     * @private
     * @type {Array<number>}
     * @memberOf StateMachine
     */
    private _events: Array<number> = [EXIT, ENTER];

    /**
     * 
     * Stores registered parallel state machines.
     * 
     * @private
     * @type {Array<StateMachine>}
     * @memberOf StateMachine
     */
    private _stateMachines: Array<StateMachine> = [];

    /**
     * 
     * Indicates whether a state machine is initialized.
     * 
     * @private
     * @type {boolean}
     * @memberOf StateMachine
     */
    private _isInitialized: boolean = false;

    /**
     * 
     * Inidicates whether a state machine is processing an instruction.
     * 
     * @private
     * @type {boolean}
     * @memberOf StateMachine
     */
    private _isBusy: boolean = false;

    /**
     * 
     * Indicates whether a state machine is resetting.
     * 
     * @private
     * @type {boolean}
     * @memberOf StateMachine
     */
    private _isResetting: boolean = false;

    /**
     * Creates an instance of StateMachine.
     * 
     * @param {number} [queueCapacity] Specifies queue capacity.
     * @param {State} [topState] Specifies name of top state.
     * @param {string} [topStartState] Specifies name of start state.
     * 
     * @memberOf StateMachine
     */
    protected constructor(queueCapacity?: number, topState?: State, topStartState?: string) {
        if (queueCapacity && queueCapacity < 0) throw 'A state machine cannot have a negative queue capacity.';
        if (queueCapacity && queueCapacity > 0) this._queueCapacity = queueCapacity;

        if (topState) {
            if (topState.name != TOP_STATE_NAME) throw `Top state must have the name ${TOP_STATE_NAME}. Use constant export.`;
            if (topState.parentState) throw "A top state cannot have a parent state.";
            if (topState.hasChildren.length > 0) throw "Top state cannot have children when instantiating state machine.";

            this._topState = topState;
        }

        if (topStartState) {
            topStartState = _.lowerCase(_.trim(topStartState ? topStartState : ''));

            if (!topStartState) throw "A valid top start state must be provided if specified.";

            this._topState.startState = topStartState;
        }

        this.registerStates(this._topState);
    }

    /**
     * 
     * Registers one or more states.
     * 
     * @protected
     * @param {...Array<State>} states Specifies 1 or more states.
     * 
     * @memberOf StateMachine
     */
    protected registerStates(...states: Array<State>): void {
        if (this._isInitialized) throw "States cannot be added after the state machine has been initialized.";

        _.forEach(states, state => {
            if (!state) throw "A state cannot be null or undefined";
            if (this._states[state.name]) throw `State ${state.name} cannot be registered multiple times.`;

            this._states[state.name] = state;
        });
    }

    /**
     * Registers one or more events by ID.
     * 
     * @protected
     * @param {...Array<number>} events Specifies 1 or more events.
     * 
     * @memberOf StateMachine
     */
    protected registerEvents(...events: Array<number>): void {
        if (this._isInitialized) throw "Events cannot be added after the state machine has been initialized.";

        _.forEach(events, event => {
            this._events.push(event);
        });
    }

    /**
     * Registers one or more parallel state machines.
     * 
     * @protected
     * @param {...Array<StateMachine>} stateMachines
     * 
     * @memberOf StateMachine
     */
    protected registerStateMachines(...stateMachines: Array<StateMachine>): void {
        if (this._isInitialized) throw "Parallel state machines cannot be added after the state machine has been initialized.";

        _.forEach(stateMachines, stateMachine => {
            if (stateMachine._isInitialized) throw "Parallel state machines must be registered uninitialized.";

            if (stateMachine) this._stateMachines.push(stateMachine);
        });
    }

    /**
     * 
     * Intializes a state machine.
     * 
     * @memberOf StateMachine
     */
    public initialize(): void {
        if (this._isInitialized === true) throw "A state machine cannot be initalized twice.";

        _.forEach(this._states, state => {
            if (state.name != TOP_STATE_NAME && !state.parentState) {
                state.parentState = TOP_STATE_NAME;

                this._topState.addChildren(state.name);
            }
        });

        let i: number = EXIT;
        for (let event of _.sortBy(this._events)) {
            if (event < 0 && !Event.isInfrastructureEvent(event)) throw "Event IDs cannot be negative nor duplicate. Negative evenet IDs are reserved for infrastructure events (i.e. EXIT, ENTRY, etc.)";
            if (i != event) throw "Events must be registered in chronological order start at 0;";

            i++;
        }

        _.forEach(this._states, state => {
            let parentState: State = this._states[state.parentState];

            if (!parentState && state.name != TOP_STATE_NAME) throw `The parent state of ${state.name} is not registered.`;

            // Add children.

            _.forEach(this._states, s => {
                if (s.isParent(state)) {
                    state.addChildren(s.name);
                }
            });

        });

        _.forEach(this._states, state => {
            if (state.parentState) {
                let parentState: State = this._states[state.parentState];

                if (!state.equals(TOP_STATE_NAME)) {
                    // Add siblings.
                    state.siblings = _.uniq(_.without(parentState.children, state.name));

                    // Add ancestors and descendants.
                    let parent: State = this._states[parentState.name];
                    while (parent) {
                        state.ancestors.push(parent.name);
                        parent.descendants = _.uniq(_.union(parent.descendants, parent.children, state.children));
                        parent = this._states[parent.parentState];
                    }
                }
            }
        });

        _.forEach(this._states, state => {
            // Check start states.

            let startState: State = this._states[state.startState];

            if (startState) {
                if (!state.isDescendant(startState)) throw `The start state "${startState.name}" is not a descendant or child of "${state.name}".`;
            }

            // Check child states.
            _.forEach(state.children, c => {
                let child: State = this._states[c];

                if (!child) throw "State '${c}' is not registered in this state machine.";
                if (!child.isParent(state)) throw `State "${state.name}" is not a parent of "${child.name}".`;
            });

            state.canTransition = true;
        });

        _.forEach(this._stateMachines, stateMachine => {
            _.forEach(this._events, event => { 
                stateMachine.registerEvents(event);
            });

            stateMachine.initialize();
        });

        this._currentState = this._topState;

        this._currentState.handle(ENTER);

        let start: State = this._states[this._currentState.startState];

        this._isInitialized = true;

        _.forEach(this._states, state => {
            state.setStateMachine(this);
        });

        if (start) {
            if (!this._currentState.isDescendant(start)) throw "A start state must be a child or descendant of the state it is assigned to.";

            this.transition(this._currentState.startState);
        }
    }

    /**
     * 
     * Resets state machine to initial state
     * 
     * @memberOf StateMachine
     */
    public reset(): void {
        if (!this._isInitialized) throw "A state machine cannot be reset if it hasn't been initialized.";
        if (this._isResetting) throw "This state machine is already resetting.";

        if (!this._isBusy) this.setBusy(true);

        this._isResetting = true;
        this._instructionQueue = [];
        this._currentState = this._topState;

        _.forEach(this._states, state => {
            state.canTransition = true;
        });

        _.forEach(this._stateMachines, stateMachine => {
            stateMachine.reset();
        });

        let startState = this._states[this._currentState.startState];

        if (startState) {
            this._currentState.handle(ENTER);

            this.transition(this._currentState.startState);
        }

        this._isResetting = false;

        if (this._isBusy) this.setBusy(false);
    }

    /**
     * 
     * Handles registered events.
     * 
     * @param {number} event Specifies the ID of the event to handle
     * @param {*} [payload] Specifies data that can optionally be sent along with a request
     * 
     * @memberOf StateMachine
     */
    public handle(event: number, payload?: any): void {
        if (!this._isInitialized) throw "An event cannot be handled until the state machine is initialzed.";
        if (this._isResetting) throw "An event cannot be handled while the state machine is being reset.";
        if (_.indexOf(this._events, event) === -1) throw `Event ${event} is not registered.`;

        if (this._isBusy) {
            this.queueInstruction(new Event(event, payload));

            return;
        }        

        this.setBusy(true);

        let state: State = this._currentState;

        while (state && !state.handle(event, payload) && !Event.isInfrastructureEvent(event)) {
            state = this._states[state.parentState];
        }

        for (let i: number = 0; i < this._stateMachines.length; i++) {
            this._stateMachines[i].handle(event, payload);
        }

        this.setBusy(false);
    }

    /**
     * 
     * Transitions to new state.
     * 
     * @param {string} to Specifies name of state to transition to
     * @returns {void}
     * 
     * @memberOf StateMachine
     */
    public transition(to: string): void {
        let destination: State = this._states[_.lowerCase(to)];

        if (!destination) throw 'State is not registered.';
        if (!this._currentState.canTransition) throw 'A state machine cannot transition states on infrastructure events (i.e. start, Event.enter, and Event.exit).';

        if (this._isBusy) {
            this.queueInstruction(new Transition(to));

            return;
        }

        this.setBusy(true);

        this.doTransition(destination)

        this.setBusy(false);
    }

    /**
     * 
     * Sets a bit indicating whether the state machine is processing an instruction.
     * 
     * @private
     * @param {boolean} isBusy Specifies busy state of state machine.
     * 
     * @memberOf StateMachine
     */
    private setBusy(isBusy: boolean): void {
        if (this._isBusy === isBusy) {
            throw 'Cannot set busy state to the same state twice.';
        }

        if (!isBusy) {
            while (this._instructionQueue.length !== 0) {
                let instruction = this._instructionQueue.pop();

                switch (instruction.type) {
                    case InstructionTypes.Event:
                        {
                            let ins: Event = <Event>instruction;
                            let state: State = this._currentState;

                            while (!state.handle(ins.id, ins.payload) && !Event.isInfrastructureEvent(ins.id) && state.parentState) {
                                state = this._states[state.parentState];
                            }
                        }
                        break;

                    case InstructionTypes.Transition:
                        {
                            let ins: Transition = <Transition>instruction;

                            this.doTransition(this._states[_.lowerCase(ins.state)]);
                        }
                        break;

                    default:
                        throw 'Unsupported instruction type ' + instruction.type + ' specified.';
                }
            }
        }

        this._isBusy = isBusy;

        _.forEach(this._states, state => {
            state.canTransition = true;
        });
    }


    /**
     * 
     * Performs transition logic.
     * 
     * @private
     * @param {State} destination Specifies name of state to transition to
     * 
     * @memberOf StateMachine
     */
    private doTransition(destination: State): void {
        if (this._currentState.equals(destination)) {
            throw 'A state cannot transition to itself.';
        }
        else if (this._currentState.isParent(destination)) {
            this.transitionToParent(destination);
        }
        else if (this._currentState.isSibling(destination)) {
            this.transitionToSibling(destination);
        }
        else if (this._currentState.isChild(destination)) {
            this.transitionToChild(destination);
        }
        else if (this._currentState.isAncestor(destination)) {
            this.transitionToAncestor(destination);
        }
        else if (this._currentState.isDescendant(destination)) {
            this.transitionToDescendant(destination);
        }
        else {
            this.transitionToOther(destination);
        }

        let next: State = destination;
        
        while (next.startState) {
            next = this._states[next.startState];

            next.handle(ENTER);
        }

        this._currentState = next;
    }

    /**
     * 
     * Queues an instruction.
     * 
     * @private
     * @param {Instruction} instruction Specfies instruction to queue.
     * @returns {void}
     * 
     * @memberOf StateMachine
     */
    private queueInstruction(instruction: Instruction): void {
        if (!instruction) throw "An instruction cannot be null.";

        if (this._queueCapacity === 0) return;

        this._instructionQueue.unshift(instruction);

        while (this._instructionQueue.length > this._queueCapacity) {
            this._instructionQueue.pop();
        }
    }

    /**
     * 
     * Transitions to a parent state.
     * 
     * @private
     * @param {State} to Specifies state to transition to.
     * 
     * @memberOf StateMachine
     */
    private transitionToParent(to: State): void {
        this._currentState.handle(EXIT);
    }

    /**
     * 
     * Transitions to a sibling state.
     * 
     * @private
     * @param {State} to Specifies state to transition to.
     * 
     * @memberOf StateMachine
     */
    private transitionToSibling(to: State): void {
        this._currentState.handle(EXIT);

        to.handle(ENTER);
    }

    /**
     * 
     * Transitions to a child state.
     * 
     * @private
     * @param {State} to Specifies state to transition to.
     * 
     * @memberOf StateMachine
     */
    private transitionToChild(to: State): void {
        to.handle(ENTER);
    }

    /**
     * Transitions to an ancestor state.
     * 
     * @private
     * @param {State} to Specifies state to transition to.
     * 
     * @memberOf StateMachine
     */
    private transitionToAncestor(to: State): void {
        let current = this._currentState;

        while (current && !current.equals(to)) {
            current.handle(EXIT);

            current = this._states[current.parentState];
        }

        if (!current) throw "There was an error transition to ancestor '" + to.name + "'.";
    }

    /**
     * 
     * Transitions to a descendant state.
     * 
     * @private
     * @param {State} to Specifies state to transition to.
     * 
     * @memberOf StateMachine
     */
    private transitionToDescendant(to: State): void {
        let current = this._currentState;

        for (let i = 0; i < current.children.length; i++) {
            let child = this._states[current.children[i]];

            if (child.equals(to) || child.isDescendant(to)) {
                current = child;

                current.handle(ENTER);

                if (child.equals(to)) break;
            }
        }
    }

    /**
     * 
     * Transitions to a state with no direct relation (other than top).
     * 
     * @private
     * @param {State} to Specifies state to transition to.
     * 
     * @memberOf StateMachine
     */
    private transitionToOther(to: State): void {
        let current = this._currentState;

        while (current && !current.isDescendant(to)) {
            current.handle(EXIT);

            current = this._states[current.parentState];
        }

        while (!current.equals(to)) {
            for (let i = 0; i < current.children.length; i++) {
                let child = this._states[current.children[i]];

                if (child.equals(to) || child.isDescendant(to)) {
                    current = child;

                    current.handle(ENTER);

                    break;
                }
            }
        }
    }
}

// The only structured items needed to make a state machine are the 'State' and 'StateMachine' classes.
export { StateMachine, State, ENTER, EXIT, TOP_STATE_NAME }