import { types } from 'mobx-state-tree';
import * as React from 'react';
import components from './componentWrapper';

export const Todo = types
  .model('Todo', {
    id: types.optional(types.number, () => Math.random()),
    title: types.string,
    finished: false,
  })
  .actions((self) => ({
    toggle() {
      self.finished = !self.finished;
    },
  }));
// .views((self) =>
//   components({
//     view() {
//       return (
//         <li>
//           <input
//             type="checkbox"
//             checked={self.finished}
//             onChange={self.toggle}
//           />
//           {self.title}
//         </li>
//       );
//     },
//   })
// );
