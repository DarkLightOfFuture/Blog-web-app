import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { ItemService } from '../../../services/item/item.service';
import { Post } from '../../../models/post';
import { ArrayDisplay } from '../../../models/arrayDisplay';
import { ChildDisplay } from '../../../models/childDisplay';
import { HttpClient } from '@angular/common/http';
import { alertAnimation, appear, appearAlert, height, newAnimation, rotateBtn } from '../../../animations/animations'
import { AlertService } from '../../../services/alert/alert.service';
import { Tag } from '../../../models/tag';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { auditTime, debounceTime, map, of, switchMap, tap, throttleTime } from 'rxjs';
import { addJSFile } from '../../../services/JSFileHandling';
import { PostFormComponent } from '../../shared/post-form/post-form.component';
import { FormModel } from '../../../models/formModel';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { IAlert } from '../../../models/alert';

@Component({
  selector: 'app-posts-index',
  templateUrl: './posts-index.component.html',
  styleUrls: ['../../../styles/items-index.component.css', '../../../styles/tags.css'],
  animations: [
    rotateBtn, height, appearAlert, newAnimation, appear, alertAnimation
  ]
})
export class PostsIndexComponent {
  public posts = new ArrayDisplay<ChildDisplay<Post>[]>();
  public tags = new ArrayDisplay<ChildDisplay<Tag>[]>();
  public modelForm: ChildDisplay<Post> | null = null;
  public form: FormGroup;

  public choice = "id";

  private dialog: MatDialog = inject(MatDialog);

  private postTagsCopy: Tag[] = [];

  public tagName = new FormControl("", [Validators.minLength(3)]);
  public searchRow = new FormControl();
  public searchBox = new FormControl();

  public postService: ItemService<Post> | null = null;
  public tagService: ItemService<Tag> | null = null;

  @ViewChildren("items") public items!: QueryList<ElementRef>;
  @ViewChild(PostFormComponent) postForm!: PostFormComponent;

  constructor(private http: HttpClient, public alertService: AlertService, private titleService: Title) {
    this.titleService.setTitle("Posts index");

    this.searchBox.valueChanges.pipe(debounceTime(400), switchMap(val => of(this.searchTags(val)))).subscribe();

    this.form = new FormGroup({
      title: new FormControl("", [Validators.required, Validators.maxLength(110)]),
      thumbnail: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required, Validators.maxLength(100000)]),
      imageUrls: new FormControl([]),
      imageFiles: new FormControl([]),
      tags: new FormControl([])
    });

    this.searchRow.valueChanges.pipe(debounceTime(400), switchMap((val: string) => val ?
      of(this.postService?.getItems(val, this.choice)) : of(this.postService?.getItems("null", "null")))).subscribe();
  }

  ngOnInit() {
    this.postService = new ItemService<Post>(this.http, "post", this, this.dialog);
    this.posts = this.postService.items;
    
    this.postService.getItems("null", "null");
    this.modelForm = this.postService.item;
  }

  showMore(item: ChildDisplay<Post>) {
    if (item.content) {
      item.content.areManyTags = false;
    }
  }

  loadPost(post: ChildDisplay<Post>) {
    this.postService?.loadItem(post)?.add(() => {
      setTimeout(() => {
        if (post.content?.tags && post.content.areManyTags == null) {
          post.content.areManyTags = this.postService?.areMany(post, "articleTags", 5) ?? false;
        }
      }, 0);
    });
  }

  chooseTag(tag: Tag | null, post: ChildDisplay<Post> | null) {
    if (tag) {
      tag.isChosen = !tag.isChosen;

      if (tag.isChosen) {
        post?.content?.tags.unshift(tag);
      }
      else {
        if (post?.content) {
          post.content.tags = post.content.tags.filter(x => x.name != tag.name);
        }
      }
    }
  }

  removeTag(tag: Tag | null, post: ChildDisplay<Post> | null) {
    if (tag && post?.content) {
      post.content.tags = post.content.tags.filter(x => x != tag);

      const selectedTag = this.tags.array?.find(x => x.content?.name == tag.name);

      if (selectedTag?.content) {
        selectedTag.content.isChosen = false;
      }
    }
  }

  addTag() {
    const errorContent = "Tag must contain at least 3 characters and be unique.";

    if (this.tagName.valid && this.tagName.value) {
      this.tagService?.isUnique(this.tagName.value).subscribe({
        next: () => {
          const tag = { name: this.tagName.value, count: 0, isChosen: false } as Tag;

          this.tagService?.addItem(tag).subscribe({
            next: (r: any) => {
              tag.id = r;

              this.tags.array?.unshift(new ChildDisplay(tag));
              this.tagName.setValue("");
            },
            error: () => {
              this.tagName.setValue("");
            }
          });
        },
        error: () => {
          this.alertService.activate({
            content: errorContent,
            interval: 4000
          } as IAlert);

          this.tagName.setValue("");
        }
      });
    }
    else {
      this.alertService.activate({
        content: errorContent,
        interval: 4000
      } as IAlert);

      this.tagName.setValue("");
    }
  }

  searchTags(val: string) {
    const post = this.posts.array?.find(x => x.isEdited == true);

    this.tagService?.getItems(val, "name").add(() => {
      if (this.tags.array && post) {
        this.tags.array = this.tags.array?.map(
          x => post.content?.tags.find(y => y.name == x.content?.name) ?
            ({ ...x, content: { ...x.content as Tag, isChosen: true } }) : x);
      }
    });
  }

  setToDefaultTags() {
    if (this.tags.array) {
      this.tags.array = this.tags.array.map(x => ({ ...x, content: { ...x.content as Tag, isChosen: false } }));
    }
  }

  resetTags(post: ChildDisplay<Post>) {
    if (post?.content) {
      post.content.tags = this.postTagsCopy.slice();
    }
  }

  edit(post: ChildDisplay<Post>) {
    setTimeout(() => {
      if (post.isEdited) {
        this.form.get("title")?.setValue(post.content?.title);
        this.form.get("thumbnail")?.setValue(post.content?.thumbnail);
        this.form.get("description")?.setValue(post.content?.description);
        this.form.get("tags")?.setValue(post.content?.tags);
      }
    }, 0);

    if (this.tags.array == null) {
      this.tagService = new ItemService<Tag>(this.http, "tag", null);
      this.tags = this.tagService.items;
    }
    else {
      this.setToDefaultTags();
    }

    if (post.content) {
      this.postTagsCopy = post.content?.tags.slice();
    }

    const func = () => {
      let tags = this.tags.array;

      if (tags) {
        this.tags.array = tags.map(x => post.content?.tags.find(y => y.name == x.content?.name) ?
          ({ ...x, content: { ...x.content as Tag, isChosen: true } }) : x);
      }
    }

    if (this.tags.array) {
      func();
    }
    else {
      this.tagService?.getItems().add(func);
    }


    this.listenPostFormEvent();
  }

  loadTags() {
    setTimeout(() => {
      if (this.postService?.items.isCreationForm) {
        if (this.tags.array == null) {
          this.tagService = new ItemService<Tag>(this.http, "tag", null);
          this.tags = this.tagService.items;

          this.tagService.getItems();
        }
        else {
          this.setToDefaultTags();
        }
      }
    }, 0);
  }

  setModelForm() {
    setTimeout(() => {
      if (this.modelForm) {
        this.modelForm.isEdited = true;
        this.modelForm.content = { tags: [] as Tag[] } as Post;

        if (this.posts.isCreationForm) {
          this.form.reset({
            imageFiles: [],
            imageUrls: []
          });

          this.listenPostFormEvent();
        }
      }
    }, 0);
  }

  listenPostFormEvent() {
    setTimeout(() => this.postForm.dataEvent.subscribe(data => {
      const description = this.form.get("description");
      const imageUrls = this.form.get("imageUrls");
      const imageFiles = this.form.get("imageFiles");

      if (description && description.value != data.description) {
        description.setValue(data.description);
      }

      if (imageUrls && imageUrls.value != data.imageUrls) {
        imageUrls.setValue(data.imageUrls);
      }

      if (imageFiles && imageFiles.value != data.imageFiles) {
        imageFiles.setValue(data.imageFiles);
      }
    }), 0);
  }

  createPost() {
    this.form.get("tags")?.setValue(this.modelForm?.content?.tags);

    const formData = this.createFormData();

    this.postService?.addItem(formData);
    this.form.reset({
      imageFiles: [],
      imageUrls: []
    });
  }

  updatePost(post: ChildDisplay<Post>) {
    this.form.get("tags")?.setValue(post.content?.tags);
    let formData = this.createFormData();

    if (post.content) {
      formData.append("id", post.content?.id);
    }

    this.postService?.updateItem(formData, post)?.add(() => {
      if (post.error == null) {
        post.content = {
          ...post.content,
          title: this.form.get("title")?.value,
          thumbnail: this.form.get("thumbnail")?.value
        } as Post
      }
    });
  }

  createFormData() {
    const formData = new FormData();

    formData.append("title", this.form.get("title")?.value);
    formData.append("thumbnail", this.form.get("thumbnail")?.value);
    formData.append("description", this.form.get("description")?.value);

    const tags = this.form.get("tags")?.value as Array<Tag>;
    const imageFiles = this.form.get("imageFiles")?.value as Array<File>;
    const imageUrls = this.form.get("imageUrls")?.value as Array<string>;

    tags.forEach((x: Tag, i: any) => {
      formData.append(`tagIds`, x.id.toString());
    });

    imageFiles.forEach((file: File) => {
      formData.append("imageFiles", file, file.name)
    });

    imageUrls.forEach((x: string) => {
      formData.append(`imageUrls`, x);
    });

    return formData;
  }
}
