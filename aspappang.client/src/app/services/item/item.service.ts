import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Inject, Injectable, OnInit, QueryList, ViewChild, inject } from '@angular/core';
import { IModel } from '../../models/model.interface';
import { ArrayDisplay } from '../../models/arrayDisplay';
import { Observable, Subscription, delay } from 'rxjs';
import { FormModel } from '../../models/formModel';
import { ChildDisplay } from '../../models/childDisplay';
import { FormGroup } from '@angular/forms';
import { Post } from '../../models/post';
import { Tag } from '../../models/tag';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../components/shared/delete-confirmation/delete-confirmation.component';

@Injectable({
  providedIn: 'root'
})
export class ItemService<T extends IModel> {
  private rem = parseFloat(window.getComputedStyle(document.body).fontSize);
  public items = new ArrayDisplay<ChildDisplay<T>[]>();
  public item = new ChildDisplay<T>();
  public deleteForm = new FormModel();
  public token: any  = null;

  constructor(private http: HttpClient, @Inject("controller") private controller: string,
    @Inject("component") private component: any, @Inject("dialog") private dialog: MatDialog | undefined = undefined) {
      this.http.get("/user/api/get-antiforgery-token").subscribe((r: any) => {
        this.token = {
          "__RequestVerificationToken": r };
      });
  }

  private getElement(item: ChildDisplay<T>): any {
    const id = this.items.array?.findIndex(x => x == item);

    return (<QueryList<any>>this.component.items).filter((_: any, i: number) => i == id).at(0).nativeElement;
  }

  edit(item: ChildDisplay<T>) {
    if (!item.isEdited) {
      item.endHeight = "*";
    }

    setTimeout(() => {
      item.isEdited = !item.isEdited;
      this.getElement(item).scrollIntoView({ behavior: "smooth", block: 'center' });
    }, 0);
  }

  switchStateCreationForm() {
    this.items.array?.forEach((x) => {
      if (x.isOpened) {
        this.loadItem(x);
      }
    });

    setTimeout(() => {
      this.items.isCreationForm = !this.items.isCreationForm;
    }, 0);

    setTimeout(() => {
      if (this.items.isCreationForm) {
        document.querySelector("h1")?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      else {
        document.querySelector("main")?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  setToDelete(item: ChildDisplay<T>) {
    item.toDelete = !item.toDelete;
  }

  isAnyToDelete() {
    return this.items.array?.some(x => x.toDelete == true);
  }

  isLong(name: string | undefined): boolean {
    return name != undefined && name.length > 90;
  }

  areMany(item: ChildDisplay<T>, container: string, remVal: number): boolean {
    let el = this.getElement(item).querySelector(`.${container}`);

    return el ? el.offsetHeight > remVal * this.rem : false;
  }

  isUnique(name: string) {
    const params = new HttpParams().set("name", name);

    return this.http.get(`/${this.controller}s/api/isunique`, { params: params });
  }

  loadItem(item: ChildDisplay<T>) {
    const func = (x: any) => {
      if (x.isOpened) {
        const el = this.getElement(x);

        if (x.isEdited) {
          el.querySelector("#cancel").click();
        }

        setTimeout(() => { el.querySelector(".arrowBtn").click() }, 0);
      }
    }

    this.items.isCreationForm = false;

    if (item.startHeight == "*") {
      let params = new HttpParams();

      if (item.content?.id) {
        const el = this.getElement(item);

        item.isLoading = true;
        item.startHeight = el.querySelector("div").style.minHeight = `${el.offsetHeight}px`;

        params = params.set("id", item.content?.id);

        if (this.controller == "post") {
          return this.http.get<T>(`/${this.controller}s/api/getpartial`, { params: params }).subscribe({
            next: r => {
              item.content = { ...item.content as T, ...r };

              this.items.array?.forEach(func);

              item.isLoading = false;
              togglePanelState(item);
              el.scrollIntoView({ behavior: "smooth", block: 'center' });
            },
            error: (r: HttpErrorResponse) => {
              item.isLoading = false;
              this.item.error = r.status.toString();
            }
          });
        }
        else {
          this.items.array?.forEach(func);
          item.isLoading = false;

          togglePanelState(item);
          el.scrollIntoView({ behavior: "smooth", block: 'center' });
        }
      }
    }
    else {
      if (item.isEdited) {
        item.isEdited = false;
        item.endHeight = "*";
      }

      if (!item.isOpened) {
        this.items.array?.forEach(func);
      }

      setTimeout(() => {
        if (item.endHeight == "*") {
          const el = this.getElement(item);

          item.endHeight = `${el.offsetHeight}px`;
        }
      }, 0);

      togglePanelState(item);
    }

    return null;

    function togglePanelState(item: ChildDisplay<T>) {
      setTimeout(() => {
        item.isOpened = !item.isOpened;

        setTimeout(() => { item.isOpened2 = !item.isOpened2 }, 0);
      });
    }
  }

  //CRUD

    //Read

  getItems(): Subscription;
  getItems(arg: string, type: string): Subscription;
  getItems(arg: string, type: string, count: number | undefined, order: "ascending" | "descending"): Subscription;
  getItems<T2>(arg: string, type: string, count: number | undefined, order: "ascending" | "descending", func: (items: ArrayDisplay<ChildDisplay<T>[]>, r: T2[]) => void): Subscription;

  getItems<T2>(arg?: string, type?: string, count?: number, order?: "ascending" | "descending", func?: (items: ArrayDisplay<ChildDisplay<T>[]>, r: T2[]) => void): Subscription {
    let params = new HttpParams();

    if (arg) { params = params.set("arg", arg) }
    if (type) { params = params.set("type", type) }
    if (count) { params = params.set("count", count) }
    if (order) { params = params.set("isAscending", order == 'ascending' ? true : false) }

    return this.http.get(`/${this.controller}s/api/get-items`, { params: params }).subscribe({
      next: r => {
        if (func) {
          func(this.items, (<T2[]>r));
        }
        else {
          this.items.array = (<T[]>r).map(item => new ChildDisplay<T>(item));
        }
      },
      error: (r: HttpErrorResponse) => {
        this.items.error = r.status.toString();
      }
    });
  }

  getItem(id: number | string) {
    const params = new HttpParams().set("id", id);

    this.http.get<T>(`/${this.controller}s/api/get`, { params: params }).subscribe({
      next: r => {
        this.item.content = r;
      },
      error: (r: HttpErrorResponse) => {
        this.item.error = r.message;
      }
    });
  }

    //Create

  addItem(formData: FormData | FormGroup): void;
  addItem(formData: T): Observable<Object>;

  addItem(formData: FormData | FormGroup | T) {
    const url = `/${this.controller}s/api/add`;

    if (formData instanceof FormData || ( formData instanceof FormGroup && formData.valid )) { 
      let data;

      if (formData instanceof FormGroup) {
        data = formData.value;
      }
      else {
        data = formData;
      }

      this.item.error = null;
      this.item.isLoading = true;

      this.http.post(url, data, { headers: this.token }).subscribe({
        next: (r) => {
          this.item.isNew = true;
          this.item.isLoading = this.items.isCreationForm = false;

          this.item.content = { ...this.item.content as T, ...r };
          this.item.isEdited = false;

          const copy = this.items.array;
          this.items.array = null;

          setTimeout(() => {
            this.items.array = [{ ...this.item }, ...copy as ChildDisplay<T>[]];
            this.item = new ChildDisplay<T>();
          }, 0);

          this.items.isCreationForm = false;
          document.querySelector("main")?.scrollIntoView({ behavior: 'instant', block: 'start' });
        },
        error: (r: HttpErrorResponse) => {
          this.item.error = r.status.toString();
          this.item.isLoading = false;
        }
      });

      return "";
    }

    return this.http.post(url, formData, { headers: this.token });
  }

    //Update

  updateItem(formData: FormGroup | FormData, item: ChildDisplay<T>) {
    if ((formData instanceof FormGroup && formData.valid) || formData instanceof FormData) {
      let data;

      if (formData instanceof FormData) {
        data = formData;
      }
      else {
        data = formData.value
      }

      item.isLoading = true;

      return this.http.post(`/${this.controller}s/api/update`, data, { headers: this.token }).subscribe({
        next: (r) => {
          item.content = { ...item.content as T, ...r };
          item.isLoading = item.isEdited = false;
        },
        error: (r: HttpErrorResponse) => {
          item.error = r.status.toString();
          item.isLoading = false;
        }
      });
    }

    return null;
  }

    //Delete

  clearToDeleteList() {
    if (this.items.array) {
      this.items.array = this.items.array.map(x => x.toDelete ? { ...x, toDelete: false } : x);
    }
  }

  setAllToDelete() {
    this.items.array?.forEach((x: ChildDisplay<T>) => {
      if (!x.toDelete) {
        x.toDelete = true;
      }
    });
  }

  deleteItem(item: ChildDisplay<T>) {
    const deleteConfirmation = this.dialog?.open(DeleteConfirmationComponent);

    deleteConfirmation?.afterClosed().subscribe(result => {
      if (result && item.content) {
        item.error = null;
        item.isLoading = true;

        this.http.delete(`/${this.controller}s/api/delete-item`,
          { params: new HttpParams().set("id", item.content.id), headers: this.token }).subscribe({
            next: () => {
              if (this.items.array) {
                item.isLoading = false;

                this.items.array = this.items.array.filter(x => x.content?.id != item.content?.id);
              }
            },
            error: (r: HttpErrorResponse) => {
              item.isLoading = false;
              item.error = r.status.toString();
            }
          });
      }
    });
  }

  deleteItems() {
    const deleteConfirmation = this.dialog?.open(DeleteConfirmationComponent);

    deleteConfirmation?.afterClosed().subscribe(result => {
      if (result && this.items.array) {
        const data = this.items.array.filter(x => x.toDelete == true).map(x => x.content?.id);

        this.deleteForm.error = null;
        this.deleteForm.isLoading = true;

        this.http.delete(`/${this.controller}s/api/delete-items`, { body: data, headers: this.token }).subscribe({
          next: () => {
            if (this.items.array) {
              this.items.array = this.items.array.filter(x => x.toDelete == false);
              this.deleteForm.isLoading = false;
            }
          },
          error: (r: HttpErrorResponse) => {
            this.deleteForm.error = r.status.toString();
            this.deleteForm.isLoading = false;
          }
        });
      }
    });
  }
}
