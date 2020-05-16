import { Component, OnInit } from '@angular/core';
import { AlertService, FirebaseService, MeterService, SharedService } from '../../_services/index';
import { ActivatedRoute } from '@angular/router';
import { element } from 'protractor';


@Component({
  selector: 'app-meter-detail',
  templateUrl: './meter-detail.component.html',
  styleUrls: ['./meter-detail.component.css']
})
export class MeterDetailComponent implements OnInit {

  constructor(private meterService: MeterService, private route: ActivatedRoute, public sharedService: SharedService) { }
  meterData: {} = {};
  allMeterData: any = [];
  ngOnInit() {
    const meterId: string = this.route.snapshot.paramMap.get('id');
    let condn = {
      'key': '_id',
      'value': meterId
    }
    this.meterService.getMeterDetailCondn1(condn).subscribe(meterData => {

      this.meterData = meterData ? meterData[0] : {};
      //  this.meterData = this.allMeterData.filter( element => {
      //    return element['_id'] == meterId;
      //  })[0];

    });
  }

  getCharges(meterData) {
    let chargeAmount = 0;
    switch (meterData.type) {
      case 'heat':
        chargeAmount = meterData.HeatCharges;
        break;
      case 'water':
        chargeAmount = meterData.waterCharges;
        break;
      case 'electricity':
        chargeAmount = meterData.electricityCharges;
        break;
    }
    return chargeAmount;
  }

  getReadingCount(meterData) {
    let readingCount = 0;
    switch (meterData.type) {
      case 'heat':
        readingCount = meterData.CoolingEnergy;
        break;
      case 'water':
        readingCount = meterData.VolumeWater;
        break;
      case 'electricity':
        readingCount = meterData.electricityCharges;
        break;
    }
    return readingCount;
  }

  getUnit(meterData) {
    let unit = 0;
    switch (meterData.type) {
      case 'heat':
        unit = meterData.CUnit ? meterData.CUnit : 'm3/h';
        break;
      case 'water':
        unit = meterData.WUnit ? meterData.WUnit : 'm3';
        break;
      case 'electricity':
        unit = meterData.EUnit ? meterData.EUnit : 'kWh';
        break;
    }
    return unit;
  }
}
