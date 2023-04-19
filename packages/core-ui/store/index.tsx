import { useMemo } from 'react';
import { types, applySnapshot, flow } from 'mobx-state-tree';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import components from './componentWrapper';
import { Todo } from './Services';
import { Apps } from './Apps';

let store;
export const client = new ApolloClient({
  ssrMode: true,
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

export const TodoStore = types
  .model('TodoStore', {
    todos: types.array(Todo),
    apps: types.optional(types.array(Apps), []),
  })
  .views((self) => ({
    get unfinishedTodoCount() {
      return self.todos.filter((todo) => !todo.finished).length;
    },
  }))
  .volatile((self) => ({
    newTodoTitle: '',
  }))
  .actions((self) => ({
    // afterCreate: flow(function* afterCreate() {
    //   try {
    //     const { data } = yield client.query({
    //       query: gql`
    //         query allServices {
    //           allServices {
    //             id
    //             name
    //             logo
    //             slug
    //           }
    //         }
    //       `,
    //     });
    //     self.apps = data.allServices;
    //   } catch (error) {
    //     console.log('error', error.message);
    //   }
    // }),
    setApps(apps) {
      self.apps = apps;
    },
    addTodo(title) {
      self.todos.push({ title });
    },
    handleChange(e) {
      self.newTodoTitle = e.target.value;
    },
    handleNewTodoClick(e) {
      self.addTodo(self.newTodoTitle);
      self.newTodoTitle = '';
    },
  }));
// .views((self) =>
//   components({
//     view() {
//       return (
//         <div>
//           <input value={self.newTodoTitle} onChange={self.handleChange} />
//           <button onClick={self.handleNewTodoClick}>Add</button>
//           <ul>
//             {self.todos.map((todo) => (
//               <todo.view key={todo.id} />
//             ))}
//           </ul>
//           Tasks left: {self.unfinishedTodoCount}
//         </div>
//       );
//     },
//     remainingTasks() {
//       return (
//         <ul>
//           {self.todos
//             .filter((todo) => !todo.finished)
//             .map((todo) => (
//               <li key={todo.id}>{todo.title}</li>
//             ))}
//         </ul>
//       );
//     },
//   })
// );

export function initializeStore(snapshot = null) {
  const _store =
    store ??
    TodoStore.create({
      todos: [
        {
          title: 'Get Coffee',
        },
        {
          title: 'Write simpler code',
        },
      ],
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

  return store;
}

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
