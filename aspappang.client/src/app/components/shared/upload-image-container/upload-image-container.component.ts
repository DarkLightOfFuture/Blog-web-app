import { Component, ElementRef, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { appear } from '../../../animations/animations';

@Component({
  selector: 'upload-image-container',
  templateUrl: './upload-image-container.component.html',
  styleUrl: './upload-image-container.component.css',
  animations: [appear]
})
export class UploadImageContainerComponent {
  public way: string = "computer";
  public isLoading = false;
  public isError = false;

  public dataEvent = new EventEmitter<File>();
  @ViewChild("uploadedImage") public uploadedImage!: ElementRef;
  @ViewChild("testImg") public testImg!: ElementRef<HTMLImageElement>;

  constructor(private uploadImageRef: MatDialogRef<UploadImageContainerComponent>) { }

  ngAfterViewInit() {
    this.testImg.nativeElement.addEventListener("error", () => {
      this.isLoading = false;
      this.isError = true;
    });

    this.testImg.nativeElement.addEventListener("load", (event: any) => {
      const canvas = document.createElement("canvas");
      const img = this.testImg.nativeElement;

      canvas.height = img.height;
      canvas.width = img.width;

      const ctx = canvas.getContext("2d");

      ctx?.drawImage(img, 0, 0, img.width, img.height);

      canvas.toBlob((blob) => {
        if (blob) {
          let file = new File([blob], "image");

          this.dataEvent.emit(file);
        }
      })
    });
  }

  changeWay() {
    this.isError = false;
  }

  isPhoto(path: string) {
    const pathArray = path.split("."),
          ext = pathArray[pathArray.length - 1];
    
    switch (ext) {
      case "png":
      case "jpg":
      case "bmp":
        return true
    }

    return false
  }

  cancel() {
    this.uploadImageRef.close();
  }

  save() {
    if (this.way == "computer") {
      this.isLoading = true;
      const file = (<HTMLInputElement>this.uploadedImage.nativeElement)?.files?.[0];

      if (file) {
        if (this.isPhoto(file.name)) {
          this.dataEvent.emit(file);
        }
        else {
          this.isError = true;
          this.isLoading = false;
        }
      }
    }
    else {
      const val = this.uploadedImage.nativeElement.value;
      this.isLoading = true;

      if (val && val.length > 0) {
        this.testImg.nativeElement.src = val;
      }
      else {
        this.isLoading = false;
      }
    }
  }
}
