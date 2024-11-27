import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-link-creator',
  templateUrl: './link-creator.component.html'
})
export class LinkCreatorComponent {
  public isLoading = false;
  public data = new EventEmitter<{ href: string, tag: string }>();
  public form: FormGroup;

  constructor(private linkCreatorRef: MatDialogRef<LinkCreatorComponent>) {
    this.form = new FormGroup({
      href: new FormControl('', [Validators.required]),
      tag: new FormControl('', [Validators.required])
    });
  }

  create() {
    this.isLoading = true;
    this.data.emit(this.form.value);
  }

  close() {
    this.linkCreatorRef.close();
  }
}
