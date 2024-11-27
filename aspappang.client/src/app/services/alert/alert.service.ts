import { Injectable } from '@angular/core';
import { IAlert } from '../../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public alerts: IAlert[] = [];


  activate(obj: IAlert) {
    const copy = this.alerts.find(x => x.content == obj.content);

    const func = () => {
      this.alerts.push(obj);

      obj.timeoutId = setTimeout(() => {
        const index = this.alerts.indexOf(obj);

        this.alerts.splice(index, 1);
      }, obj.interval);
    };

    if (copy) {
      this.deactivate(copy);

      setTimeout(func, 200);
    }
    else {
      func();
    }
  }

  deactivate(obj: IAlert) {
    this.alerts.splice(this.alerts.indexOf(obj), 1);
    clearTimeout(obj.timeoutId);
  }
}
