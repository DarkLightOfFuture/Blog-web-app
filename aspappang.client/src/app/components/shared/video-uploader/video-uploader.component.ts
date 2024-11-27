import { Component, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-video-uploader',
  templateUrl: './video-uploader.component.html',
})
export class VideoUploaderComponent {
  public isError = false;
  public isLoading = false;
  public url = new FormControl('', [Validators.required]);
  public data = new EventEmitter<string>();

  constructor(private videoUploaderRef: MatDialogRef<VideoUploaderComponent>) { }

  create() {
    if (this.url.value?.includes("<iframe")) {
      this.isLoading = true;
      this.data.emit(this.url.value);
    }
    else {
      this.isError = true;
    }
  }

  close() {
    this.videoUploaderRef.close();
  }
}
