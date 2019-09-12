import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { User } from '../../_models/index';
import { UserService,SharedService } from '../../_services/index';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  public userForm: FormGroup;
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
  ]
  constructor(private location: Location, private userService:UserService, private auth:AuthService,
     private router: Router,
     private sharedService:SharedService
     ) { }
  loggedInUser;
  ngOnInit() {

    this.loggedInUser = JSON.parse(this.sharedService.getLocalStorage('user'));
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', [Validators.required, Validators.maxLength(100)])
    });
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
 
  public createOwner = (userFormValue) => {
    
    if (this.userForm.valid) {

      this.executeOwnerCreation(userFormValue);
    }
  }
 
  private executeOwnerCreation = (userFormValue) => {
    let userData = {
       
      name: userFormValue.name,
      email: userFormValue.email,
      role: userFormValue.role
    }

    if(userFormValue.role === 'user') {
      userData['parent'] = this.loggedInUser.uid;
    }
 
    this.userService.createUser(userData);

    this.router.navigate(['/users']);
    
  }

}
