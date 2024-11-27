import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { addJSFile } from './services/JSFileHandling';
import { Title } from '@angular/platform-browser';
import { User } from './models/user';
import { UserState } from "./services/auth/auth.service.reducer";
import { Store } from '@ngrx/store';
import { loadUserData } from './services/auth/auth.service.actions';
import { getCookie, removeCookie } from './services/cookie';
import { UploadImageContainerComponent } from './components/shared/upload-image-container/upload-image-container.component';
import { MatDialog } from '@angular/material/dialog';
import { IAlert } from './models/alert';
import { AlertService } from './services/alert/alert.service';
import { alertAnimation } from './animations/animations';
import { ChangeTemplateService } from './services/change-template/change-template.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './lib/bootstrap/dist/css/bootstrap.min.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [alertAnimation]
})
export class AppComponent {
  public isMainPage = false;
  public mainClass = "main";
  public sectionId = "content"

  public alerts: IAlert[] | null = null;

  constructor(private http: HttpClient, private router: Router,
      private title: Title, private store: Store<{ user: UserState }>,
      public alertService: AlertService, private changeTemplateService: ChangeTemplateService) {
    this.alerts = this.alertService.alerts;

    this.changeTemplateService.event.subscribe(() => {
      this.mainClass = "main";
    });
  }

  ngOnInit() {
    const user = JSON.parse(getCookie("user") ?? "{}");

    if (user.username) {
      this.store.dispatch(loadUserData({ user: <User>user }));
    }
  }

  ngAfterViewInit() {
    this.setThemeFromLocalStorage();
    addJSFile("assets/site.js");
  }

  ngDoCheck() {
    this.setThemeFromLocalStorage(true);
  }

  setThemeFromLocalStorage(afterInit: boolean = false) {
    setTimeout(() => {
      const isDarkTheme = JSON.parse(localStorage.getItem("darkTheme") || "false");

      if (isDarkTheme) {
        const allElements = document.querySelectorAll("*:not([class*='darkTheme'])");

        for (let x = 0; x < allElements.length; x++) {
          allElements[x].classList.toggle("darkTheme");
        }

        if (!afterInit) {
          const checkBox = <HTMLInputElement>document.querySelector(".switch #checkBox");
          checkBox.checked = true;
        }
      }
    }, 0);
  }

  changeTemplate() {
    const href = window.location.href;

    this.isMainPage = href == "https://localhost:4200/" ? true : false;

    const path = href.split("/");

    if (path.at(4) == "show") {
      this.mainClass = "mainArticle";
    }
    else if (path.at(4) == "settings") {
      this.mainClass = "mainSettings"
    }
    else {
      this.mainClass = "main";
    }

    if (path.at(4) == 'settings') {
      this.sectionId = "area";
    }
    else {
      this.sectionId = "content";
    }

    if (location.protocol === 'http:') {
      window.location.href = location.href.replace('http', 'https');
    }
  }
}
