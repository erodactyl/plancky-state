import { StatefulNotifier } from './stateful_notifier';

type Cleanup = () => void;
type Effect = () => Cleanup;

export class EffectiveStatefulNotifier<S> extends StatefulNotifier<S> {
  private effectCleaups = new Map<string, Cleanup>()

  addEffect = (id: string, effect: Effect): Cleanup => {
    if (!this.effectCleaups.has(id)) {
      const cleanup = effect();
      this.effectCleaups.set(id, cleanup);
      return () => this.removeEffect(id);
    }
    throw new Error(`Effect with id ${id} is already running`);
  }

  removeEffect = (id: string): boolean => {
    const cleanup = this.effectCleaups.get(id);
    cleanup?.();
    return this.effectCleaups.delete(id);
  }
}
