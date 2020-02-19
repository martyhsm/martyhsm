import { Event } from './event';
import { StateMachine } from './stateMachine';
import { IEventHandler } from './eventHandler';
import { Subject, Subscription } from 'rxjs';
import { lowerCase, trim, uniq, findIndex, forEach, toLower } from 'lodash';
import { appendFileSync } from 'fs';

/**
 * Defines a state.
 *
 * @class State
 * @implements {IEventHandler}
 */
class State implements IEventHandler {
  /**
   * specifies name of state
   *
   * @type {string}
   * @memberOf State
   */
  public name: string;

  /**
   * indicates whether a transition is possible
   *
   * @type null
   * @memberOf State
   */
  public canTransition: boolean = false;

  /**
   * Gets or sets parent state name.
   *
   * @type {string}
   * @memberOf State
   */
  public parentState: string = null;

  /**
   * Gets or set start state name.
   *
   * @type {string}
   * @memberOf State
   */
  public startState: string = null;

  /**
   * Gets or sets children.
   *
   * @type {Array<string>}
   * @memberOf State
   */
  private _children: string[] = [];

  /**
   * Gets or sets siblings.
   *
   * @type {Array<string>}
   * @memberOf State
   */
  private _siblings: string[] = [];

  /**
   * Gets or sets ancestors.
   *
   * @type {Array<string>}
   * @memberOf State
   */
  private _ancestors: string[] = [];

  /**
   * gets or sets descendants.
   *
   * @type {Array<string>}
   * @memberOf State
   */
  private _descendants: string[] = [];

  /**
   * stores state machine.
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
  public constructor(
    name: string,
    parentState: string | State = null,
    startState: string | State = null
  ) {
    if (!name || !trim(name))
      throw new Error('A state must have a valid name.');
    if (
      parentState &&
      !trim(parentState instanceof State ? parentState.name : parentState)
    )
      throw new Error('A parent state must have a valid name if specified.');
    if (
      startState &&
      !trim(startState instanceof State ? startState.name : startState)
    )
      throw new Error('A start state must have a valid name if specified.');

    this.name = lowerCase(trim(name));

    if (parentState)
      this.parentState = lowerCase(
        trim(parentState instanceof State ? parentState.name : parentState)
      );
    if (startState)
      this.startState = lowerCase(
        trim(startState instanceof State ? startState.name : startState)
      );
  }

  /**
   * Handles an event delegated by its state machine.
   *
   * @param {number} event Specifies an event ID.
   * @param {*} [payload] Specifies a payload.
   * @returns {boolean} Indicates whether the event was handle by the state.
   *
   * @memberOf State
   */
  public handle(event: number | string, payload?: any): boolean {
    return false;
  }

  /**
   * Adds 1 or more children.
   *
   * @param {...Array<string>} stateNames Specifies name of children.
   *
   * @memberOf State
   */
  public addChildren(...states: Array<string | State>): void {
    forEach(states, state => {
      let name = trim(state instanceof State ? state.name : state);

      if (!name) throw 'You must add a valid string as a state name.';

      this._children.push(toLower(name));
      this._children = uniq(this._children);
    });
  }

  public getChildren(): string[] {
    return this._children;
  }

  public addAncestors(...states: Array<State | string>): void {
    forEach(states, state => {
      const name = state instanceof State ? state.name : state;

      if (!state) throw 'State must be defined.';

      this._ancestors.push(toLower(name));
      this._ancestors = uniq(this._ancestors);
    });
  }

  public getAncestors(): string[] {
    return this._ancestors;
  }

  public addDescendants(...states: Array<State | string>): void {
    forEach(states, state => {
      const name = state instanceof State ? state.name : state;

      if (!state) throw 'State must be defined.';

      this._descendants.push(toLower(name));
      this._descendants = uniq(this._descendants);
    });
  }

  public getDescendants(): string[] {
    return this._descendants;
  }

  public addSiblings(...states: Array<State | string>): void {
    forEach(states, state => {
      const name = state instanceof State ? state.name : state;

      if (!state) throw 'State must be defined.';

      this._siblings.push(toLower(name));
      this._siblings = uniq(this._siblings);
    });
  }

  public getSiblings(): string[] {
    return this._siblings;
  }

  /**
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

    name = lowerCase(trim(name ? name : ''));

    if (!name) throw new Error('An invalid state was passed.');

    return this.name === name;
  }

  /**
   * Determines if a state has children.
   *
   * @param {State} state Specifies state name being tested.
   * @returns {boolean} Indicates whether state met criteria.
   *
   * @memberOf State
   */
  public hasChildren(): boolean {
    return this._children.length > 0;
  }

  /**
   * Determines if a state is the parent state.
   *
   * @param {State} state Specifies state name being tested.
   * @returns {boolean} Indicates whether state met criteria.
   *
   * @memberOf State
   */
  public isParent(state: State | string): boolean {
    return this.parentState === (state instanceof State ? state.name : state);
  }

  /**
   * Determines if a state is an ancestor.
   *
   * @param {State} state Specifies state name being tested.
   * @returns {boolean} Indicates whether state met criteria.
   *
   * @memberOf State
   */
  public isAncestor(state: State | string): boolean {
    return (
      findIndex(
        this._ancestors,
        ancestor => ancestor === (state instanceof State ? state.name : state)
      ) > -1
    );
  }

  /**
   * Determines if a state is a child.
   *
   * @param {State} state Specifies state name being tested.
   * @returns {boolean} Indicates whether state met criteria.
   *
   * @memberOf State
   */
  public isChild(state: State | string): boolean {
    return (
      findIndex(
        this._children,
        child => child === (state instanceof State ? state.name : state)
      ) > -1
    );
  }

  /**
   * Determines if a state is a sibling.
   *
   * @param {State} state Specifies state name being tested.
   * @returns {boolean} Indicates whether state met criteria.
   *
   * @memberOf State
   */
  public isSibling(state: State | string): boolean {
    return (
      findIndex(
        this._siblings,
        sibling => sibling === (state instanceof State ? state.name : state)
      ) > -1
    );
  }

  /**
   * Determines if a state is a descendant.
   *
   * @param {State} state
   * @returns {boolean}
   *
   * @memberOf State
   */
  public isDescendant(state: State | string): boolean {
    return (
      findIndex(
        this._descendants,
        descendant =>
          descendant === (state instanceof State ? state.name : state)
      ) > -1
    );
  }

  /**
   * Associates a state machine with a state
   * NOTE: This method should never be called by user; it is used internally.
   *
   * @param {StateMachine} stateMachine Specifies state machine.
   * @memberOf State
   */
  public setStateMachine(stateMachine: StateMachine) {
    if (!stateMachine) throw new Error('State machine is invalid.');
    if (this._stateMachine) throw new Error('State machine is already set.');

    this._stateMachine = stateMachine;
  }

  /**
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
}

export { State };
