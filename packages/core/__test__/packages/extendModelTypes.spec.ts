import { extendModelTypes } from '../../src/packages/extendModelTypes';

describe('extendModelTypes', () => {
  it('should add a field to the schema', () => {
    const mercury = {
      createPreHook: jest.fn(),
      schema: {},
    };
    const definition = `
        extend type User {
            firstName: String
        }
        `;
    const skipModels = ['User'];
    const done = jest.fn();
    extendModelTypes({ definition, skipModels })(mercury as any);
    expect(mercury.createPreHook).toHaveBeenCalledWith(
      'BEFORE_CREATELIST',
      expect.any(Function)
    );
    const [hookName, hookFn] = mercury.createPreHook.mock.calls[0];
    expect(hookName).toBe('BEFORE_CREATELIST');
    hookFn.call({ name: 'User' }, done);
    expect(mercury.schema).toEqual({
      extendType: [
        {
          type: 'User',
          definition,
        },
      ],
    });
    expect(done).toHaveBeenCalled();
  });
  it('should skip a model', () => {
    const mercury = {
      createPreHook: jest.fn(),
      schema: {},
    };
    const definition = `
        extend type User {
            firstName: String
        }
        `;
    const skipModels = ['User'];
    const done = jest.fn();
    extendModelTypes({ definition, skipModels })(mercury as any);
    expect(mercury.createPreHook).toHaveBeenCalledWith(
      'BEFORE_CREATELIST',
      expect.any(Function)
    );
    const [hookName, hookFn] = mercury.createPreHook.mock.calls[0];
    expect(hookName).toBe('BEFORE_CREATELIST');
    hookFn.call({ name: 'User' }, done);
    expect(mercury.schema).toEqual({
      extendType: [
        {
          type: 'User',
          definition,
        },
      ],
    });
    expect(done).toHaveBeenCalled();
  });
});
