# Marty
This is an implementation of a hierarchical state machine (HSM) or a statechart with a few new features like:
- instruction queuing
- event payloads
- "parallel" state machines

## New Terminology
- **Emitted Events**: internal events that are sent to a state machine by one of its states to be handled; all other events are external and sent to a state machine by the user's code to be handled

- **"Parallel" State Machines**: child state machines that handle the same external/internal events as its host state machine; they can have events of their own, but they cannot collide with host events

- **Event Payloads**: metadata sent along with an event that is needed to process the event

- **Instruction**: a directive that needs to be fulfilled by the state machine; currently, these are just events and transitions. generalizing them makes them easier to queue.

- **Instruction Queue**: queues instructions so that fewer events are dropped in case of multiple threads

## Usage
### Updating the code in this repo
If you plan to make changes to the code, then here are some steps to get your started in building and testing the code.
#### Installing
```shell
yarn
```
or 
```shell
npm install
```
#### Building
```shell
npm run build
```
#### Testing
```shell
npm run test
```
***NOTE*: Test code is lacking at the moment, but feel free to add!**

#### Including in browser
```html
<script src="~/dist/marty.js"></script>
```

#### Running example
Open the included ./example/index.html file in a browser, open dev tools, and look at the logged messages in the console.
The example is the same as the one below with logged messages to indicate what's happening.
Here is an example of the output (NOTE: the output is random, so yours could look different):

![alt tag](https://github.com/martyhsm/martyhsm/blob/master/images/example_output.PNG)

### Creating an HSM
In this example, we'll just make a state machine for an autonomous stoplight that is set to run for 60 seconds. It will iterate through red, yellow, and great lights. Randomly, someone will crash into the stop light OR it will go off naturally. Here's a diagram:

![alt tag](https://github.com/martyhsm/martyhsm/blob/master/images/stoplight.png)

#### Create some events for your state machine.
```typescript
const TurnOn: number = 0;
const TurnRed: number = 1;
const TurnYellow: number = 2;
const TurnGreen: number = 3;
const TurnOff: number = 4;
const Crash: number = 5;
```
#### Create some states for your state machine.
```typescript
class Top extends State {
    constructor() {
        super(TOP_STATE_NAME);
    }
    
    handle(event: number, payload?: any): boolean {
        switch(event) {
            case Crash:
                this.crash();                
                return true;

            case TurnOff:
                this.transition("Off");
                return true;
        }
        
        return false;
    }
    
    // We can create actions to call on events; this keeps code modular and clean.
    private crash(): void {
        console.log('Oh no! Someone crashed into the stoplight!');
        this.emit(TurnOff);
    }
}

class On extends State {
    _timer: any = null;

    constructor() {
        super("On", null, "Red"); // Parent and start states are set in constructor (if needed).
    }

    handle(event: number, payload?: any): boolean {
        switch (event) {
            case ENTER:
                this._timer = setTimeout(() => {                    
                    this.emit(TurnOff); // Internal events are thrown using the 'emit' function.
                }, 60000);
                return true;

            case TurnOff:
                this.transition("Off");
                return true;

            case EXIT:
                clearTimeout(this._timer);
                return true;
        }

        return false;
    }
}

class Red extends State {
    _timer: any = null;

    constructor() {
        super("Red", "On");
    }

    handle(event: number, payload?: any): boolean {
        switch (event) {
            case ENTER:
                this._timer = setTimeout(() => { 
                    this.emit(TurnGreen); 
                }, 10000);
                return true;

            case TurnGreen:
                this.transition("Green"); // Transitions can be queued using the 'transition' function.
                return true;

            case EXIT:
                clearTimeout(this._timer);
                return true;
        }

        return false;
    }
}

class Yellow extends State {
    _timer: any = null;

    constructor() {
        super("Yellow", "On");
    }

    handle(event: number, payload?: any): boolean {
        switch (event) {
            case ENTER:
                this._timer = setTimeout(() => {                 
                    this.handle(TurnRed); 
                }, 5000);
                return true;

            case TurnRed:
                this.transition("Red");
                return true;

            case EXIT:
                clearTimeout(this._timer);
                return true;
        }

        return false;
    }
}

class Green extends State {
    _timer: any = null;

    constructor() {
        super("Green", "On");
    }

    handle(event: number, payload?: any): boolean {
        switch (event) {
            case ENTER:
                this._timer = setTimeout(() => {                 
                    this.handle(TurnYellow); 
                }, 10000);
                return true;

            case TurnYellow:
                this.transition("Yellow");
                return true;

            case TurnRed:           
                this.handle(TurnYellow);
                return true;

            case EXIT:
                clearTimeout(this._timer);
                return true;
        }

        return false;
    }
}

class Off extends State {
    constructor() {
        super("Off"); // States that don't specify a parent will be assigned top as a parent automatically.
    }


    handle(event: number, payload?: any): boolean {
        // Notice states do not have to handle ENTER/EXIT events if there are no actions on them.
        switch (event) {
            case TurnOn:
                this.transition("On");
                return true;

            // Preventing "TurnOff" event from being being propogated upward when state machine is already
            // if "Off" state.
            case TurnOff:
                return true;
        }

        return false;
    }
}

```
#### Create and wire up your state machine.
```typescript
class StoplightStateMachine extends StateMachine {
    private _on: On = new On();
    private _red: Red = new Red();
    private _yellow: Yellow = new Yellow();
    private _green: Green = new Green();
    private _off: Off = new Off();

    constructor() {
        super(1, new Top(), "Off"); // Notice a queue capacity of 1 and a custom top state.

        this.registerStates(
            this._on, 
            this._red, 
            this._yellow, 
            this._green, 
            this._off);

        this.registerEvents(
            TurnOn, 
            TurnOff, 
            TurnRed, 
            TurnYellow, 
            TurnGreen,
            Crash);
    }
}
```
#### Use your state machine.
```typescript
const stoplightStateMachine = new StoplightStateMachine();

stoplightStateMachine.initialize();

stoplightStateMachine.handle(TurnOn);

// A random crash will happen some time between [30, 60] seconds; this is an external event.
setTimeout(() => {
    stoplightStateMachine.handle(Crash);
}, Math.random() * (60000 - 30000) + 30000);
```
## Dependencies
This project uses:
- NPM
- Typescript
- Gulp
- Babel

## Remaining Work
Though this should be good to use, the following things still need to be done to improve the quality of this repo and source code:
- Refactor any areas that are hard to understand
- Create tests (unit, performance, e2e, etc.)
- Remove dead code and unused frameworks/libraries
- Look for more opportunites to use es2015+ features
- Get source onto bower and other platforms
- Add Top state error checks (i.e. no parents, no explicit children, etc.)
- Named events vs. IDs?
- Non-inherited states? (Possibly pass in an event handler function? Does this impact "this" reference?). For instance:

    ```typecript
    function handle(event: number, payload?: any) {
        switch(event) {
            ...
        }

        return false;
    }

    let state = new State("name", handle, "parent", "start");
    ```
- Add more obscure error checks like setting a parent as a child.
- Determine if parallel state machines should be allowed to have a custom top state or how to protect it from being same as the host state machine
