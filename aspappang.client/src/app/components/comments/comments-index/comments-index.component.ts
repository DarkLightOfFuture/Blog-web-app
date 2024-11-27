import { Component, ElementRef, QueryList, ViewChildren, inject } from '@angular/core';
import { Comment } from '../../../models/comment';
import { ArrayDisplay } from '../../../models/arrayDisplay';
import { ChildDisplay } from '../../../models/childDisplay';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ItemService } from '../../../services/item/item.service';
import { HttpClient } from '@angular/common/http';
import { alertAnimation, height, rotateBtn } from '../../../animations/animations';
import { Title } from '@angular/platform-browser';
import { debounceTime, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-comments-index',
  templateUrl: './comments-index.component.html',
  styleUrl: '../../../styles/items-index.component.css',
  animations: [
    rotateBtn, height, alertAnimation
  ]
})
export class CommentsIndexComponent {
  public comments = new ArrayDisplay<ChildDisplay<Comment>[]>();
  public commentService: ItemService<Comment> | null = null;

  @ViewChildren("items") items!: QueryList<ElementRef>;

  public choice = "id";
  public searchRow = new FormControl();

  private dialog: MatDialog = inject(MatDialog);

  constructor(private http: HttpClient, private titleService: Title) {
    this.titleService.setTitle("Comments Index");

    this.searchRow.valueChanges.pipe(debounceTime(400), switchMap((val: string) => val ?
      of(this.commentService?.getItems(this.choice == "postid" ? val + "~" : val, this.choice)) : of(this.commentService?.getItems("null", "null")))).subscribe();
  }

  ngOnInit() {
    this.commentService = new ItemService<Comment>(this.http, "comment", this, this.dialog);
    this.comments = this.commentService.items;

    this.commentService.getItems("null", "null");
  }
}
