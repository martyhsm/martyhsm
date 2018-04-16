import * as _ from 'lodash';
import { StateMachine } from "./stateMachine";
import { IEventHandler } from "./eventHandler";

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
    public name : string;

    /**
     *
     *
     * @type null
     * @memberOf State
     */
    public canTransition : true;

    /**
     *
     * Gets or sets parent state name.
     *
     * @type {string}
     * @memberOf State
     */
    public parentState : string = null;

    /**
     *
     * Gets or set start state name.
     *
     * @type {string}
     * @memberOf State
     */
    public startState : string = null;

    /**
     *
     * Gets or sets children.
     *
     * @type {Array<string>}
     * @memberOf State
     */
    public children : Array < string > = [];

    /**
     *
     * Gets or sets siblings.
     *
     * @type {Array<string>}
     * @memberOf State
     */
    public siblings : Array < string > = [];

    /**
     *
     * Gets or sets ancestors.
     *
     * @type {Array<string>}
     * @memberOf State
     */
    public ancestors : Array < string > = [];

    /**
     *
     * Gets or sets descendants.
     *
     * @type {Array<string>}
     * @memberOf State
     */
    public descendants : Array < string > = [];

    /**
     *
     * Stores state machine.
     *
     * @private
     * @type {StateMachine}
     * @memberOf State
     */
    private _stateMachine : StateMachine = null;

    /**
     * Creates an instance of State.
     *
     * @param {string} name Specifies name of state.
     * @param {string} [parentState=TOP_STATE_NAME] Specifies name of parent.
     * @param {string} [startState=null] Specifies name of start state.
     *
     * @memberOf State
     */
    public constructor(name : string, parentState : string = null, startState : string = null) {
        if (!name || !name.trim()) 
            throw "A state must have a valid name.";
        if (parentState && !parentState.trim()) 
            throw "A parent state must have a valid name if specified.";
        if (startState && !startState.trim()) 
            throw "A start state must have a valid name if specified.";
        
        this.name = _.lowerCase(_.trim(name));
        this.parentState = _.lowerCase(_.trim(parentState
            ? parentState
            : ""));
        this.startState = _.lowerCase(_.trim(startState
            ? startState
            : ""));
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
    public handle(event : number, payload?: any) : boolean {return false;}

    /**
     *
     * Adds 1 or more children.
     *
     * @param {...Array<string>} stateNames Specifies name of children.
     *
     * @memberOf State
     */
    public addChildren(...stateNames : Array < string >) : void {
        _.forEach(stateNames, stateName => {
            let s = _.trim(stateName);

            if (!s) 
                throw "You must add a valid string as a state name.";
            
            this
                .children
                .push(_.toLower(s));

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
    protected emit(event : number, payload?: any) : void {
        this
            ._stateMachine
            .handle(event, payload);
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
    protected transition(to : string) : void {
        this
            ._stateMachine
            .transition(to);
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
    public equals(state : State | string) : boolean {
        let name: string = null;

        if (state instanceof State) {
            name = state.name;
        } else {
            name = state;
        }

        name = _.lowerCase(_.trim(name
            ? name
            : ""));

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
    public hasChildren() : boolean {
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
    public isParent(state : State) : boolean {
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
    public isAncestor(state : State) : boolean {
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
    public isChild(state : State) : boolean {
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
    public isSibling(state : State) : boolean {
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
    public isDescendant(state : State) : boolean {
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
    public setStateMachine(stateMachine : StateMachine) {
        if (!stateMachine) 
            throw "State machine is invalid.";
        
        this._stateMachine = stateMachine;
    }
}

export { State }