// @ts-ignore
import Kareem from 'kareem';

// Define a class for a hook
class Hook {
  // Create a new instance of Kareem for handling hooks
  private kareemHookInstance = new Kareem();

  // Add a function to be executed before a hook
  public before = (type: keyof THookType, fn: Function) => {
    this.kareemHookInstance.pre(type, fn);
  };

  // Add a function to be executed after a hook
  public after = (type: keyof THookType, fn: Function) => {
    this.kareemHookInstance.post(type, fn);
  };

  // Execute all functions added to be executed before a hook
  public execBefore = (type: keyof THookType, ...args: any) => {
    this.kareemHookInstance.execPre(type, ...args);
  };

  // Execute all functions added to be executed after a hook
  public execAfter = (type: keyof THookType, ...args: any) => {
    this.kareemHookInstance.execPost(type, ...args);
  };
}

// Export an instance of the Hook class
export const hook = new Hook();
