import { Instruction } from './instruction';
import { ENTER, EXIT } from './constants';
import { InstructionTypes } from './instructionTypes';

/**
 *
 * Defines an event instruction.
 *
 * @class Event
 * @extends {Instruction}
 */
export class Event extends Instruction {
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
