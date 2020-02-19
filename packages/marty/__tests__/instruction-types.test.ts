import { InstructionTypes } from "../src/instructionTypes";

describe('InstructionTypes', () => {
    it ('currently supports two types.', () => {
        expect(Object.keys(InstructionTypes).length / 2).toBe(2);
    });

    it('contains one for events.', () => {
        expect(InstructionTypes.Event).toBeDefined();
    });

    it('contains one for transitions.', () => {
        expect(InstructionTypes.Transition).toBeDefined();
    });
})