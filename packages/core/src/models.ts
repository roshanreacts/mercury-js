export class Model {
  private name: string;
  constructor(name: string) {
    this.name = name;
    console.log('DB created', name);
  }
  public create() {
    console.log('Record created', this.name);
  }
}
