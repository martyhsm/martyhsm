import { StoplightStateMachine, TurnOn, Crash } from './stoplight';

const testStateMachine: StoplightStateMachine = new StoplightStateMachine();

testStateMachine.initialize();

testStateMachine.handle(TurnOn);

// A random crash will happen some time between [5, 20] seconds.
setTimeout(() => {
  testStateMachine.handle(Crash);
}, Math.random() * (20000 - 5000) + 5000);
