import { graphql } from 'msw';
const github = graphql.link('http://localhost:4000/graphql');
export const handlers = [
  graphql.mutation('Counter', null),
  github.query('allServices', (req, res, ctx) => {
    return res(
      ctx.data({
        allServices: [
          {
            id: 1,
            name: 'HR',
            logo: 'https://via.placeholder.com/150',
            slug: 'hr',
          },
          {
            id: 2,
            name: 'Sales',
            logo: 'https://via.placeholder.com/150',
            slug: 'sales',
          },
          {
            id: 3,
            name: 'Service',
            logo: 'https://via.placeholder.com/150',
            slug: 'service',
          },
          {
            id: 4,
            name: 'Finance',
            logo: 'https://via.placeholder.com/150',
            slug: 'finance',
          },
        ],
      })
    );
  }),
  github.query('allPagesByService', (req, res, ctx) => {
    const allPages = [
      {
        id: 1,
        name: 'HR Page 1',
        icon: 'https://via.placeholder.com/150',
        slug: 'hr-1',
        serviceId: 1,
      },
      {
        id: 2,
        name: 'HR Page 2',
        icon: 'https://via.placeholder.com/150',
        slug: 'hr-2',
        serviceId: 1,
      },
      {
        id: 3,
        name: 'Sales Page 1',
        icon: 'https://via.placeholder.com/150',
        slug: 'sales-1',
        serviceId: 2,
      },
      {
        id: 4,
        name: 'Sales Page 2',
        icon: 'https://via.placeholder.com/150',
        slug: 'sales-2',
        serviceId: 2,
      },
      {
        id: 5,
        name: 'Sales Page 3',
        icon: 'https://via.placeholder.com/150',
        slug: 'sales-3',
        serviceId: 2,
      },
    ];
    return res(
      ctx.data({
        allPagesByService: allPages.filter(
          (page) => page.serviceId === req.variables.service
        ),
      })
    );
  }),
];
