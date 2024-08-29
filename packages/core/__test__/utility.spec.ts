import { whereInputCompose, whereInputMap } from '../src/utility';
import { TFields } from '../types';
describe('Utility', () => {
  it('whereInputCompose', () => {
    const input = {
      AND: [
        {
          name: {
            is: 'test',
          },
        },
        {
          name: {
            contains: 'tes',
          },
        },
        {
          name: {
            is: 'test',
          },
        },
      ],
    };
    const modelFields: TFields = {
      name: {
        type: 'string',
      },
    };
    const result = whereInputCompose(input, modelFields);
    expect(result).toEqual({
      $and: [
        {
          name: {
            $eq: 'test',
          },
        },
        {
          name: {
            $regex: 'tes',
            $options: 'i',
          },
        },
        {
          name: {
            $eq: 'test',
          },
        },
      ],
    });
  });
  it('whereInputCompose without and', () => {
    const input = {
      id: {
        is: '123',
      },
      name: {
        is: 'test',
      },
    };
    const modelFields: TFields = {
      name: {
        type: 'string',
      },
    };
    const result = whereInputCompose(input, modelFields);
    expect(result).toEqual({
      _id: {
        $eq: '123',
      },
      name: {
        $eq: 'test',
      },
    });
  });
  it('whereInputMap', () => {
    const input = {
      id: {
        is: '123',
      },
      name: {
        is: 'test',
      },
    };
    const modelFields: TFields = {
      name: {
        type: 'string',
      },
    };
    const result = whereInputMap(input, modelFields);
    expect(result).toEqual({
      _id: {
        $eq: '123',
      },
      name: {
        $eq: 'test',
      },
    });
  });
});
