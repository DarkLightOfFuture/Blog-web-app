import { Component, ElementRef, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemService } from '../../../services/item/item.service';
import { Tag } from '../../../models/tag';
import { HttpClient } from '@angular/common/http';
import { ArrayDisplay } from '../../../models/arrayDisplay';
import { ChildDisplay } from '../../../models/childDisplay';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { alertAnimation, appear, height, newAnimation, rotateBtn } from '../../../animations/animations';
import { AlertService } from '../../../services/alert/alert.service';
import { IAlert } from '../../../models/alert';
import { debounceTime, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-tags-index',
  templateUrl: './tags-index.component.html',
  styleUrl: '../../../styles/items-index.component.css',
  animations: [
    height, rotateBtn, alertAnimation, appear, newAnimation
  ]
})
export class TagsIndexComponent {
  public tagService: ItemService<Tag> | null = null;
  public tags = new ArrayDisplay<ChildDisplay<Tag>[]>();
   
  public modelForm: ChildDisplay<Tag> | null = null;
  @ViewChild("name") name!: ElementRef<HTMLInputElement>;
  public form: FormGroup;

  public choice = "id";
  public searchRow = new FormControl();

  @ViewChildren("items") public items!: QueryList<ElementRef>;

  private dialog: MatDialog = inject(MatDialog);

  constructor(private http: HttpClient, private titleService: Title, private alertService: AlertService) {
    this.titleService.setTitle("Tags index");

    this.form = new FormGroup({
      name: new FormControl("", [Validators.minLength(3)]),
      count: new FormControl(1),
      id: new FormControl(0)
    });

    this.searchRow.valueChanges.pipe(debounceTime(400), switchMap((val: string) => val ?
      of(this.tagService?.getItems(val, this.choice)) : of(this.tagService?.getItems("null", "null")))).subscribe();
  }

  ngOnInit() {
    this.tagService = new ItemService<Tag>(this.http, "tag", this, this.dialog);
    this.tags = this.tagService.items;

    this.tagService.getItems("null", "null");
    this.modelForm = this.tagService.item;
  }

  edit(tag: ChildDisplay<Tag>) {
    setTimeout(() => {
      if (tag.isEdited) {
        this.form.get("name")?.setValue(tag.content?.name);
      }
    }, 0);
  }

  setModelForm() {
    if (this.modelForm) {
      this.modelForm.isEdited = true;
      this.form.get("name")?.reset();

      setTimeout(() => this.name.nativeElement.focus(), 0);
    }
  }

  createTag() {
    const errorContent = "Tag must contain at least 3 characters and be unique.";
    const tagName = this.form.get("name");

    if (this.modelForm && tagName && tagName.valid && tagName.value) {
      this.modelForm.isLoading = true;

      this.tagService?.isUnique(tagName.value).subscribe({
        next: () => {
          this.tagService?.addItem(this.form);
        },
        error: () => {
          this.alertService.activate({
            content: errorContent,
            interval: 4000
          } as IAlert);

          tagName.reset();

          if (this.modelForm) {
            this.modelForm.isLoading = false;
          }
        }
      });
    }
    else {
      this.alertService.activate({
        content: errorContent,
        interval: 4000
      } as IAlert);
    }
  }

  updateTag(tag: ChildDisplay<Tag>) {
    this.form.get("id")?.setValue(tag.content?.id);

    this.tagService?.updateItem(this.form, tag)?.add(() => {
      if (tag.error == null) {
        tag.content = {
          ...tag.content,
          name: this.form.get("name")?.value
        } as Tag
      }
    });
  }
}
