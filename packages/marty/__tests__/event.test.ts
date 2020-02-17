import { Event } from '../src/event';
import { Instruction } from '../src/instruction';
import { ENTER, EXIT } from '../src/constants';
import { isEqual } from 'lodash';

describe('Event', () => {
  let event: Event = new Event(1);

  it('is an instruction.', () => {
    expect(event).toBeInstanceOf(Instruction);
  });

  it('has an id', () => {
    expect(event.id).toBe(1);
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
});
