import { IModel } from "./model.interface";

export class Tag implements IModel {
  constructor(
    public id: number,
    public name: string,
    public count: number,
    public isChosen = false,
  ) { }
}
