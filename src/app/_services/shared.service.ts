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
    this.localStorageData = sessionStorage.setItem(key,value);
  }
  getLocalStorage(key) {
    this.localStorageData = sessionStorage.getItem(key);
    return this.localStorageData;
  }

  getMeterType(type) {
    let meterType;
    switch (type) {
      case 'MULTICAL 602':
       meterType = 'heat';
        break;
      case 'MULTICAL 62':
       meterType = 'water';
        break;
      case 'OMNIPOWER':
       meterType = 'electricity';
        break;
    }
    return meterType;
  }

  getMeterTotalAmount(type,data) {
    let totalAmount;
    switch (type) {
      case 'MULTICAL 602':
       totalAmount = data['HeatCharges'];
        break;
      case 'MULTICAL 62':
       totalAmount = data['electricityCharges'];
        break;
      case 'OMNIPOWER':
       totalAmount = data['waterCharges'];
        break;
    }
    return totalAmount;
  }

  getMeterLastReading(type,data) {

    switch (type) {
      case 'heat':
       data['lastReading'] = data['lastCoolingEnergy'];
       data['currentReading'] = data['CoolingEnergy'];
        break;
      case 'electricty':
       data['lastReading'] = data['lastElectricityEnergy'];
       data['currentReading'] = data['ElectricityEnergy'];
        break;
      case 'water':
       data['lastReading'] = data['lastVolumeWater'];
       data['currentReading'] = data['VolumeWater'];
        break;
    }
    // return {lastReading,currentReading};
  }

  dateDiffIndays(date1, date2) {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
  }
  
  diff_minutes(dt2, dt1)  {

    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
    
  }
  changeCaseFirstLetter(params) {
    if (typeof params === 'string') {
      return params.charAt(0).toUpperCase() + params.slice(1);
    }
    return null;
  }

}