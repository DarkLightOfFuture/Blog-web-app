import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Comment } from '../../../models/comment';
import { User } from '../../../models/user';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../services/auth/auth.service.selectors';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, tap } from 'rxjs';
import { createPubDate } from '../../../services/date';
import { ChildDisplay } from '../../../models/childDisplay';
import { ArrayDisplay } from '../../../models/arrayDisplay';
import { HttpClient } from '@angular/common/http';
import { height } from '../../../animations/animations';
import { AlertService } from '../../../services/alert/alert.service';
import { IAlert } from '../../../models/alert';

@Component({
  selector: 'comment-form',
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css'
})
export class CommentFormComponent {
  public user: User | null = null;
  @Input() comments = new ArrayDisplay<ChildDisplay<Comment>[]>();
  @Output() dataEvent = new EventEmitter<ChildDisplay<Comment>>();

  public content = "";
  public isEnough: boolean | null = null;
  public form = new FormControl(null, [Validators.minLength(10), Validators.maxLength(600)]);

  @ViewChild("textarea") textarea!: ElementRef<HTMLElement>;
  private textareaDefaultHeight: number | null = null;

  constructor(private store: Store<{ user: User }>, private alertService: AlertService) {
    this.store.select(selectUser).subscribe(val => this.user = val);

    //Validates comment
    this.form.valueChanges.pipe(debounceTime(400), tap(() => {
      if (!this.form.pristine) {
        if (this.form.valid) {
          this.isEnough = true;
        }
        else {
          this.isEnough = false;
        }
      }
    })).subscribe();
  }

  //Adjusts height of textarea
  ngAfterViewInit() {
    if (this.textarea) {
      let textarea = this.textarea.nativeElement;

      this.textareaDefaultHeight = textarea.scrollHeight;

      textarea.style.maxHeight = textarea.style.minHeight = `${this.textareaDefaultHeight}px`;

      textarea.addEventListener("input", () => {
        textarea.style.height = "auto";

        textarea.style.maxHeight = textarea.style.minHeight = `${textarea.scrollHeight}px`;
      });
    }
  }

  createComment() {
    if (this.form.valid && !this.form.pristine) {
      let comment = new ChildDisplay<Comment>({
        content: this.content,
        canDelete: true,
        canReport: false,
        pubDate: createPubDate(new Date().toString()),
        user: this.user
      } as Comment);

      comment = { ...comment, isLoading: true, isNew: true };

      const copy = this.comments.array;
      this.comments.array = null;

      setTimeout(() => {
        this.comments.array = [comment, ...copy as ChildDisplay<Comment>[]];
      }, 0);

      this.form.markAsPristine();
      this.content = "";
      this.isEnough = null;

      let textarea = this.textarea.nativeElement;
      const height = `${this.textareaDefaultHeight}px`;

      Object.assign(textarea.style, {
        height: height,
        minHeight: height,
        maxHeight: height
      })

      this.dataEvent.emit(comment);
    }
    else {
      this.alertService.activate({
        content: "Comment should contain between 10 and 600 characters.",
        interval: 4000
      } as IAlert);
    }
  }
}
