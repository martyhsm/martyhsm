/**
 * Defines an interface for handling events.
 *
 * @interface IEventHandler
 */
interface IEventHandler {
  /**
   *
   * Handles events.
   *
   * @param {number} event Specifies event ID to handle.
   * @param {*} [payload] Specifies payload of event.
   * @returns {boolean} Indicates whether the event was handled.
   *
   * @memberOf IEventHandler
   */
  handle(event: number, payload?: any): boolean;
}

export { IEventHandler };
