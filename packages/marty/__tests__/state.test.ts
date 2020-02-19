import { State } from '../src/state';
import { Subject } from 'rxjs';

describe('State', () => {
  it('must be instantiated with a valid name.', () => {
    expect(() => new State('')).toThrow();
    expect(() => new State(' ')).toThrow();
    expect(() => new State(null)).toThrow();
    expect(() => new State(undefined)).toThrow();

    expect(() => new State('a state')).not.toThrow();
  });

  const stateName = 'a state';

  const consoleDebugSpy = jest.spyOn(global.console, 'debug');

  let grandParent: State = new State('parent');
  let parent: State = new State('parent', grandParent);
  let child: State = new State('child');
  let sibling: State = new State('sibling', parent);
  let descendant: State = new State('descendant', child);
  let cousin: State = new State('cousin');
  let uncle: State = new State('uncle', grandParent);
  let aunt: State = new State('aunt', grandParent);
  let stranger: State = new State('stranger');
  let state: State = new State(stateName);
  let subject: Subject<Event> = new Subject<Event>();

  describe('has a name.', () => {
    expect(state.name).toEqual(stateName);
  });

  describe('by default', () => {
    it('cannot transition', () => {
      expect(state.canTransition).toBe(false);
    });

    it('has no parent state', () => {
      expect(state.parentState).toBeFalsy();
    });

    it('has no start state', () => {
      expect(state.startState).toBeFalsy();
    });

    it('has no children', () => {
      expect(state.getChildren()).toHaveLength(0);
      expect(state.hasChildren()).toBe(false);
    });

    it('has no siblings', () => {
      expect(state.getSiblings()).toHaveLength(0);
    });

    it('has no ancestors', () => {
      expect(state.getAncestors()).toHaveLength(0);
    });

    it('has no descendants', () => {
      expect(state.getDescendants()).toHaveLength(0);
    });
  });

  describe('can check for equality using equals()', () => {
    it('will succeed if a state (or state name) is valid and matches the current state.', () => {
      expect(state.equals(state)).toBe(true);
      expect(state.equals(new State(stateName))).toBe(true);
      expect(state.equals(state.name)).toBe(true);
    });

    it('will fail does not match current state.', () => {
      expect(state.equals(stranger)).toBe(false);
      expect(state.equals(stranger)).toBe(false);
    });

    it('will throw an error if state is invalid.', () => {
      expect(() => state.equals('')).toThrow();
      expect(() => state.equals(' ')).toThrow();
      expect(() => state.equals(null)).toThrow();
      expect(() => state.equals(undefined)).toThrow();
    });
  });

  describe('can have a parent State', () => {
    beforeEach(() => {
      state = new State(stateName, parent);
    });

    it('will have an updated parentState property.', () => {
      expect(state.parentState).toBe(parent.name);
    });

    it('can check if a state is a parent using isParent()', () => {
      expect(state.isParent(parent)).toBe(true);
    });
  });

  describe('can have a start State', () => {
    beforeEach(() => {
      state = new State(stateName, null, child);
    });

    it('will have an updated startState property.', () => {
      expect(state.startState).toBe(child.name);
    });
  });

  describe('can have children', () => {
    beforeEach(() => {
      state.addChildren(child);
    });

    it('will have an updated children property.', () => {
      expect(state.getChildren()).toContain(child.name);
    });

    it('can check if a state is a child using isChild()', () => {
      expect(state.hasChildren()).toBe(true);
      expect(state.isChild(child)).toBe(true);
    });
  });
});
