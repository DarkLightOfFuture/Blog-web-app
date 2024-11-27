import { IModel } from "./model.interface";
import { Tag } from "./tag";

export class Post implements IModel {
  constructor(
    public id: string,
    public title: string,
    public thumbnail: string,
    public description: string,
    public pubDate: string,
    public rating: number,
    //comments:,
    public tags: Tag[],
    //public ratingChoices: ,
    public authorInfo: string,
    public authorId: string,
    //public author: Author,
    public areManyTags: boolean | null = null
  ) { }
}
