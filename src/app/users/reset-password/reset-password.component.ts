import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import { UserService  } from '../../_services/index';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    private userService:UserService
    ) { }

  get formControl() { return this.resetPasswordForm.controls; }
  submitted = false;
  ngOnInit(): void {
    this.resetPasswordForm = this._fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    }
    )
  }
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  onSubmit() {
    const userId: string = this.route.snapshot.paramMap.get('id');
    const code: string = this.route.snapshot.paramMap.get('code');
    this.submitted = true;

    let input ={};
    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      this.userService.updateUser(userId, input);
        return;
    }

    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.resetPasswordForm.value))
}

}
