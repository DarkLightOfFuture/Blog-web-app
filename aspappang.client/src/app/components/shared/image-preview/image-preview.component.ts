import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'image-preview',
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css',
  animations: [
    trigger("scale", [
      state("void", style({ transform: "scale(0)" })),
      state("*", style({ transform: "scale(1.5)" })),
    ])
  ]
})
export class ImagePreviewComponent {
  public src: string | undefined = undefined;

  constructor() {
    document.body.addEventListener("click", () => {
      this.src = undefined;
    });
  }

  setSrc(src: string) {
    setTimeout(() => this.src = src, 0);
  }
}
