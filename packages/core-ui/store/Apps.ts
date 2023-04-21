import { types } from 'mobx-state-tree';

export const ApplicationBase = types.model('AppBase', {
  id: types.number,
  logo: types.string,
  name: types.string,
  slug: types.string,
});

export const Applications = types
  .model('Apps', {
    apps: types.optional(types.array(ApplicationBase), []),
    selectedAppId: types.maybeNull(types.number),
  })
  .actions((self) => ({
    log: () => console.log(self),
    setApps(apps) {
      self.apps = apps;
    },
    setSelectedApp(appId) {
      if (typeof appId === 'string') appId = Number(appId);
      self.selectedAppId = appId;
    },
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
  }))
  .views((self) => ({
    get selectedApp() {
      return self.apps.find((app) => app.id === self.selectedAppId);
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
