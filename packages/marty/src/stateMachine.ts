import {
  forEach,
  lowerCase,
  trim,
  uniq,
  union,
  without,
  indexOf
} from 'lodash';
import { State } from './state';
import { Instruction } from './instruction';
import { TOP_STATE_NAME, EXIT, ENTER } from './constants';
import { Transition } from './transition';
import { Event } from './event';
import { InstructionTypes } from './instructionTypes';
import { Subject } from 'rxjs';

/**
 *
 * Defines a state machine.
 *
 * @abstract
 * @class StateMachine
 */
abstract class StateMachine {
  /**
   * Stores queue capacity.
   * Defaults to 0.
   *
   * @private
   * @type {number}
   * @memberOf StateMachine
   */
  private _queueCapacity: number = 0;

  /**
   * Specifies instruction queue that is used for queuing instructions.
   *
   * @private
   * @type {Array<Instruction>}
   * @memberOf StateMachine
   */
  private _instructionQueue: Array<Instruction> = [];

  /**
   * Stores currenet state.
   *
   * @private
   * @type {State}
   * @memberOf StateMachine
   */
  private _currentState: State = null;

  /**
   * Stores top state.
   *
   * @private
   * @type {State}
   * @memberOf StateMachine
   */
  private _topState: State = new State(TOP_STATE_NAME);

  /**
   * Stores registered states.
   *
   * @private
   * @type {{ [key: string]: State }}
   * @memberOf StateMachine
   */
  private _states: {
    [key: string]: State;
  } = {};

  /**
   * Stores registered events.
   *
   * @private
   * @type {Array<number>}
   * @memberOf StateMachine
   */
  private _events: Array<number | string> = Event.getInfrastructureEvents();

  /**
   * Stores registered parallel state machines.
   *
   * @private
   * @type {Array<StateMachine>}
   * @memberOf StateMachine
   */
  private _stateMachines: Array<StateMachine> = [];

  /**
   * Indicates whether a state machine is initialized.
   *
   * @private
   * @type {boolean}
   * @memberOf StateMachine
   */
  private _initialized: boolean = false;

  /**
   * Inidicates whether a state machine is processing an instruction.
   *
   * @private
   * @type {boolean}
   * @memberOf StateMachine
   */
  private _isBusy: boolean = false;

  /**
   * Indicates whether a state machine is resetting.
   *
   * @private
   * @type {boolean}
   * @memberOf StateMachine
   */
  private _isResetting: boolean = false;

  /**
   * emits events for state machine
   *
   * @private
   * @type {Subject<Event>}
   * @memberOf StateMachine
   */
  private _subject: Subject<Event> = new Subject<Event>();

  /**
   * Creates an instance of StateMachine.
   *
   * @param {number} [queueCapacity] Specifies queue capacity.
   * @param {State} [topState] Specifies name of top state.
   * @param {string} [topStartState] Specifies name of start state.
   *
   * @memberOf StateMachine
   */
  protected constructor(
    queueCapacity?: number,
    topState?: State,
    topStartState?: string
  ) {
    if (queueCapacity && queueCapacity < 0)
      throw 'A state machine cannot have a negative queue capacity.';
    if (queueCapacity && queueCapacity > 0) this._queueCapacity = queueCapacity;

    if (topState) {
      if (topState.name != TOP_STATE_NAME)
        throw `Top state must have the name ${TOP_STATE_NAME}. Use constant export.`;
      if (topState.parentState) throw 'A top state cannot have a parent state.';
      if (topState.hasChildren.length > 0)
        throw 'Top state cannot have children when instantiating state machine.';

      this._topState = topState;
    }

    if (topStartState) {
      topStartState = lowerCase(trim(topStartState ? topStartState : ''));

      if (!topStartState)
        throw 'A valid top start state must be provided if specified.';

      this._topState.startState = topStartState;
    }

    this.registerStates(this._topState);
  }

  /**
   * Registers one or more states.
   *
   * @protected
   * @param {...Array<State>} states Specifies 1 or more states.
   *
   * @memberOf StateMachine
   */
  protected registerStates(...states: Array<State>): void {
    if (this._initialized)
      throw 'States cannot be added after the state machine has been initialized.';

    forEach(states, state => {
      if (!state) throw 'A state cannot be null or undefined';
      if (this._states[state.name])
        throw `State ${state.name} cannot be registered multiple times.`;

      state.setSubject(this._subject);

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
  protected registerEvents(...events: Array<number | string>): void {
    if (this._initialized)
      throw new Error(
        'Events cannot be added after the state machine has been initialized.'
      );

    forEach(events, event => {
      if (Event.isInfrastructureEvent(event)) {
        throw new Error(
          `Cannot register an event similar to infrastructure events: ${Event.getInfrastructureEvents()}.`
        );
      }

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
    if (this._initialized)
      throw 'Parallel state machines cannot be added after the state machine has been initial' +
        'ized.';

    forEach(stateMachines, stateMachine => {
      if (stateMachine.isInitialized())
        throw 'Parallel state machines must be registered uninitialized.';

      stateMachine.setSubject(this._subject);
      if (stateMachine) this._stateMachines.push(stateMachine);
    });
  }

  /**
   * Intializes a state machine.
   *
   * @memberOf StateMachine
   */
  public initialize(): void {
    if (this._initialized === true)
      throw 'A state machine cannot be initalized twice.';

    forEach(this._states, state => {
      if (state.name != TOP_STATE_NAME && !state.parentState) {
        state.parentState = TOP_STATE_NAME;

        this._topState.addChildren(state.name);
      }
    });

    const uniqueEvents = uniq(this._events);
    if (uniqueEvents.length < this._events.length) {
      throw new Error('Duplicate events cannot be registered.');
    }

    forEach(this._states, state => {
      let parentState: State = this._states[state.parentState];

      if (!parentState && state.name != TOP_STATE_NAME)
        throw new Error(`The parent state of ${state.name} is not registered.`);

      // Add children.

      forEach(this._states, s => {
        if (s.isParent(state)) {
          state.addChildren(s.name);
        }
      });
    });

    forEach(this._states, state => {
      if (state.parentState) {
        let parentState: State = this._states[state.parentState];

        if (!state.equals(TOP_STATE_NAME)) {
          // Add siblings.
          state.siblings = uniq(without(parentState.children, state.name));

          // Add ancestors and descendants.
          let parent: State = this._states[parentState.name];
          while (parent) {
            state.ancestors.push(parent.name);
            parent.descendants = uniq(
              union(parent.descendants, parent.children, state.children)
            );
            parent = this._states[parent.parentState];
          }
        }
      }
    });

    forEach(this._states, state => {
      // Check start states.

      let startState: State = this._states[state.startState];

      if (startState) {
        if (!state.isDescendant(startState))
          throw `The start state "${startState.name}" is not a descendant or child of "${state.name}".`;
      }

      // Check child states.
      forEach(state.children, c => {
        let child: State = this._states[c];

        if (!child)
          throw "State '${c}' is not registered in this state machine.";
        if (!child.isParent(state))
          throw `State "${state.name}" is not a parent of "${child.name}".`;
      });

      state.canTransition = true;
    });

    forEach(this._stateMachines, stateMachine => {
      forEach(this._events, event => {
        stateMachine.registerEvents(event);
      });

      stateMachine.initialize();
    });

    this.setCurrentState(this._topState);

    this._subject.next(new Event(ENTER));

    let start: State = this._states[this._currentState.startState];

    this._initialized = true;

    forEach(this._states, state => {
      state.setStateMachine(this);
    });

    if (start) {
      if (!this._currentState.isDescendant(start))
        throw 'A start state must be a child or descendant of the state it is assigned to.';

      this.transition(this._currentState.startState);
    }
  }

  public isInitialized(): boolean {
    return this._initialized;
  }

  /**
   *
   * Resets state machine to initial state
   *
   * @memberOf StateMachine
   */
  public reset(): void {
    if (!this._initialized)
      throw "A state machine cannot be reset if it hasn't been initialized.";
    if (this._isResetting) throw 'This state machine is already resetting.';

    if (!this._isBusy) this.setBusy(true);

    this._isResetting = true;
    this._instructionQueue = [];

    this.setCurrentState(this._topState);

    forEach(this._states, state => {
      state.canTransition = true;
    });

    forEach(this._stateMachines, stateMachine => {
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
   * @param {number | string} event Specifies the ID of the event to handle
   * @param {*} [payload] Specifies data that can optionally be sent along with a request
   *
   * @memberOf StateMachine
   */
  public handle(event: number | string, payload?: any): void {
    if (!this._initialized)
      throw 'An event cannot be handled until the state machine is initialzed.';
    if (this._isResetting)
      throw 'An event cannot be handled while the state machine is being reset.';
    if (indexOf(this._events, event) === -1)
      throw `Event ${event} is not registered.`;

    if (this._isBusy) {
      this.queueInstruction(new Event(event, payload));

      return;
    }

    this.setBusy(true);

    let state: State = this._currentState;

    this._subject.next(new Event(event, payload));

    while (
      state &&
      !state.handle(event, payload) &&
      !Event.isInfrastructureEvent(event)
    ) {
      state = this._states[state.parentState];
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
    let destination: State = this._states[lowerCase(to)];

    if (!destination) throw 'State is not registered.';
    if (!this._currentState.canTransition)
      throw 'A state machine cannot transition states on infrastructure events (i.e. start, E' +
        'vent.enter, and Event.exit).';

    if (this._isBusy) {
      this.queueInstruction(new Transition(to));

      return;
    }

    this.setBusy(true);

    this.doTransition(destination);

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

              while (
                !state.handle(ins.id, ins.payload) &&
                !Event.isInfrastructureEvent(ins.id) &&
                state.parentState
              ) {
                state = this._states[state.parentState];
              }
            }
            break;

          case InstructionTypes.Transition:
            {
              let ins: Transition = <Transition>instruction;

              this.doTransition(this._states[lowerCase(ins.state)]);
            }
            break;

          default:
            throw 'Unsupported instruction type ' +
              instruction.type +
              ' specified.';
        }
      }
    }

    this._isBusy = isBusy;

    forEach(this._states, state => {
      state.canTransition = true;
    });
  }

  /**
   * sets subject
   *
   * @param subject specifies subject
   */
  public setSubject(subject: Subject<Event>): void {
    this._subject = subject || new Subject<Event>();

    this._subject.subscribe(event => {
      this.handle(event.id, event.payload);
    });
  }

  private setCurrentState(state: State): void {
    if (this._currentState) {
      this._currentState.deactivate();
    }
    this._currentState = state;
    this._currentState.activate();
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
    } else if (this._currentState.isParent(destination)) {
      this.transitionToParent();
    } else if (this._currentState.isSibling(destination)) {
      this.transitionToSibling(destination);
    } else if (this._currentState.isChild(destination)) {
      this.transitionToChild(destination);
    } else if (this._currentState.isAncestor(destination)) {
      this.transitionToAncestor(destination);
    } else if (this._currentState.isDescendant(destination)) {
      this.transitionToDescendant(destination);
    } else {
      this.transitionToOther(destination);
    }

    let next: State = destination;

    while (next.startState) {
      next = this._states[next.startState];

      next.handle(ENTER);
    }

    this.setCurrentState(next);
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
    if (!instruction) throw 'An instruction cannot be null.';

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
  private transitionToParent(): void {
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

    if (!current)
      throw "There was an error transition to ancestor '" + to.name + "'.";
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

export { StateMachine };
