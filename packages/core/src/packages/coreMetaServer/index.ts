export const extendModelTypes = ({
  definition,
  skipModels,
}: {
  definition: string;
  skipModels?: Array<string>;
}) => {
  return (mercury: MercuryTBare): void => {
    mercury.createList('User', {
      fields: {
        name: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
      },
    });
  };
};
