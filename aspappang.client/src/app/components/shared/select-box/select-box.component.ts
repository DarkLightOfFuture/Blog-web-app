import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'select-box',
  templateUrl: './select-box.component.html',
  styleUrl: './select-box.component.css',
  animations: [
    trigger("scale", [
      state("void", style({ transform: "scaleY(0)" })),
      state("*", style({ transform: "scaleY(1)" })),
      transition("void <=> *", animate(".2s"))
    ])
  ]
})
export class SelectBoxComponent {
  @Output() dataEvent = new EventEmitter<string>();
  @ViewChild("select") select!: ElementRef<HTMLElement>;
  @Input() public options: string[] = [];
  public chosenOption = "";
  public isOpened = false;


  constructor() {
    document.body.addEventListener("click", (event: MouseEvent) => {
      if (!this.select.nativeElement.contains(<Node>event.target)) {
        this.isOpened = false;
      }
    });
  }

  ngOnInit() {
    const option = this.options.at(0);

    if (option) {
      this.chosenOption = option;
    }
  }

  toggle() {
    this.isOpened = !this.isOpened;
  }

  change(option: string) {
    if (this.chosenOption != option) {
      this.chosenOption = option;
      this.dataEvent.emit(option);
    }
  }
}
