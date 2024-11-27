import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../../models/post';
import { Title } from '@angular/platform-browser';
import { ItemService } from '../../../services/item/item.service';
import { Comment } from '../../../models/comment';
import { ChildDisplay } from '../../../models/childDisplay';
import { ArrayDisplay } from '../../../models/arrayDisplay';
import { appear } from '../../../animations/animations';
import { createPubDate } from '../../../services/date';
import { CommentFormComponent } from '../../shared/comment-form/comment-form.component';
import { FormControl } from '@angular/forms';
import { User } from '../../../models/user';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../services/auth/auth.service.selectors';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewComponent } from '../../shared/image-preview/image-preview.component';
import { AlertService } from '../../../services/alert/alert.service';
import { IAlert } from '../../../models/alert';
import { ChangeTemplateService } from '../../../services/change-template/change-template.service';

interface ICommentResponse {
  comment: Comment;
  canReport: boolean;
  canDelete: boolean;
}

@Component({
  selector: 'app-show-post',
  templateUrl: './show-post.component.html',
  styleUrls: ['./show-post.component.css', '../../../styles/tags.css', '../../../styles/quill.core.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    appear
  ]
})
export class ShowPostComponent {
  public post: Post | null = null;
  public exists: boolean | null = null;

  public text = "";

  public isUpvote = false;
  public isDownvote = false;

  public orderArray = ["oldest", "latest"];

  public isHidden = true;

  public user: User | null = null;
  public commentService: ItemService<Comment> | null = null;
  public comments = new ArrayDisplay<ChildDisplay<Comment>[]>();
  @ViewChild(CommentFormComponent) commentForm!: CommentFormComponent;

  @ViewChild("description") public description!: ElementRef<HTMLElement>;
  @ViewChild(ImagePreviewComponent) public imagePreview!: ImagePreviewComponent;
  @ViewChild("commentSection") private commentSection!: ElementRef;

  private commentFunc = (items: ArrayDisplay<ChildDisplay<Comment>[]>, r: ICommentResponse[]) => {
    r = r.map(x => ({
      ...x,
      comment: {
        ...x.comment,
        pubDate: createPubDate(x.comment.pubDate), canDelete: x.canDelete, canReport: x.canReport
      }
    }));

    items.array = r.map(x => new ChildDisplay(x.comment));
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router,
      private titleService: Title, private store: Store<{ user: User }>, private dialog: MatDialog,
      private alertService: AlertService, private changeTemplateService: ChangeTemplateService) {
    this.store.select(selectUser).subscribe(val => this.user = val);

    document.body.addEventListener("click", () => {
      if (this.comments.array) {
        this.comments.array = this.comments.array.map(x => x.content?.openedOptions ?
          ({ ...x, content: { ...x.content as Comment, openedOptions: false } }) : x) 
      }
    });
  }

  //Gets post or in error displays not-found page.
  ngOnInit() {
    const id = this.route.snapshot.params["id"];
    const params = new HttpParams().set("id", id);

    this.http.get<{ post: Post, isLiked: boolean | null }>("/posts/api/show-post", { params: params, headers: { "e": [] } }).subscribe({
      next: (r: { post: Post, isLiked: boolean | null }) => {
        this.post = { ...r.post, pubDate: createPubDate(r.post.pubDate) };
        this.exists = true;

        if (r.isLiked != null) {
          if (r.isLiked) {
            this.isUpvote = true;
          }
          else {
            this.isDownvote = true;
          }
        }

        this.titleService.setTitle(this.post.title);

        setTimeout(() => {
          if (this.post) {
            this.text = this.post.description;
          }
        }, 0);

        setTimeout(() => {
          document.querySelectorAll('.ql-editor img, #thumbnail').forEach(x => {
            x.addEventListener("click", (event: Event) => {
              this.imagePreview.setSrc((<HTMLImageElement>event.target).src);
            });
          });
        }, 0);

        this.commentService = new ItemService<Comment>(this.http, "comment", null, this.dialog);
        this.comments = this.commentService.items;

        this.commentService.getItems<ICommentResponse>(this.post.id, "postId", undefined, 'ascending', this.commentFunc).add(() => {
          const progressBar = document.querySelector("#progressBar");

          progressBarAnimation(progressBar, this.commentSection.nativeElement);

          window.addEventListener("scroll", () => {
            progressBarAnimation(progressBar, this.commentSection.nativeElement);
          });

          function progressBarAnimation(progressBar: any, commentSection: HTMLElement) {
            const commentSectionHeight = parseFloat(window.getComputedStyle(commentSection).height);
            const bodyHeight = parseFloat(window.getComputedStyle(document.body).height);

            progressBar.style.width = `${(window.scrollY) / (bodyHeight - commentSectionHeight - window.innerHeight) * 100}%`;
          }
        });
      },
      error: () => {
        this.changeTemplateService.event.emit();
        this.exists = false;
      }
    });
  }

  private vote(value: number, isLiked: null | boolean, func: (val: number) => void) {
    const model = {
      value: value,
      isLiked: isLiked,
      postId: this.post?.id
    }

    this.http.post("/posts/api/rate", model).subscribe({
      next: () => {
        func(value);
      },
      error: (r: HttpErrorResponse) => {
        const error = r.status;
        if (error == 401) {
          this.alertService.activate({
            content: "You must log in to rate this post.",
            interval: 4000
          } as IAlert);
        }
      }
    });
  }

  copyLink() {
    window.navigator.clipboard.writeText(window.location.href);

    this.alertService.activate({
      content: "Link has been copied.",
      interval: 3000,
      isSuccess: true
    } as IAlert);
  }

  downvote() {
    let val;

    if (this.isDownvote) {
      val = 1;

      const func = (val: number) => {
        this.isDownvote = false;

        if (this.post) {
          this.post.rating = this.post.rating + val;
        }
      };

      this.vote(val, null, func);
    }
    else {
      if (this.isUpvote) {
        val = -2;
      }
      else {
        val = -1;
      }

      const func = (val: number) => {
        this.isDownvote = true;
        this.isUpvote = false;

        if (this.post) {
          this.post.rating = this.post.rating + val;
        }
      };

      this.vote(val, false, func);
    }
  }

  upvote() {
    let val;

    if (this.isUpvote) {
      val = -1;

      const func = (val: number) => {
        this.isUpvote = false;

        if (this.post) {
          this.post.rating = this.post.rating + val;
        }
      };

      this.vote(val, null, func);
    }
    else {
      if (this.isDownvote) {
        val = 2;
      }
      else {
        val = 1;
      }

      const func = (val: number) => {
        this.isUpvote = true;
        this.isDownvote = false;

        if (this.post) {
          this.post.rating = this.post.rating + val;
        }
      };

      this.vote(val, true, func);
    }
  }

  changeCommentsOrder(option: string) {
    const order = option == 'latest' ? 'descending' : 'ascending';

    if (this.post) {
      this.commentService?.getItems<ICommentResponse>(this.post.id, "postId", undefined, order, this.commentFunc);
    }
  }

  postComment(comment: ChildDisplay<Comment>) {
    comment.error = null;
    comment.isLoading = true;

    this.http.post<number>("/comments/api/add", { content: comment.content?.content, postId: this.post?.id }, { headers: this.commentService?.token }).subscribe({
      next: r => {
        if (comment.content) {
          comment.content.id = r;
          comment.isLoading = false;
        }
      },
      error: (r: HttpErrorResponse) => {
        comment.isLoading = false;
        comment.error = r.status.toString();
      }
    });
  }

  openOptions(comment: ChildDisplay<Comment>) {
    setTimeout(() => {
      if (comment.content) {
        comment.content.openedOptions = true;
      }
    }, 0);
  }

  showMore() {
    this.isHidden = false
  }
}
