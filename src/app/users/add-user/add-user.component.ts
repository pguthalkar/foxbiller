import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup,FormArray, Validators,FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { User } from '../../_models/index';
import { UserService,SharedService } from '../../_services/index';
import countries from '../../../assets/country.json';
import {
  Router,
  ActivatedRoute
} from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  public userForm: FormGroup;
  countryCode = countries;
  meterSectionHeight = 250;
  isAddMeterButton = true;
  isRemoveMeterButton = false;
  userRoles = [
    {
      'name' : 'Master',
      'value' : 'master',
    },
    {
      'name' : 'Admin',
      'value' : 'admin',
    },
    {
      'name' : 'User',
      'value' : 'user',
    }
  ];
  meterTypes = [
    {
      name : 'Heat'
    },
    {
      name : 'Electricity'
    },
    {
      name : 'Cool'
    }
  ]
  userData;
  userId : string;
  constructor(private location: Location, private userService:UserService, private auth:AuthService,
     private router: Router,
     private route :ActivatedRoute,
     private sharedService:SharedService,
     private _fb: FormBuilder
     ) { }
  loggedInUser;
  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.loggedInUser = JSON.parse(this.sharedService.getLocalStorage('user'));
    if(this.userId) {
      this.editUser(this.userId);
      this.userForm = this._fb.group({
        name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        officePhone: new FormControl('', [Validators.required, Validators.maxLength(10)]),
        code: new FormControl('', [Validators.required]),
        role: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        company: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        addressDetail: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        postalCode: new FormControl('', [Validators.required]),
        // meterId: new FormControl('', [Validators.required]),
        // meterType: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required, Validators.maxLength(10)]),
        companyRegNo: new FormControl('', [Validators.required]),
        note: new FormControl('', [Validators.required]),
        meters: this._fb.array([this.initMeter()])
      });
      
    }
    else {

     
      this.userForm = this._fb.group({
        name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        officePhone: new FormControl('', [Validators.required, Validators.maxLength(10)]),
        code: new FormControl('', [Validators.required]),
        role: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        company: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        addressDetail: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        postalCode: new FormControl('', [Validators.required]),
        // meterId: new FormControl('', [Validators.required]),
        // meterType: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required, Validators.maxLength(10)]),
        companyRegNo: new FormControl('', [Validators.required]),
        note: new FormControl('', [Validators.required]),
        meters: this._fb.array([
          this.initMeter(),
        ])
      });
    }
    switch(this.loggedInUser.role) {

      case 'master' :
        this.userRoles = [
          {
            'name' : 'Admin',
            'value' : 'admin',
          },
          {
            'name' : 'Master',
            'value' : 'master',
          }
        ]
      break;
    
      case 'admin' :
      this.userRoles = [
        {
          'name' : 'User',
          'value' : 'user',
        }
      ]
      break;
    }
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.userForm.controls[controlName].hasError(errorName);
  }
 
  public onCancel = () => {
    this.location.back();
  }

  removeMeter = (i : number) =>  {
    const control = <FormArray>this.userForm.controls['meters'];
    control.removeAt(i);
    if(control.length <= 2) {
      this.isAddMeterButton = true;
    }
    if(control.length == 1) {
      this.isRemoveMeterButton = false;
    }
  }

  public addMeter = () => {
    const control = <FormArray>this.userForm.controls['meters'];
    switch(control.length) {
      case 2 : 
        this.meterSectionHeight = 320;
        break;
      case 3 :
        this.meterSectionHeight = 390;
        break;
      default :
        this.meterSectionHeight = 250;
    }
    if(control.length < 3) {
      control.push(this.initMeter());
    } 
    if(control.length >= 3) { 
      this.isAddMeterButton = false;
    }
    if(control.length > 1) {
      this.isRemoveMeterButton = true;
    }
  }
 
  public createUser = (userFormValue) => {
    if(userFormValue.role === 'user') {
      userFormValue['parent'] = this.loggedInUser.uid;
    }
    if (this.userForm.valid) {
      if(this.userId) {
        this.executeUserUpdation(userFormValue);
      } else {
        this.executeUserCreation(userFormValue);
      }
    }
  }
 
  private executeUserCreation = (userFormValue) => {
    
 
    this.userService.createUser(userFormValue);

    this.router.navigate(['/users']);
    
  }
  private executeUserUpdation = (userFormValue) => {
   
 
    this.userService.updateUser(this.userId,userFormValue);

    this.router.navigate(['/users']);
    
  }

  initMeter(meter = null) {
    if(meter) {
      return this._fb.group({
        meterId: [meter['meterId']],
        meterType: [meter['meterType']]
    });
    }
    else {
      return this._fb.group({
          meterId: [''],
          meterType: ['']
      });
    }
  }

  editUser(userId) {
    let condn = {
      'key': 'uid',
      'value': userId
    }
    this.userService.getUserCondn(condn).subscribe(userData => {

      this.userData = userData ? userData[0] : {};
      // this.userForm.controls['name'].value = this.userData.name;
      this.userForm.controls['name'].setValue(this.userData.name);
      this.userForm.controls['email'].setValue(this.userData.email);
      this.userForm.controls['officePhone'].setValue(this.userData.officePhone);
      this.userForm.controls['code'].setValue(this.userData.code);
      this.userForm.controls['role'].setValue(this.userData.role);
      this.userForm.controls['company'].setValue(this.userData.company);
      this.userForm.controls['address'].setValue(this.userData.address);
      this.userForm.controls['addressDetail'].setValue(this.userData.addressDetail);
      this.userForm.controls['phone'].setValue(this.userData.phone);
      this.userForm.controls['note'].setValue(this.userData.note);
      this.userForm.controls['city'].setValue(this.userData.city);
      this.userForm.controls['country'].setValue(this.userData.country);
      this.userForm.controls['state'].setValue(this.userData.state);
      this.userForm.controls['postalCode'].setValue(this.userData.postalCode);
      this.userForm.controls['companyRegNo'].setValue(this.userData.companyRegNo);
      // this.userForm.controls['meters'].setValue(this.userData.meters);
      const control = <FormArray>this.userForm.controls['meters'];
      control.removeAt(0);
      this.userData.meters.forEach(meter => {
        control.push(this.initMeter(meter));
      });

      switch(control.length) {
        case 2 : 
          this.meterSectionHeight = 320;
          break;
        case 3 :
          this.meterSectionHeight = 390;
          break;
        default :
          this.meterSectionHeight = 250;
      }
      if(control.length >= 3) { 
        this.isAddMeterButton = false;
      }
      if(control.length > 1) {
        this.isRemoveMeterButton = true;
      }
      // console.log(<FormArray>this.userForm.controls['meters']);

    });
  }

}
