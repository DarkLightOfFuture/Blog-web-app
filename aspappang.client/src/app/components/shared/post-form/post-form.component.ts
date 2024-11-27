import { Component, ElementRef, EventEmitter, Input, ViewChild, ViewEncapsulation, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadImageContainerComponent } from '../upload-image-container/upload-image-container.component';
import Quill from 'quill';
import { addJSFile, removeJSFile } from '../../../services/JSFileHandling';
import { LinkCreatorComponent } from '../link-creator/link-creator.component';
import { VideoUploaderComponent } from '../video-uploader/video-uploader.component';

declare var editor: Quill;
declare var videoIndices: any;
declare var size: any;

@Component({
  selector: 'post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css', "../../../styles/quill.core.css"],
  encapsulation: ViewEncapsulation.None
})
export class PostFormComponent {
  @Input() public outerHTML: string | undefined = "";
  public dataEvent = new EventEmitter<{
    description: string, imageUrls: any, imageFiles: any }>();

  public imageUrls: { url: string, index: number }[] = [];
  public imageFiles: { file: File, index: number }[] = [];

  constructor(private dialog: MatDialog) { }

  ngAfterViewInit() {
    if (this.outerHTML != undefined) {
      const editor = this.getEditor();

      if (editor) {
        editor.outerHTML = this.outerHTML;
      }
    }

    addJSFile("https://cdn.quilljs.com/1.3.6/quill.js");
    setTimeout(() => {
      addJSFile("assets/editor.js");
    }, 0);
  }

  ngOnDestroy() {
    removeJSFile("https://cdn.quilljs.com/1.3.6/quill.js");
    removeJSFile("assets/editor.js");
  }

  inputChange() {
    const description = this.getEditor()?.innerHTML;

    if (description) {
      this.dataEvent.emit({
        description: description,
        imageFiles: this.imageFiles.sort((a, b) => a.index - b.index).map(x => x.file),
        imageUrls: this.imageUrls.sort((a, b) => a.index - b.index).map(x => x.url)
      });
    }
  }

  getEditor() {
    return document.querySelector(".ql-editor");
  }

  openUploadImage() {
    const uploadImage = this.dialog.open(UploadImageContainerComponent);

    uploadImage.componentInstance.dataEvent.subscribe(file => {
      try {
        editor.format("image", "default.jpg");
      }
      catch (ex) { }

      //Uploads image into editor.
      document.querySelectorAll(".ql-editor img").forEach(x => {
        let el = <HTMLImageElement>x;
        const src = el.src.split("/");

        if (src[src.length - 1] == "default.jpg") {
          el.addEventListener("load", () => {
            editor.focus();

            const index = editor.getSelection()?.index;

            if (index != undefined) {
              this.imageFiles.push({
                file: file,
                index: index
              });
            }

            this.inputChange();
            uploadImage.close();
          });

          el.src = URL.createObjectURL(file);
        }
      });
    });
  }

  openLinkCreator() {
    const linkCreator = this.dialog.open(LinkCreatorComponent);

    linkCreator.componentInstance.data.subscribe(data => {
      editor.focus();
      const index = editor.getSelection()?.index;

      if (index != undefined && index >= 0) {
        editor.insertText(index, data.tag);

        const formatObj = { 'link': data.href };
        editor.formatText(index, data.tag.length, formatObj);

        this.inputChange();
        linkCreator.close();
      }
    });
  }

  openVideoUploader() {
    const videoUploader = this.dialog.open(VideoUploaderComponent);

    videoUploader.componentInstance.data.subscribe(data => {
      editor.focus();

      let range = editor.getSelection();

      if (range) {
        const sizeType = editor.getFormat(range?.index, range?.length)["size"];

        videoIndices[videoIndices.length] = range.index + 1;

        const url = data.substring(0, data.indexOf("iframe") + 7) + 'align="center" ' + data.slice(data.indexOf("iframe") + 6);

        try {
          editor.clipboard.dangerouslyPasteHTML(range.index, url);
        } catch (error) { }

        if (sizeType != null) {
          size.value = sizeType;
          size.style.color = "#073887";
        }

        this.inputChange();
        videoUploader.close();
      }
    });
  }
}
