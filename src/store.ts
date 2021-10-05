import { EffectiveStatefulNotifier as ESN } from './effective_stateful_notifier';

interface Store<S, A> {
  getState: () => S;
  setState: (change: Partial<S> | ((state: S) => Partial<S>)) => void;
  addEffect: (id: string, effect: () => () => void) => () => void;
  removeEffect: (id: string) => boolean;
  subscribe: (listener: () => void) => void;
  actions: A;
}

type Api<S, A> =
  Pick<Store<S, A>, 'getState' | 'setState' | 'addEffect' | 'removeEffect'>
  & { getActions: () => A };

  type ActionsCreator<S, A> = (api: Api<S, A>) => A;

export const createStore = <S, A>(state: S, actionsCreator: ActionsCreator<S, A>): Store<S, A> => {
  const store = new ESN(state);

  const actions = actionsCreator({ ...store, getActions: () => actions });

  const { getState, setState, addEffect, removeEffect, subscribe } = store;

  return { getState, setState, addEffect, removeEffect, subscribe, actions };
};
