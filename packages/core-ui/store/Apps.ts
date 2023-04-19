import { types } from 'mobx-state-tree';

export const Apps = types
  .model('Apps', {
    id: types.number,
    logo: types.string,
    name: types.string,
    slug: types.string,
  })
  .actions((self) => ({
    log: () => console.log(self),
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
