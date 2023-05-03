import { useMemo } from 'react';
import { types, applySnapshot, onSnapshot } from 'mobx-state-tree';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Applications } from './Apps';
import { Pages } from './Pages';
import localForage from 'localforage';

let store;
export const client = new ApolloClient({
  ssrMode: true,
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

export const RootStore = types.model('RootStore', {
  applications: types.maybeNull(Applications),
  pages: types.maybeNull(Pages),
});

export const persist = (name, store, options) => {
  let { storage, jsonify } = options;

  onSnapshot(store, (_snapshot: any) => {
    const snapshot = { ..._snapshot };
    const data = !jsonify ? snapshot : JSON.stringify(snapshot);
    storage.setItem(name, data);
  });

  return storage.getItem(name).then((data) => {
    const snapshot = !jsonify ? data : JSON.parse(data);
    applySnapshot(store, snapshot);
  });
};

export function initializeStore(snapshot = null) {
  const _store =
    store ??
    RootStore.create({
      applications: {
        apps: [],
      },
      pages: {
        pages: [],
      },
    });

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.js` and `pages/ssr.js` for more details
  if (snapshot) {
    applySnapshot(_store, snapshot);
  }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;
  persist('RootStore', store, {
    storage: localForage, // default: localStorage
    jsonify: true,
  }).then(() => console.log('someStore has been hydrated'));
  return store;
}

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
