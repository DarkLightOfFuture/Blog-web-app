import { IModel } from "./model.interface";
import { User } from "./user";

export class Comment implements IModel {
  public postId: string | null = null;

  constructor(
    public id: number,
    public content: string,
    public pubDate: string,
    public user: User,
    public canReport: boolean,
    public canDelete: boolean,
    public openedOptions: boolean,
  ) { }
}
