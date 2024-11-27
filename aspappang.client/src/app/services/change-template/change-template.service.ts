import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChangeTemplateService {
  public event = new EventEmitter<void>();
}
