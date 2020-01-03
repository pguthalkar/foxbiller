import { Component, OnInit, ViewChild } from '@angular/core';
// import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit, CdkDragStart, CdkDrag } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit, CdkDragStart, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { AlertService, FirebaseService,SharedService } from '../../_services/index';
import { UserService } from '../../_services/index';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';  // RxJS 6 syntax

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
    private sharedService: SharedService
  ) { 

    this.userData = this.sharedService.getLocalStorage('user') ? JSON.parse(this.sharedService.getLocalStorage('user')) : {};
  }
  userData = {};
  csvFields = [
  ];
  inputData = [];
  arrBillsRequests = [];
  flag = false;
  tariffA = 0.435;
  tariffB = 0.509;

  waterTariff1 = 0.80;
  waterTariff2 = 2;
  waterTariff3 = 3;

  minWaterCharge = 50;

  limitUsage = 200;
  waterMaxBand1: number = 20;
  waterMaxBand2: number = 35;
  minWaterBill = 50;

  heatMaxBand1: number = 100;
  heatMaxBand2: number = 500;
  minHeatBill = 0;
  heatTariff1 = 1.50;
  heatTariff2 = 2;
  heatTariff3 = 3;


  availableFields = [
    {
      'name': 'CustomerName',
      'required': true,
      'mapped': ['Customer name']
    },
    {
      'name': 'CustomerNumber',
      'required': true,
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
      'required': true,
      'mapped': ['Electricity energy']
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
    },
    {
      'name': 'Flow1',
      'required': false,
      'mapped': ['Flow 1']
    },
    {
      'name': 'VolumeWater',
      'required': false,
      'mapped': ['Volume Water']
    }, {
      'name': 'WUnit',
      'required': false,
      'mapped': ['WUnit']
    }, {
      'name': 'Temperature1',
      'required': false,
      'mapped': ['Temperature 1']
    }, {
      'name': 'T1Unit',
      'required': false,
      'mapped': ['T1Unit']
    },
    {
      'name': 'Temperature2',
      'required': false,
      'mapped': ['Temperature 2']
    }, {
      'name': 'T2Unit',
      'required': false,
      'mapped': ['T2Unit']
    },
    {
      'name': 'InfoCodes',
      'required': false,
      'mapped': ['Info codes']
    }
  ];
  inactiveCustomers = [];
  ngOnInit() {
  }
  title = 'app';
  public csvRecords: any[] = [];

  @ViewChild('fileImportInput', { static: true }) fileImportInput: any;

  fileChangeListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files;

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

  // getDateDiffDays(date1:String , date2:String) {
  //   return  
  // }

  async importData() {
    // console.log(this.userData);

    // let inputData = [];
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
      this.userService.getMeterDetails(lastmonthDate.getTime()).subscribe(resData => {
        // console.log(resData);
        var batch = this.firebaseService.getBatch();
        if (resData && resData.length > 0) {

          let arrBilldata = {};
          let resBillData = [];
          resData.forEach(billdata => {
            arrBilldata[billdata['CustomerNumber']] = billdata;
          })
          this.inputData.forEach(inputBillData => {
            resBillData.push(this.calculateBill(inputBillData, arrBilldata[inputBillData.CustomerNumber]));
          });

          resBillData.forEach(async (billdata, index) => {
            let readingTime = new Date(billdata.ReadingTime.toString()).getTime();
            let ref = meterDetailsCollection.doc(`${billdata.CustomerNumber + `-` + billdata.MeterSerialNumber + `-` + readingTime}`);

            billdata['ReadingTimeTimestamp'] = readingTime;
            billdata['uid'] = this.userData['uid'];
            switch(billdata['MeterType']) {
              case 'MULTICAL 602' : 
                billdata['type'] = 'heat';
                break;
              case 'MULTICAL 62' : 
                billdata['type'] = 'water';
                break;
              case 'OMNIPOWER' : 
                billdata['type'] = 'electricity';
                break;
            }
            
            batch.set(ref, billdata);
          });
          batch.commit().then(resData => {
            console.log(resData);
            this.fileReset();
            this.alertService.success("Successfully Imported");

          }).catch(err => {
            console.log(err);
          });


        }
        else {
          this.inputData.forEach(async (billdata, index) => {
            let readingTime = new Date(billdata.ReadingTime.toString()).getTime();
            let ref = meterDetailsCollection.doc(`${billdata.CustomerNumber + `-` + billdata.MeterSerialNumber + `-` + readingTime}`);

            billdata['ReadingTimeTimestamp'] = readingTime;
            batch.set(ref, billdata);
          });
          batch.commit().then(resData => {
            console.log(resData);
            this.fileReset();
            this.alertService.success("Successfully Imported");

          }).catch(err => {
            console.log(err);
          });
        }

      });





      // this.userService.getMeterDetails(condn);

      // forkJoin(this.arrBillsRequests).subscribe(responseList => {
      //   console.log(responseList);
      // });

    }
  }

  calculateBill(billdata, selectedMeterData) {

    if (selectedMeterData && billdata['ReadingTime'] != selectedMeterData['ReadingTime']) {
      //electricity bill calculation
      let electicityUsage = billdata.ElectricityEnergy - selectedMeterData['ElectricityEnergy'];
      let charges = 0;
      let waterCharges = 0;
      let heatCharges = 0;
      if (electicityUsage <= this.limitUsage) {
        charges = electicityUsage * this.tariffA;
      }
      if (electicityUsage >= this.limitUsage) {
        charges =  (this.limitUsage * this.tariffA) + (electicityUsage - this.limitUsage) * this.tariffB;
      }
  

      //water bill calculation
      let waterUsage = billdata.VolumeWater - selectedMeterData['VolumeWater'];
      if (waterUsage > 0 && waterUsage <= this.waterMaxBand1) {
        waterCharges = waterUsage * this.waterTariff1;
      }
      if (waterUsage > this.waterMaxBand1 && waterUsage <= this.waterMaxBand2) {
        waterCharges = (this.waterMaxBand1 * this.waterTariff1) + ((waterUsage - this.waterMaxBand1) * this.waterTariff2);
      }
      if (waterUsage > this.waterMaxBand2) {
        waterCharges = (this.waterMaxBand1 * this.waterTariff1) + ((this.waterMaxBand2 - this.waterMaxBand1) * this.waterTariff2) + ((waterUsage - this.waterMaxBand2) * this.waterTariff3);
      }
      if (waterCharges < this.minWaterBill) {
        waterCharges = this.minWaterBill;
      }


      //heat bill calculation
      let heatUsage = billdata.CoolingEnergy - selectedMeterData['CoolingEnergy'];
      if (heatUsage > 0 && heatUsage <= this.heatMaxBand1) {
        heatCharges = heatUsage * this.heatTariff1;
      }
      if (heatUsage > this.heatMaxBand1 && heatUsage <= this.heatMaxBand2) {
        heatCharges = (this.heatMaxBand1 * this.heatTariff1) + ((heatUsage - this.heatMaxBand1) * this.heatTariff2);
      }
      if (heatUsage > this.heatMaxBand2) {
        heatCharges = (this.heatMaxBand1 * this.heatTariff1) + ((this.heatMaxBand2 - this.heatMaxBand1) * this.heatTariff2) + (heatUsage * this.heatTariff3);
      }
      if (heatCharges < this.minHeatBill) {
        heatCharges = this.minHeatBill;
      }



      billdata['electricityCharges'] = charges;
      billdata['waterCharges'] = waterCharges;
      billdata['HeatCharges'] = heatCharges;

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