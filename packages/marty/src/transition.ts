import { Instruction } from './instruction';
import { InstructionTypes } from './instructionTypes';
import { trim } from 'lodash';

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

    if (!this.state || !trim(this.state)) {
      throw new Error(
        'A transition requires a valid state name to be specified.'
      );
    }
  }
}

export { Transition };
