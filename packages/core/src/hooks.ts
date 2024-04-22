// @ts-ignore
import Kareem from 'kareem';

// Define a class for a hook
export class Hook {
  // Create a new instance of Kareem for handling hooks
  private kareemHookInstance = new Kareem();

  // Add a function to be executed before a hook
  public before = (type: THookType, fn: Function) => {
    this.kareemHookInstance.pre(type, fn);
  };

  // Add a function to be executed after a hook
  public after = (type: THookType, fn: Function) => {
    this.kareemHookInstance.post(type, fn);
  };

  // Execute all functions added to be executed before a hook
  public execBefore = (type: THookType, ...args: any) => {
    this.kareemHookInstance.execPre.apply(type, args);
  };

  // Execute all functions added to be executed after a hook
  public execAfter = (type: THookType, ...args: any) => {
    this.kareemHookInstance.execPost.apply(type, args);
  };
}

// Export an instance of the Hook class
const hook = new Hook();
export default hook;
