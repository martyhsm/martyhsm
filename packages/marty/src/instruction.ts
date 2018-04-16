import { InstructionTypes } from "./instructionTypes";

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
    protected constructor(public type : InstructionTypes) {}
}

export { Instruction }
