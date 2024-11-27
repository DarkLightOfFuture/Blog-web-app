import { Component, ElementRef, ViewChild, ViewChildren, QueryList, ViewEncapsulation } from '@angular/core';
import { User } from '../../../models/user';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../services/auth/auth.service.selectors';
import { UserState } from '../../../services/auth/auth.service.reducer';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css',
  encapsulation: ViewEncapsulation.None
})
export class UserSettingsComponent {
  public sections = ["Profile", "Email", "Administration", "Password"];
  public chosenSection = { index: 0, top: 0, name: "Profile" };

  public user: User | null = null;

  @ViewChild("slider") slider!: ElementRef<HTMLElement>;
  @ViewChild("sectionsContainer") container!: ElementRef<HTMLElement>;
  @ViewChildren("sections") sectionRefs!: QueryList<ElementRef<HTMLElement>>;

  constructor(private store: Store<{ user: UserState }>, private title: Title) {
    this.store.select(selectUser).subscribe(val => this.user = val);
  }

  ngOnInit() {
    this.title.setTitle("Settings");
  }

  ngAfterViewInit() {
    //Initializes the slider.
    this.slider.nativeElement.style.top = "0px";
    this.changeSlider(0);

    this.sectionRefs.forEach((x, i) => {
      x.nativeElement.addEventListener('mouseenter', () => {
        this.slider.nativeElement.style.top = `${x.nativeElement.offsetTop}px`;
        this.changeSlider(i);
      })

      x.nativeElement.addEventListener("click", () => {
        this.chosenSection = {
          index: i,
          top: x.nativeElement.offsetTop,
          name: x.nativeElement.innerHTML.trim()
        };
      });
    });

    this.container.nativeElement.addEventListener("mouseleave", () => {
      this.slider.nativeElement.style.top = `${this.chosenSection.top}px`;
      this.changeSlider(this.chosenSection.index);
    });
  }

  private changeSlider(index: number) {
    if (index == 0) {
      this.slider.nativeElement.style.borderRadius = "1rem 1rem 0rem 0rem";
    }
    else if (index == this.sectionRefs.length - 1) {
      this.slider.nativeElement.style.borderRadius = "0rem 0rem 1rem 0rem";
    }
    else {
      this.slider.nativeElement.style.borderRadius = "0rem";
    }
  }

  validate(name: string) {
    return name != "Administration" || this.user?.hasAdmin == true;
  }
}
