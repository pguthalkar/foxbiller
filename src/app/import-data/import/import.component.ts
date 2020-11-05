import { Component, OnInit, ViewChild } from '@angular/core';
// import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit, CdkDragStart, CdkDrag } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit, CdkDragStart, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { AlertService, FirebaseService, SharedService, MeterService } from '../../_services/index';
import {AuthService } from '../../core/auth.service';
import { UserService } from '../../_services/index';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';  // RxJS 6 syntax
import { Route, Router } from '@angular/router';
import { setInterval } from 'timers';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
  csvContent: string;
  constructor(private alertService: AlertService,
    private firebaseService: FirebaseService,
    private userService: UserService,
    private sharedService: SharedService,
    private meterService: MeterService,
    private router: Router,
    private authService:AuthService
  ) {

    this.userData = this.sharedService.getLocalStorage('user') ? JSON.parse(this.sharedService.getLocalStorage('user')) : {};
  }
  userData = {};
  csvFields = [
  ];
  isImported = false;
  inputData = [];
  arrBillsRequests = [];
  flag = false;
  tarriffA = 0.435;
  tarriffB = 0.509;

  waterTarriff1 = 0.80;
  waterTarriff2 = 2;
  waterTarriff3 = 3;

  minWaterCharge = 50;

  limitUsage = 200;
  waterMaxBand1: number = 20;
  waterMaxBand2: number = 35;
  minWaterBill = 50;

  heatMaxBand1: number = 100;
  heatMaxBand2: number = 500;
  minHeatBill = 0;
  heatTarriff1 = 1.50;
  heatTarriff2 = 2;
  heatTarriff3 = 3;


  availableFields = [
    {
      'name': 'CustomerName',
      'required': false,
      'mapped': ['Customer name']
    },
    {
      'name': 'CustomerNumber',
      'required': false,
      'mapped': ['Customer number']
    },
    {
      'name': 'MeterSerialNumber',
      'required': true,
      'mapped': ['Meter serial number']
    },
    {
      'name': 'MeterType',
      'required': true,
      'mapped': ['Meter type']
    },
    {
      'name': 'ReadingTime',
      'required': true,
      'mapped': ['Reading time']
    },
    {
      'name': 'ElectricityEnergy',
      'required': false,
      'mapped': ['Energy Electricity energy']
    }, {
      'name': 'EUnit',
      'required': false,
      'mapped': ['Unit']
    },
    {
      'name': 'CoolingEnergy',
      'required': false,
      'mapped': ['Energy 3 Cooling energy']
    }, {
      'name': 'CUnit',
      'required': false,
      'mapped': ['CUnit']
    }, {
      'name': 'VolumeWater',
      'required': false,
      'mapped': ['Volume Water']
    }, {
      'name': 'WUnit',
      'required': false,
      'mapped': ['WUnit']
    }, 
  ];
  inactiveCustomers = [];
  loggedInUser;
  settingData;
  fileName;
  failedMeters = [];
  succededMeters =[];
  ngOnInit() {
    this.loggedInUser = JSON.parse(this.sharedService.getLocalStorage('user'));
    this.authService.updateSettingData(this.loggedInUser.uid);
    setTimeout(() => {
      this.settingData = this.sharedService.getLocalStorage('settingData') ? JSON.parse(this.sharedService.getLocalStorage('settingData')) : null;
    }, 2000);
    
  }
  title = 'app';
  public csvRecords: any[] = [];

  @ViewChild('fileImportInput', { static: true }) fileImportInput: any;

  fileChangeListener($event: any): void {
    this.availableFields.map(element => {
      element.mapped = [];

    });
    let text = [];
    let files = $event.srcElement.files;
    this.fileName = files[0].name;
    if (this.isCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        this.csvFields = this.csvRecords[0] ? Object.keys(this.csvRecords[0]) : [];
      };


      reader.onerror = function () {
        alert('Unable to read ' + input.files[0]);
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let dataArr = [];
    let csvRecord = [];
    for (let i = 0; i < csvRecordsArray.length; i++) {
      let data = (<string>csvRecordsArray[i]).split(',');

      // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS
      // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA
      if (i == 0) {
        data.forEach(element => {
          csvRecord.push(element);
        });
      }
      else if (data.length == headerLength) {

        //let csvRecord: CSVRecord = new CSVRecord();
        let tempCol = {};
        csvRecord.forEach((element, currentIndex) => {
          tempCol[element] = data[currentIndex] ? data[currentIndex].trim() : '';
        });

        dataArr.push(tempCol);
      }
    }
    return dataArr;
  }

  // CHECK IF FILE IS A VALID CSV FILE
  isCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  // GET CSV FILE HEADER COLUMNS
  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
    this.csvFields = [];
  }

  drop(event: CdkDragDrop<string[]>) {

    // if (event.container.data.length > 0) {
    //   transferArrayItem(event.container.data,
    //     event.previousContainer.data,
    //     event.previousIndex,
    //     event.currentIndex);
    // }
    // else {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    // }
  }

  specialUseCase(drag?: CdkDrag, drop?: CdkDropList) {
    if (drop.data.length > 0) {
      console.log("Can't drop you because there aren't enough items in 'Active'");
      return false;
    }
    else {
      return true;
    }

  }

  async importData() {
    if (!this.settingData) {
      this.alertService.error("Please update Setting data.");
      return;
    }
    let currentDay = new Date().getDate();

    let isError = false;
    for (let index = 0; index < this.availableFields.length; index++) {

      if (this.availableFields[index].required && this.availableFields[index].mapped.length === 0) {
        this.alertService.error("All '*' marked fields are required");
        isError = true;
        break;
      }
    }

    if (!isError) {
      this.csvRecords.forEach(csvElement => {
        let input = {};
        this.availableFields.forEach(availElement => {
          if (csvElement[availElement.mapped[0]]) {
            input[availElement.name] = csvElement[availElement.mapped[0]];
          }
        });
        if (Object.keys(input).length > 0) {
          this.inputData.push(input);
        }

      });

      let meterDetailsCollection = this.firebaseService.getMeterDetailCollection();

      let lastmonthDate = new Date(this.inputData[0].ReadingTime);
      lastmonthDate.setMonth(lastmonthDate.getMonth() - 1);
      let inputDate = new Date(this.inputData[0].ReadingTime);
      let inputMonth = inputDate.getMonth();
      this.userService.getMeterDetails(lastmonthDate.getTime(),
        this.userData['uid']).subscribe(resData => {
          resData = resData.filter((el: any) => el.uid == this.userData['uid']);
          if (this.isImported) {
            this.isImported = false;
            return false;
          }
          this.isImported = true;
          let currentMonthData = resData.find(data => {
            if (new Date(data['ReadingTime']).getMonth() == inputMonth) {
              return true;
            }
            if (this.sharedService.dateDiffIndays(new Date(data['ReadingTime']), inputDate) < 25) {
              return true;
            }
            return false;
          });


          if (currentMonthData) {
            console.log('data is already there');
            this.alertService.error("Cannot import this data for this month.");
            return false;
          } else {
            
            var batch = this.firebaseService.getBatch();
            if (resData && resData.length > 0) {

              let arrBilldata = {};
              let resBillData = [];
              resData.forEach(billdata => {
                arrBilldata[billdata['MeterSerialNumber']] = billdata;
              })
              this.inputData.forEach(inputBillData => {
                resBillData.push(this.calculateBill(inputBillData, arrBilldata[inputBillData.MeterSerialNumber]));
              });
              this.userService.getMultipleUser(this.userData['uid']).subscribe(resUser => {
                let arrUserId = resUser.map((el:any) => el.customerNumber);

                resBillData.forEach(async (billdata, index) => {
                  if(arrUserId.includes(billdata.CustomerNumber)) {
                    let readingTime = new Date(billdata.ReadingTime.toString()).getTime();
                    let docId = `${billdata.CustomerNumber + `-` + billdata.MeterSerialNumber + `-` + readingTime}`;
                    let ref = meterDetailsCollection.doc(docId);

                    billdata['ReadingTimeTimestamp'] = readingTime;
                    billdata['uid'] = this.userData['uid'];
                    billdata['_id'] = docId;

                    billdata['type'] = this.sharedService.getMeterType(billdata['MeterType']);

                    batch.set(ref, billdata);
                    this.succededMeters.push({
                      meterId:billdata.MeterSerialNumber,
                      date: new Date()

                    });
                  } else {
                    this.failedMeters.push({
                      meterId:billdata.MeterSerialNumber,
                      date: new Date()

                    });
                  }
                });
                batch.commit().then(resData => {
                  console.log(resData);
                  this.fileReset();
                  this.createImportHistory(resBillData);
                  this.alertService.success("Successfully Imported");

                  this.router.navigate(['/import/list']);
                }).catch(err => {
                  console.log(err);
                });
              });


            }
            else {
              //imported first time
              this.inputData.forEach(async (billdata, index) => {

                let readingTime = new Date(billdata.ReadingTime.toString()).getTime();
                let docId = `${billdata.CustomerNumber + `-` + billdata.MeterSerialNumber + `-` + readingTime}`;
                let ref = meterDetailsCollection.doc(docId);

                billdata['ReadingTimeTimestamp'] = readingTime;
                billdata['uid'] = this.userData['uid'];
                billdata['_id'] = docId;
                switch (billdata['MeterType']) {
                  case 'MULTICAL 602':
                    billdata['type'] = 'heat';
                    break;
                  case 'MULTICAL 62':
                    billdata['type'] = 'water';
                    break;
                  case 'OMNIPOWER':
                    billdata['type'] = 'electricity';
                    break;
                }
                this.succededMeters.push({
                  meterId:billdata.MeterSerialNumber,
                  date: new Date()

                });
                batch.set(ref, billdata);
              });
              batch.commit().then(resData => {
                // console.log(resData);
                this.fileReset();
                this.alertService.success("Successfully Imported");
                this.createImportHistory(this.inputData);

                this.router.navigate(['/import/list']);

              }).catch(err => {
                console.log(err);
              });
            }
          }

        });

    }
  }


  chunkArray(inputArray, perChunk) {


    return inputArray.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / perChunk)

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }

      resultArray[chunkIndex].push(item)

      return resultArray
    }, [])
  }

  createImportHistory(resBillData) {



    let billData = resBillData[0];
    let readingTime = new Date(billData.ReadingTime.toString()).getTime();
    let docId = `${billData.CustomerNumber + `-` + billData.MeterSerialNumber + `-` + readingTime}`;
    let importHistoryData = {
      _id: docId,
      importedDate: billData.ReadingTime,
      importedData: resBillData.length,
      importedFile: this.fileName,
      dateCreated: new Date(),
      uid: this.userData['uid'],
      succededMeters : this.succededMeters,
      failedMeters : this.failedMeters
    }
    this.meterService.createImportHistory(importHistoryData);

  }


  calculateBill(billdata, selectedMeterData) {
    let selectedTarriff = '';
    if (selectedMeterData && billdata['ReadingTime'] != selectedMeterData['ReadingTime']) {
      let charges = 0;
      let waterCharges = 0;
      let heatCharges = 0;
      if(billdata.MeterType == 'OMNIPOWER') {
        //electricity bill calculation
        let electicityUsage = billdata.ElectricityEnergy - selectedMeterData['ElectricityEnergy'];
    
        if (electicityUsage <= this.limitUsage) {
          charges = electicityUsage * this.settingData.electricTarriff1;
          selectedTarriff = this.settingData.electricTarriff1;
        }
        if (electicityUsage >= this.limitUsage) {
          charges = (this.limitUsage * this.settingData.electricTarriff1) + (electicityUsage - this.limitUsage) * this.settingData.electricTarriff2;
        }
      }

      if(billdata.MeterType == 'MULTICAL 62') {
        //water bill calculation
        let waterUsage = billdata.VolumeWater - selectedMeterData['VolumeWater'];
        if (waterUsage > 0 && waterUsage <= this.waterMaxBand1) {
          waterCharges = waterUsage * this.settingData.waterTarriff1;
        }
        if (waterUsage > this.waterMaxBand1 && waterUsage <= this.waterMaxBand2) {
          waterCharges = (this.waterMaxBand1 * this.settingData.waterTarriff1) + ((waterUsage - this.waterMaxBand1) * this.settingData.waterTarriff2);
        }
        if (waterUsage > this.waterMaxBand2) {
          waterCharges = (this.waterMaxBand1 * this.settingData.waterTarriff1) + ((this.waterMaxBand2 - this.waterMaxBand1) * this.settingData.waterTarriff2) + ((waterUsage - this.waterMaxBand2) * this.settingData.waterTarriff3);
        }
        if (waterCharges < this.minWaterBill) {
          waterCharges = this.minWaterBill;
        }
      }

      if(billdata.MeterType == 'MULTICAL 602') {
        //heat bill calculation
        let heatUsage = billdata.CoolingEnergy - selectedMeterData['CoolingEnergy'];
        if (heatUsage > 0 && heatUsage <= this.heatMaxBand1) {
          heatCharges = heatUsage * this.settingData.heatTarriff1;
        }
        if (heatUsage > this.heatMaxBand1 && heatUsage <= this.heatMaxBand2) {
          heatCharges = (this.heatMaxBand1 * this.settingData.heatTarriff1) + ((heatUsage - this.heatMaxBand1) * this.settingData.heatTarriff2);
        }
        if (heatUsage > this.heatMaxBand2) {
          heatCharges = (this.heatMaxBand1 * this.settingData.heatTarriff1) + ((this.heatMaxBand2 - this.heatMaxBand1) * this.settingData.heatTarriff2) + (heatUsage * this.settingData.heatTarriff3);
        }
        if (heatCharges < this.minHeatBill) {
          heatCharges = this.minHeatBill;
        }
      }



      billdata['electricityCharges'] = charges;
      billdata['waterCharges'] = waterCharges;
      billdata['HeatCharges'] = heatCharges;
      billdata['lastElectricityEnergy'] = selectedMeterData['ElectricityEnergy'] || 0;
      billdata['lastVolumeWater'] = selectedMeterData['VolumeWater'] || 0;
      billdata['lastCoolingEnergy'] = selectedMeterData['CoolingEnergy'] || 0;

    }
    return billdata;
  }

}



export class CSVRecord {

  public firstName: any;
  public lastName: any;
  public email: any;
  public phoneNumber: any;
  public title: any;
  public occupation: any;

  constructor() {

  }
}