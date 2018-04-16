import {State, StateMachine, ENTER, EXIT, TOP_STATE_NAME} from "../src/marty";

const TurnOn : number = 0;
const TurnOff : number = 1;
const TurnRed : number = 2;
const TurnYellow : number = 3;
const TurnGreen : number = 4;
const Crash : number = 5;

class Top extends State {
    constructor() {
        super(TOP_STATE_NAME);
    }

    handle(event : number, payload?: any) : boolean {
        switch(event) {
            case Crash:
                this.crash();
                return true;

            case TurnOff:
                Logger.log("Emitting 'Off' event...");

                this.transition("Off");
                return true;
        }

        return false;
    }

    private crash() : void {
        Logger.log('Looks like someone hit the stoplight!');
        this.emit(TurnOff);
    }
}

class On extends State {
    _timer : any = null;

    constructor() {
        super("On", null, "Red");
    }

    handle(event : number, payload?: any) : boolean {
        switch(event) {
            case ENTER:
                Logger.log("Entering 'On' state...");

                this._timer = setTimeout(() => {
                    Logger.log("Emitting 'TurnOff' event...");
                    this.emit(TurnOff);
                }, 60000);

                Logger.log("Attempting to run for 60 seconds (unless I get hit)...", true);

                return true;

            case EXIT:
                Logger.log("Exiting 'On' state...");

                clearTimeout(this._timer);
                return true;
        }

        return false;
    }
}

class Red extends State {
    _timer : any = null;

    constructor() {
        super("Red", "On");
    }

    handle(event : number, payload?: any) : boolean {
        switch(event) {
            case ENTER:
                Logger.log("Entering 'Red' state...");

                this._timer = setTimeout(() => {
                    Logger.log("Emitting 'TurnGreen' event...");
                    this.emit(TurnGreen);
                }, 10000);

                Logger.log("Waiting 10 seconds...", true);

                return true;

            case TurnGreen:
                Logger.log("Transitioning to green...");

                this.transition("Green");
                return true;

            case EXIT:
                Logger.log("Exiting 'Red' state...");

                clearTimeout(this._timer);
                return true;
        }

        return false;
    }
}

class Yellow extends State {
    _timer : any = null;

    constructor() {
        super("Yellow", "On");
    }

    handle(event : number, payload?: any) : boolean {
        switch(event) {
            case ENTER:
                Logger.log("Entering 'Yellow' state...");

                this._timer = setTimeout(() => {
                    Logger.log("Emitting 'TurnRed' event...");
                    this.handle(TurnRed);
                }, 5000);

                Logger.log("Waiting 5 seconds...", true);

                return true;

            case TurnRed:
                Logger.log("Transitioning to red...");

                this.transition("Red");
                return true;

            case EXIT:
                Logger.log("Exiting 'Yellow' state...");

                clearTimeout(this._timer);
                return true;
        }

        return false;
    }
}

class Green extends State {
    _timer : any = null;

    constructor() {
        super("Green", "On");
    }

    handle(event : number, payload?: any) : boolean {
        switch(event) {
            case ENTER:
                Logger.log("Entering 'Green' state...");

                this._timer = setTimeout(() => {
                    Logger.log("Emitting 'TurnRed' event...");
                    this.handle(TurnRed);
                }, 10000);

                Logger.log("Waiting 10 seconds...", true);

                return true;

            case TurnYellow:
                Logger.log("Transitioning to 'Yellow' state...");

                this.transition("Yellow");
                return true;

            case TurnRed:
                Logger.log("Oops!  Can't turn red before turning yellow!");
                Logger.log("Emitting 'TurnYellow' event...");
                this.handle(TurnYellow);
                return true;

            case EXIT:
                Logger.log("Exiting 'Green' state...");

                clearTimeout(this._timer);
                return true;
        }

        return false;
    }
}

class Off extends State {
    constructor() {
        super("Off");
    }

    handle(event : number, payload?: any) : boolean {
        switch(event) {
            case ENTER:
                Logger.log("Entering 'Off' state...");
                return true;

            case TurnOn:
                Logger.log("Transitioning to on...");

                this.transition("On");
                return true;

            case TurnOff:
                Logger.log("I am already off.");
                return true;

            case EXIT:
                Logger.log("Exiting 'Off' state...");
                return true;
        }

        return false;
    }
}

class StoplightStateMachine extends StateMachine {
    private _on : On = new On();
    private _red : Red = new Red();
    private _yellow : Yellow = new Yellow();
    private _green : Green = new Green();
    private _off : Off = new Off();

    constructor() {
        super(1, new Top(), "Off");

        this.registerStates(this._on, this._red, this._yellow, this._green, this._off);

        this.registerEvents(TurnOn, TurnOff, TurnRed, TurnYellow, TurnGreen, Crash);
    }
}

module Logger {

    export function log(message : string, isolate : Boolean = false) {
        let br1 = document.createElement('br');
        let br2 = document.createElement('br');
        let elem = document.createElement('div');

        elem.textContent = message;

        if (isolate) {
            document
                .body
                .appendChild(br1);
        }

        document
            .body
            .appendChild(elem);

        if (isolate) {
            document
                .body
                .appendChild(br2);
        }

        console.log(message);
    }
}

export {StoplightStateMachine, TurnOn, Crash}
