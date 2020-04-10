import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from './core/auth.service';
import currencies from '../../assets/currency.json';
import timezones from '../../assets/timezone.json';
import countries from '../../assets/country.json';
import { SharedService, MeterService, AlertService } from '../_services/index';
import {
    Router,
    ActivatedRoute
} from '@angular/router';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    loggedInUser;
    arrCurrencies = currencies;
    arrTimezones = timezones;
    arrCountries = countries;
    settingData;
    constructor(
        private _formBuilder: FormBuilder,
        private sharedService: SharedService,
        private meterService: MeterService,
        private router: Router,
        private route: ActivatedRoute,
        private alertService:AlertService) { }
    isSettingEdit = false;
    ngOnInit() {
        this.loggedInUser = JSON.parse(this.sharedService.getLocalStorage('user'));
        this.meterService.getSettings(this.loggedInUser.uid).subscribe(settingData => {
            if (settingData) {
                this.isSettingEdit= true;
                this.settingData = settingData ? settingData[0] : {};

                this.firstFormGroup.controls['ownerName'].setValue(this.settingData.ownerName);
                this.firstFormGroup.controls['accountEmail'].setValue(this.settingData.accountEmail);
                this.firstFormGroup.controls['businessName'].setValue(this.settingData.businessName);
                this.firstFormGroup.controls['phone'].setValue(this.settingData.phone);
                this.firstFormGroup.controls['street'].setValue(this.settingData.street);
                this.firstFormGroup.controls['address'].setValue(this.settingData.address);
                this.firstFormGroup.controls['city'].setValue(this.settingData.city);
                this.firstFormGroup.controls['postalCode'].setValue(this.settingData.postalCode);
                this.firstFormGroup.controls['country'].setValue(this.settingData.country);
                this.firstFormGroup.controls['state'].setValue(this.settingData.state);
                this.firstFormGroup.controls['bankBusinessName'].setValue(this.settingData.bankBusinessName);
                this.firstFormGroup.controls['bankName'].setValue(this.settingData.bankName);
                this.firstFormGroup.controls['bankAccountNumber'].setValue(this.settingData.bankAccountNumber);
                this.firstFormGroup.controls['paymentTerm'].setValue(this.settingData.paymentTerm);

                this.secondFormGroup.controls['heatTarriff1'].setValue(this.settingData.heatTarriff1);
                this.secondFormGroup.controls['heatTarriff2'].setValue(this.settingData.heatTarriff2);
                this.secondFormGroup.controls['heatTarriff3'].setValue(this.settingData.heatTarriff3);
                this.secondFormGroup.controls['heatCurrency'].setValue(this.settingData.heatCurrency);
                this.secondFormGroup.controls['heatTimezone'].setValue(this.settingData.heatTimezone);
                this.secondFormGroup.controls['heatBillingCycle'].setValue(this.settingData.heatBillingCycle);
                this.secondFormGroup.controls['heatBillingDate'].setValue(new Date(this.settingData.heatBillingDate.seconds * 1000 ));

                this.secondFormGroup.controls['electricTarriff1'].setValue(this.settingData.electricTarriff1);
                this.secondFormGroup.controls['electricTarriff2'].setValue(this.settingData.electricTarriff2);
                this.secondFormGroup.controls['electricCurrency'].setValue(this.settingData.electricCurrency);
                this.secondFormGroup.controls['electricTimezone'].setValue(this.settingData.electricTimezone);
                this.secondFormGroup.controls['electricBillingCycle'].setValue(this.settingData.electricBillingCycle);
                this.secondFormGroup.controls['electricBillingDate'].setValue(new Date(this.settingData.electricBillingDate.seconds * 1000 ));

                this.secondFormGroup.controls['waterTarriff1'].setValue(this.settingData.waterTarriff1);
                this.secondFormGroup.controls['waterTarriff2'].setValue(this.settingData.waterTarriff2);
                this.secondFormGroup.controls['waterTarriff3'].setValue(this.settingData.waterTarriff3);
                this.secondFormGroup.controls['waterCurrency'].setValue(this.settingData.waterCurrency);
                this.secondFormGroup.controls['waterTimezone'].setValue(this.settingData.waterTimezone);
                this.secondFormGroup.controls['waterBillingCycle'].setValue(this.settingData.waterBillingCycle);
                this.secondFormGroup.controls['waterBillingDate'].setValue(new Date(this.settingData.waterBillingDate.seconds * 1000 ));

            }
        });


        this.firstFormGroup = this._formBuilder.group({
            ownerName: ['', Validators.required],
            accountEmail: ['', Validators.required],
            businessName: ['', Validators.required],
            phone: ['', Validators.required],
            street: ['', Validators.required],
            address: [''],
            city: ['', Validators.required],
            postalCode: ['', Validators.required],
            country: ['', Validators.required],
            state: ['', Validators.required],
            bankBusinessName: ['', Validators.required],
            bankName: ['', Validators.required],
            bankAccountNumber: ['', Validators.required],
            paymentTerm: ['', Validators.required]


        });
        this.secondFormGroup = this._formBuilder.group({
            heatTarriff1: ['', Validators.required],
            heatTarriff2: ['', Validators.required],
            heatTarriff3: ['', Validators.required],
            heatCurrency: ['', Validators.required],
            heatTimezone: ['', Validators.required],
            heatBillingCycle: [''],
            heatBillingDate: [''],
            electricTarriff1: ['', Validators.required],
            electricTarriff2: ['', Validators.required],
            electricCurrency: ['', Validators.required],
            electricTimezone: ['', Validators.required],
            electricBillingCycle: [''],
            electricBillingDate: [''],
            waterTarriff1: ['', Validators.required],
            waterTarriff2: ['', Validators.required],
            waterTarriff3: ['', Validators.required],
            waterCurrency: ['', Validators.required],
            waterTimezone: ['', Validators.required],
            waterBillingCycle: [''],
            waterBillingDate: [''],
        });
    }

    public createSetting = () => {
        let settingFormValue = { ...this.firstFormGroup.value, ...this.secondFormGroup.value };
        
            settingFormValue['uid'] = this.loggedInUser.uid;
        
        settingFormValue['heatBillingDate'] = new Date(settingFormValue.heatBillingDate);
        settingFormValue['electricBillingDate'] = new Date(settingFormValue.electricBillingDate);
        settingFormValue['waterBillingDate'] = new Date(settingFormValue.waterBillingDate);
        if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
            this.sharedService.setLocalStorage('settingData',JSON.stringify(settingFormValue));
            if (this.isSettingEdit) {
                this.executeSettingUpdation(settingFormValue);
            } else {
                this.executeSettingCreation(settingFormValue);
            }
        }
    }

    private executeSettingCreation = (settingFormValue) => {


        this.meterService.createSetting(settingFormValue);

        // this.router.navigate(['/setting']);
        this.alertService.success("Successfully Created.");

    }
    private executeSettingUpdation = (settingFormValue) => {
        this.meterService.updateSetting(settingFormValue);
        this.alertService.success("Successfully Updated.");
    }
}
