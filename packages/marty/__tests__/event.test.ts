import { Event } from '../src/event';
import { Instruction } from '../src/instruction';
import { ENTER, EXIT } from '../src/constants';
import { isEqual } from 'lodash';
import { InstructionTypes } from '../src/instructionTypes';

describe('Event', () => {
  let event: Event = new Event(1);

  it('is an instruction.', () => {
    expect(event).toBeInstanceOf(Instruction);
  });

  it('has an id property.', () => {
    expect(event.id).toBe(1);
  });

  describe('id', () => {
    it('can be a string (named).', () => {
      const namedEvent = new Event('named event');

      expect(typeof namedEvent.id === 'string').toBeTruthy();
    });

    describe('that is a string', () => {
      it('must be a valid string.', () => {
        expect(() => {
          new Event('');
        }).toThrow();
        expect(() => {
          new Event(' ');
        }).toThrow();
        expect(() => {
          new Event(null);
        }).toThrow();
        expect(() => {
          new Event(undefined);
        }).toThrow();
      });
    });

    it('can be a number.', () => {
      expect(typeof event.id === 'number').toBeTruthy();
    });
  });

  it('has a type property.', () => {
    expect(event.type).toBe(InstructionTypes.Event);
  });

  it('has no payload by default.', () => {
    expect(event.payload).toBeUndefined();
  });

  it('can have a payload.', () => {
    event = new Event(1, {});

    expect(isEqual(event.payload, {})).toBeTruthy();
  });

  it('should not be an infrastructure event.', () => {
    expect(Event.isInfrastructureEvent(event.id)).toBeFalsy();
  });

  describe('can determine if an event is an infrastructure event.', () => {
    it('isInfrastructureEvent()', () => {
      expect(Event.isInfrastructureEvent(ENTER)).toBeTruthy();
      expect(Event.isInfrastructureEvent(EXIT)).toBeTruthy();
      expect(Event.isInfrastructureEvent(Number.MIN_SAFE_INTEGER)).toBeFalsy();
    });
  });

  describe('will be considered an infrastructure event if', () => {
    it('is an ENTER event.', () => {
      event = new Event(ENTER);

      expect(Event.isInfrastructureEvent(event.id)).toBeTruthy();
    });

    it('is an EXIT event.', () => {
      event = new Event(EXIT);

      expect(Event.isInfrastructureEvent(event.id)).toBeTruthy();
    });
  });

  it('can retrieve infrastructure events.', () => {
    const infrastructureEvents = Event.getInfrastructureEvents();

    expect(infrastructureEvents).toContain(ENTER);
    expect(infrastructureEvents).toContain(EXIT);
  });
});
