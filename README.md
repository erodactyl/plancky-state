# A state management library with built-in effects support

Handling asyncronosities has always been a pain in state management libraries. Even with redux middleware like thunk it's still hard to work with async event listeners and clean them up in a safe way. I decided to create a new state management library that can handle effects inherently. You can find my thought process of creating the package in this article [Building a React state management library with built in effects support](https://itnext.io/building-a-react-state-management-library-with-built-in-effects-support-36c5f5358dc2).


## Basic example
```js
import createStore from '@plancky/state';

const store = createStore(
  { username: 'Erik' },
  ({ setState }) => ({
    setUsername: (username) => {
      setState(s => ({ username }));
    }
  })
);

store.subscribe(() => {
  console.log(store.getState());
});

store.setUseranem('George'); // Logs { username: "George" }
```

## Advanced example
```js
import createStore from '@plancky/state';

const store = createStore(
  { messages: [] },
  ({ setState, addEffect, removeEffect }) => ({
    startChat: () => {
      addEffect('my_chat', () => {
        const intRef = setInterval(() => {
          setState(s => ({ messages: [...s.messages, 'new_msg']}));
        }, 1000);
        return () => clearInterval(intRef);
      });
    },
    stopChat: () => {
      removeEffect('my_chat');
    }
  })
);

store.actions.startChat(); // The state will be update with an additional message every second

// ... some time later ...

store.actions.stopChat(); // The store will no longer be updated by the effect
```

## API

### createStore
The createStore function takes 2 arguments. The first argument is the initial state of the store. The second argument is a function to initialize your actions. This function gets passed an object with properties getState, setState, addAction and removeAction. createStore returns a store object.

### getState
getState is a function which gets the current state of the store. It can either be called with store.getState or in an acttion with the utility properties provided to the action creator function (2nd argument of createStore).

### setState
setState is a function which changes the state and informs all the listeners about the change. It can ither be called with store.setState or in an action with the utility properties provided to the action creator function (2nd argument of createStore).

### addEffect
addEffect is the idiomatic way to create effects in @plancky/state. It takes 2 arguments - the id of the effect, and the effect itself. An effect is a funtion which starts an async task (event listener, setInterval, etc.) and returns a cleanup function. For example:
```js
addEffect('my_effect', () => {
  const intRef = setInterval(() => {
    console.log('hello');
  }, 1000);
  return () => clearInterval(intRef);
});
```
Now the effect with id "my_effect" will be initialized and "hello" will be logged every second. The addEffect funciton can be called with store.addEffect or in an action with the utility properties provided to the action creator function (2nd argument of createStore).

If you attempt to create an effect with the same id - an error will be thrown.

### removeEffect
removeEffect cleans up an already initialized effect with it's id. Following up on the previous example:
```js
removeEffect('my_effect');
```
Now the effect with id "my_effect" is cleaned up. "hello" will no longer be logged to the console. The removeEffect funciton can be called with store.removeEffect or in an action with the utility properties provided to the action creator function (2nd argument of createStore).

### store.actions
store.actions is the object containing all the actions returned from the action creator function (2nd argument of createStore).

### store.subscribe
store.subscribe takes a callback which is called every time the store is changes (by setState). Hook into store.subscribe to react to state changes.