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

- **Instruction Queue**: queues instructions so that fewer events are potentially dropped
