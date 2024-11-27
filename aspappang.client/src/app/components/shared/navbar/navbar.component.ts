import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserState } from '../../../services/auth/auth.service.reducer';
import { selectUser } from '../../../services/auth/auth.service.selectors';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  public user: User | null = null;
  public isDarkTheme = false;

  constructor(private store: Store<{ user: UserState }>, public authService: AuthService) {
    store.select(selectUser).subscribe(result => this.user = result);
  }

  ngOnInit() {
    this.isDarkTheme = JSON.parse(localStorage.getItem("darkTheme") ?? "false")
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    const allElements = document.querySelectorAll("*");

    allElements.forEach(x => {
      x.classList.toggle("darkTheme");
    });

    localStorage.setItem("darkTheme", `${this.isDarkTheme}`);
  }
}
