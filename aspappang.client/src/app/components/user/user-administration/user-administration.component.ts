import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, map, throttleTime } from 'rxjs';
import { appear } from '../../../animations/animations';

@Component({
  selector: 'user-administration',
  templateUrl: './user-administration.component.html',
  animations: [
    appear
  ]
})
export class UserAdministrationComponent {
  public ordinaryUsers = [];
  public ordinaryUsersCopy = [];
  public admins = [];
  public adminsCopy = [];

  @ViewChild("saveBtn") saveBtn!: ElementRef;

  public isSuccess = false;
  public isLoading = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get("/user/api/get-users").subscribe((data: any) => {
      this.ordinaryUsers = data.ordinaryUsers;
      this.admins = data.admins;

      this.adminsCopy = this.admins.slice();
      this.ordinaryUsersCopy = this.ordinaryUsers.slice();
    });
  }

  ngAfterViewInit() {
    fromEvent(this.saveBtn.nativeElement, "click")
      .pipe(throttleTime(2000), map(() => this.saveChanges())).subscribe();
  }

  changeRole(username: string, list: any[], list2: any[]) {
    const index = list.indexOf(username);

    list.splice(index, 1);
    list2.push(username);
  }

  reset() {
    this.admins = this.adminsCopy.slice();
    this.ordinaryUsers = this.ordinaryUsersCopy.slice();
  }

  saveChanges() {
    this.isLoading = true;
    this.isSuccess = false;

    const body = {
      ordinaryUsers: this.ordinaryUsers,
      admins: this.admins
    };

    this.http.post("/user/api/change-roles", body)
      .subscribe(() => this.isSuccess = true).add(() => this.isLoading = false);
  }
}
