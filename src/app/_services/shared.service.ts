import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedService {

  private dataSource = new BehaviorSubject('');
  currentData = this.dataSource.asObservable();
  localStorageData;
  constructor() { }

  changeData(data:string) {
    this.dataSource.next(data)
  }

  setLocalStorage(key, value) {
    this.localStorageData = localStorage.setItem(key,value);
  }
  getLocalStorage(key) {
    this.localStorageData = localStorage.getItem(key);
    return this.localStorageData;
  }

}