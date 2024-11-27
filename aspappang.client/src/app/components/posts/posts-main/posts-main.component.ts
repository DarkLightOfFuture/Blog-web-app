import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../../../models/post';
import { ItemService } from '../../../services/item/item.service';
import { ArrayDisplay } from '../../../models/arrayDisplay';
import { HttpClient } from '@angular/common/http';
import { ChildDisplay } from '../../../models/childDisplay';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-posts-main',
  templateUrl: './posts-main.component.html',
  styleUrl: './posts-main.component.css'
})
export class PostsMainComponent {
  public posts = new ArrayDisplay<ChildDisplay<Post>[]>();
  public arr = Array(10);
  private postService: ItemService<Post> | null = null;

  constructor(private http: HttpClient, private titleService: Title) {
    this.titleService.setTitle("Blog");
  }

  ngOnInit() {
    this.postService = new ItemService<Post>(this.http, "post", this);
    this.posts = this.postService.items;

    this.postService?.getItems();
  }
}
