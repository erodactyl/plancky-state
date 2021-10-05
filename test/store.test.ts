import createStore from '../src';

const sleep = (miliseconds: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, miliseconds);
  });
};

interface State {
  messages: string[];
}

interface Actions {
  addMessage: (body: string) => void;
  addEffectAction: (effect: () => () => void) => void;
  removeEffectAction: () => void;
}

const createTestStore = () => {
  return createStore<State, Actions>(
    {
      messages: ['hello']
    },
    ({ setState, addEffect, removeEffect }) => ({
      addMessage: (body) => setState((s) => ({ messages: [...s.messages, body] })),
      addEffectAction: (effect) => {
        addEffect('effect', effect);
      },
      removeEffectAction: () => {
        removeEffect('effect');
      }
    }));
};

it('Creates store with initial state and sets state with an action', () => {
  const store = createTestStore();

  expect(store.getState().messages).toStrictEqual(['hello']);
  store.actions.addMessage('hi');
  expect(store.getState().messages).toStrictEqual(['hello', 'hi']);
});

it('Adds and removes effects', async () => {
  const store = createTestStore();
  const fn = jest.fn();
  const effect = () => {
    const intervalRef = setInterval(() => {
      fn();
    }, 100);
    return () => clearInterval(intervalRef);
  };
  store.actions.addEffectAction(effect);

  await sleep(250);

  expect(fn).toBeCalledTimes(2);

  store.actions.removeEffectAction();

  await sleep(250);
  expect(fn).toBeCalledTimes(2);
});

it('Calls the subscriber when setState is called', () => {
  const store = createTestStore();
  const listener = jest.fn();

  store.subscribe(() => {
    listener(store.getState().messages);
  });

  store.actions.addMessage('hi');
  expect(listener).toBeCalledTimes(1);
  store.actions.addMessage('bye');
  expect(listener).toBeCalledTimes(2);
  expect(listener).toHaveBeenLastCalledWith(['hello', 'hi', 'bye']);
});
