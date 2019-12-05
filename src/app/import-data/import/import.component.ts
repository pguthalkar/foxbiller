import { Component, OnInit, ViewChild } from '@angular/core';
// import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit, CdkDragStart, CdkDrag } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit, CdkDragStart, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { AlertService, FirebaseService } from '../../_services/index';
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
     private userService:UserService
     ) { }
  csvFields = [
  ];
  inputData = [];
  arrBillsRequests = [];

  tariffA = 0.435;
  tariffB = 0.509;
  limitUsage = 200;
  availableFields = [
    {
      'name': 'CustomerName',
      'required': true,
      'mapped': []
    },
    {
      'name': 'CustomerNumber',
      'required': true,
      'mapped': []
    },
    {
      'name': 'MeterSerialNumber',
      'required': true,
      'mapped': []
    },
    {
      'name': 'MeterType',
      'required': true,
      'mapped': []
    },
    {
      'name': 'ReadingTime',
      'required': true,
      'mapped': []
    },
    {
      'name': 'ElectricityEnergy',
      'required': true,
      'mapped': []
    }, {
      'name': 'EUnit',
      'required': false,
      'mapped': []
    },
    {
      'name': 'CoolingEnergy',
      'required': false,
      'mapped': []
    }, {
      'name': 'CUnit',
      'required': false,
      'mapped': []
    },
    {
      'name': 'Flow1',
      'required': false,
      'mapped': []
    },
    {
      'name': 'VolumeWater',
      'required': false,
      'mapped': []
    }, {
      'name': 'WUnit',
      'required': false,
      'mapped': []
    }, {
      'name': 'Temperature1',
      'required': false,
      'mapped': []
    }, {
      'name': 'T1Unit',
      'required': false,
      'mapped': []
    },
    {
      'name': 'Temperature2',
      'required': false,
      'mapped': []
    }, {
      'name': 'T2Unit',
      'required': false,
      'mapped': []
    },
    {
      'name': 'InfoCodes',
      'required': false,
      'mapped': []
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

  async calculateBillAmount(billdata) {
   
    // console.log(meterData);

    

  }

  async importData() {
    // console.log(this.availableFields);
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


      let lastmonthDate = new Date(this.inputData[0].ReadingTime);
      lastmonthDate.setMonth(lastmonthDate.getMonth()-1);
      this.userService.getMeterDetails(lastmonthDate.getTime()).subscribe(resData => {
        console.log(resData);
        let arrBilldata = {};
        let resBillData = [];
        resData.forEach( billdata=> {
          arrBilldata[billdata['CustomerNumber']] = billdata;
        })
        this.inputData.forEach(inputBillData => {
          resBillData.push(this.calculateBill(inputBillData,arrBilldata[inputBillData.CustomerNumber]));
        });
        console.log(resBillData);

      });
      
      let arrCustomerId = [];
      /*
      inputData.forEach(async (billdata) => {
        // let charges = await this.calculateBillAmount(element);
        billdata['ReadingTimeTimestamp'] = new Date(billdata.ReadingTime.toString()).getTime();
        await this.firebaseService.insertData(billdata, 'meterDetails')
        .then(
          res => {
            // this.resetFields();
            // this.router.navigate(['/home']);
          }
        );
        arrCustomerId.push(billdata.CustomerNumber);
        // this.arrBillsRequests.push( await this.userService.getMeterDetails(condn));
        

      });*/

      let condn = //[
        {
          "key" : "CustomerNumber",
          "value" : arrCustomerId
        };
      // this.userService.getMeterDetails(condn);

      // forkJoin(this.arrBillsRequests).subscribe(responseList => {
      //   console.log(responseList);
      // });
      
    }
  }

  calculateBill(billdata, meterData) {
    let filteredMeterData = meterData.filter(element => {
      let readingTime = new Date(billdata.ReadingTime.toString()); 
      let lastReadingTime = new Date(element['ReadingTime'].toString()); 
      var diff = Math.abs(readingTime.getTime() - lastReadingTime.getTime());
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
      return diffDays <=31 && element['ElectricityEnergy'];
    });
    let selectedMeterData = filteredMeterData[0] ? filteredMeterData[0] : {};
    if(selectedMeterData) {
      let electicityUsage = billdata.ElectricityEnergy - selectedMeterData['ElectricityEnergy'];
      let charges = 0;
      if(electicityUsage <= this.limitUsage) {
        charges = electicityUsage * this.tariffA;
      } 
      if(electicityUsage >= this.limitUsage) {
        charges = charges + (electicityUsage - this.limitUsage) * this.tariffB;
      }

      //water bill calculation
      
      billdata['electricityCharges'] = charges;
     
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