import { Instruction } from './instruction';
import { ENTER, EXIT } from './constants';
import { InstructionTypes } from './instructionTypes';
import { trim } from 'lodash';

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
   * @param {number | string} id
   * @param {*} [payload]
   *
   * @memberOf Event
   */
  constructor(public id: number | string, public payload?: any) {
    super(InstructionTypes.Event);

    if (
      id === null ||
      id === undefined ||
      (typeof id === 'string' && !trim(id))
    ) {
      throw new Error(`Event ID ${id} is invalid.`);
    }
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
  static isInfrastructureEvent(id: number | string) {
    return id == ENTER || id == EXIT;
  }

  static getInfrastructureEvents(): Array<string | number> {
    return [ENTER, EXIT];
  }
}
