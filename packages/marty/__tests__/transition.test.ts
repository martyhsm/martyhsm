import { Transition } from '../src/transition';
import { Instruction } from '../src/instruction';
import { InstructionTypes } from '../src/instructionTypes';

describe('A transition', () => {
  const transition = new Transition('a state');

  it('is an instruction.', () => {
    expect(transition).toBeInstanceOf(Instruction);
  });

  it('has a type property.', () => {
    expect(transition.type).toEqual(InstructionTypes.Transition);
  });

  it('it requires a state name to be specified.', () => {
    expect(() => {
      new Transition('');
    }).toThrow();
    expect(() => {
      new Transition(' ');
    }).toThrow();
    expect(() => {
      new Transition(null);
    }).toThrow();
    expect(() => {
      new Transition(undefined);
    }).toThrow();
  });
});
