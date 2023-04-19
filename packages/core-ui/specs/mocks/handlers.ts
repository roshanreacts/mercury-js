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
];
