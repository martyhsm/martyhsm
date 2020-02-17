/**
 *
 * Handles transitions.
 *
 * Defines an interface for handling transitions.
 *
 * @interface ITransitionHandler
 */
interface ITransitionHandler {
  (to: string): void;
}

export { ITransitionHandler };
