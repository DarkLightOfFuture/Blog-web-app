import { IModel } from "./model.interface";

export class ArrayDisplay<T> {
  public error: string | null = null;
  public isCreationForm = false;

  constructor(public array: T | null = null) { }
}
