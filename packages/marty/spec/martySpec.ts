"use strict";

import 'jasmine'
import { State, StateMachine, ENTER, EXIT } from "../src/marty";
import { StoplightStateMachine } from "../example/stoplight";

describe('stoplight.ts', () => {

    it ('contains a definition for "StoplightStateMachine".', () => {
        expect(StoplightStateMachine).toBeDefined();
    });

});

describe('StoplightStateMachine', () => {

    it ('can be instantiated.', () => {
        let testObject: StoplightStateMachine = new StoplightStateMachine();

        expect(testObject).toBeDefined();
    });
    
});
