type Listener = () => void;
type Cleanup = () => void;

export class Notifier {
  private listeners = new Set<Listener>()

  subscribe = (subscriber: Listener): Cleanup => {
    this.listeners.add(subscriber);
    return () => {
      this.listeners.delete(subscriber);
    };
  }

  protected notify = (): void => {
    this.listeners.forEach(s => s());
  }
}
