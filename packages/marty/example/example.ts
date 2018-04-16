import { StoplightStateMachine, TurnOn, Crash } from './stoplight'

const testObject: StoplightStateMachine = new StoplightStateMachine();

testObject.initialize();

testObject.handle(TurnOn);

// A random crash will happen some time between [12, 45] seconds.
setTimeout(() => {
    testObject.handle(Crash);
}, Math.random() * (45000 - 12000) + 12000);
