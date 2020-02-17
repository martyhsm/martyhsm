import { Instruction } from './instruction';
import { InstructionTypes } from './instructionTypes';

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

export { Transition };
