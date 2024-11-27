import { IModel } from "./model.interface";

export class ChildDisplay<T extends IModel> {
  public error: string | null = null;
  public isEdited = false;
  public isLoading = false;
  public isOpened = false;
  public isOpened2 = false;
  public isNew = false;
  public toDelete = false;
  public startHeight: string | number = "*";
  public endHeight: string | number = "*";

  constructor(public content: T | null = null) { }
}
