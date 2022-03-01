import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _loader = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loader.asObservable();
  constructor() { 
    this.showLoader(false)
  }
  showLoader(value: boolean) {
    this._loader.next(value)
  }
}
