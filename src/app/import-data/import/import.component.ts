import { Component, OnInit, ViewChild } from '@angular/core';
// import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit, CdkDragStart, CdkDrag } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit, CdkDragStart, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { AlertService, FirebaseService } from '../../_services/index';
import { UserService } from '../../_services/index';
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

  tariffA = 0.435;
  tariffB = 0.509;
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

  async calculateBillAmount(billdata) {
    let condn = //[
      {
        "key" : "CustomerNumber",
        "value" : billdata.CustomerNumber
      };
    //   ,
    //   {
    //     "key" : "MeterSerialNumber",
    //     "value" : billdata.MeterSerialNumber
    //   }
    // ];
    await this.userService.getMeterDerails(condn).subscribe( meterData => {
      console.log(meterData);
      
      
      // let lastMonthEner

    });
    // console.log(meterData);

     // await this.firebaseService.insertData(element, 'meterDetails')
      //     .then(
      //       res => {
      //         console.log(res);
      //         // this.resetFields();
      //         // this.router.navigate(['/home']);
      //       }
      //     );

  }

  async importData() {
    // console.log(this.availableFields);
    let inputData = [];
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
          inputData.push(input);
        }

      });

      inputData.forEach(async (element) => {
        let prev = await this.calculateBillAmount(element);

        

      });
    }
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