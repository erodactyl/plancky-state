import { Notifier } from './notifier';

export class StatefulNotifier<State> extends Notifier {
  constructor(private state: State) {
    super();
  }

  getState = (): State => this.state

  setState = (change: Partial<State> | ((state: State) => Partial<State>)): void => {
    const changed = change instanceof Function ? change(this.state) : change;
    this.state = { ...this.state, ...changed };
    this.notify();
  }
}
