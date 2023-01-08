export class Email {
  public readonly value: string;

  constructor(parameters: { email: string }) {
    this.value = parameters.email.toLocaleLowerCase().trim();
    Object.freeze(this);
  }
}
