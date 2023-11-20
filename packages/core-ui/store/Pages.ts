import { types } from 'mobx-state-tree';

export const PageBase = types.model('PageBase', {
  id: types.number,
  icon: types.string,
  name: types.string,
  slug: types.string,
  serviceId: types.number,
});

export const Pages = types
  .model('Pages', {
    pages: types.optional(types.array(PageBase), []),
    selectedPageId: types.maybeNull(types.number),
  })
  .actions((self) => ({
    log: () => console.log(self),
    setPages(pages) {
      self.pages = pages;
    },
    setSelectedPage(page) {
      if (typeof page === 'string') page = Number(page);
      self.selectedPageId = page;
    },
  }))
  .views((self) => ({
    get selectedApp() {
      return self.pages.find((app) => app.id === self.selectedPageId);
    },
  }));
