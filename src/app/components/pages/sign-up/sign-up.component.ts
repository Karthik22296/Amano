import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Lookup } from 'src/app/models/LookUp';
import { NewUser } from 'src/app/models/newUser';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language-service'
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { StepperOrientation } from '@angular/material/stepper';
import { AppService } from 'src/app/app.service';
import { FileValidator } from 'ngx-material-file-input';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  flag = false;
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  currentFile = true;
  hide = true;
  userRegistration: NewUser = new NewUser();
  fileName = '';
  nricTypeList: Lookup[];
  nationalityList: Lookup[];
  placeOfBirthList: Lookup[];
  raceList: Lookup[];
  postalCodeList: Lookup[];
  preferenceList: Lookup[];
  photo_preview;
  nric_front_preview;
  nric_rear_preview;
  passport_front_preview;
  work_permit_preview;
  existing_license_front_preview;
  existing_license_rear_preview;
  confirmDocumentData;
  confirmPersonalData;
  confirmPreferenceData;
  lan: string;
  subscription: Subscription = new Subscription;
  alive = true;
  translateVal = (localStorage.lang == 'ml' ? 'malay' : 'english');
  filternrctype: Lookup[];
  filterplaceOfBirthList: any;
  filterraceList: any;
  filterpreferenceList: any;
  filterpostalCodeList: any;
  filternationalityList: any;
  city;
  state;
  filterCity;
  filterState;
  stepperOrientation: Observable<StepperOrientation>;
  nationality: any;
  pref: any;
  race: any;
  nricTYpe: any;
  pob: any;
  zip: any;

  constructor(private _formBuilder: FormBuilder, private commonService: CommonService, private languageService: LanguageService, private route: Router
    , public dialog: MatDialog, private breakpointObserver: BreakpointObserver, private AppService: AppService
    ,private modalService: NgbModal) { this.getDropdownList(); }
  ngOnInit() {
    sessionStorage.removeItem("authToken");
    this.AppService._loggedInChanged.next(false);
    this.getFormFields();
    this.subscription = this.languageService.languageChanged.pipe(takeWhile(() => this.alive)).subscribe(value => {
      this.translateVal = (localStorage.lang == 'ml' ? 'malay' : 'english');
    });
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this.flag = true;
  }
  getFormFields() {
    this.firstFormGroup = this._formBuilder.group({
      Name: ['', Validators.required],
      NRICNumber: ['',],
      NRICType: ['', Validators.required],
      PassportNum: [''],
      Dob: ['', Validators.required],
      Gender: ['', Validators.required],
      POB: ['', Validators.required],
      Nationality: ['', Validators.required],
      NIRCAddr: ['', Validators.required],
      Address1: [''],
      Address2: [''],
      Zip: ['', Validators.required],
      City: ['', Validators.required],
      State: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      MobNum: ['', Validators.required],
      Race: ['', Validators.required],
      OtherRace:['']
    });
    this.secondFormGroup = this._formBuilder.group({
      EmerContactName: [''],
      EmerContactNum: [''],
      // ExistLic: ['', Validators.required],
      userName: ['', Validators.required],
      PrefLang: ['', Validators.required],
      Password: ['', [
        Validators.required,
        Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)
      ]],
    });
    this.thirdFormGroup = this._formBuilder.group({
      photo: [{ value: undefined, disabled: false }, [FileValidator.maxContentSize(200000)]],
      photo_name: new FormControl('',),
      nric_front:  [{ value: undefined, disabled: false }, [FileValidator.maxContentSize(200000)]],
      nric_front_name: new FormControl(''),
      nric_rear:  [{ value: undefined, disabled: false }, [FileValidator.maxContentSize(200000)]],
      nric_rear_name: new FormControl(''),
      passport_front: [{ value: undefined, disabled: false }, [FileValidator.maxContentSize(200000)]],
      passport_front_name: new FormControl(''),
      work_permit:[{ value: undefined, disabled: false }, [FileValidator.maxContentSize(200000)]],
      work_permit_name: new FormControl(''),
      existing_license_front:[{ value: undefined, disabled: false }, [FileValidator.maxContentSize(200000)]],
      existing_license_front_name: new FormControl(''),
      existing_license_rear: [{ value: undefined, disabled: false }, [FileValidator.maxContentSize(200000)]],
      existing_license_rear_name: new FormControl(''),
    });
  }
  onFileChangePhoto(event, filetype) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      const blob = new Blob([file], { type: event.target.files[0].type });
      // this[filetype + '_name'] = blob;
      this.thirdFormGroup.patchValue({
        [filetype+'_name']: file
      })
     
    }
  }
  upload() { }
  get validate() {
    return this.firstFormGroup.controls;
  }
  get validate2() {
    return this.secondFormGroup.controls;
  }
  get validate3() {
    return this.thirdFormGroup.controls;
  }
  getDropdownList() {
    this.commonService.showLoader(true);
    this.commonService.getNRICType().subscribe((res: Lookup[]) => {
      this.nricTypeList = res;
      this.filternrctype = res;
    })
    this.commonService.getPOBList().subscribe(res => {
      this.placeOfBirthList = res;
      this.filterplaceOfBirthList = res;
    })

    this.commonService.getNationalityList().subscribe(res => {
      this.nationalityList = res;
      this.filternationalityList = res;
    })

    this.commonService.getRaceList().subscribe(res => {
      this.raceList = res;
      this.filterraceList = res;
    })

    this.commonService.getPreferenceList().subscribe(res => {
      this.preferenceList = res;
      this.filterpreferenceList = res;

    })

    this.commonService.getPostalCode().subscribe(res => {
      this.postalCodeList = res;
      this.filterpostalCodeList = res;

    }, error => { }, () => {
      localStorage.getItem('RegistrationData') ? this.userRegistration = JSON.parse(localStorage.getItem('RegistrationData')) : new NewUser();
      this.commonService.showLoader(false)
    }
    );
  }

  displayFunction(filter) {
    return filter ? filter[this.translateVal] : '';
  }
  displyZip(zip: Lookup) {
    return zip ? zip.postal_code : '';
  }
  zipSelected() {
    this.userRegistration.city = this.postalCodeList.find(f => f.id == this.userRegistration.postalCode).city;
    this.userRegistration.state = this.postalCodeList.find(f => f.id == this.userRegistration.postalCode).state;
  }
  displyNationality(national: Lookup) {
    return national ? national.country_name : '';
  }
  show() {
console.log(this.firstFormGroup)
    localStorage.setItem('RegistrationData', JSON.stringify(this.userRegistration));
    // console.log('date', this.userRegistration);
    // console.log('form1', this.firstFormGroup);
  }
  save(showStudent){ this.modalService.open(showStudent, { ariaLabelledBy: 'modal-basic-title' });}
  setConfirmStudentDetails() {
    if(this.thirdFormGroup.valid && this.firstFormGroup.valid&& this.secondFormGroup.valid){
    // this.userRegistration.apiToken = this.commonService.getConfig('apiToken');
    const formData = new FormData();
    formData.append('studentDetails', JSON.stringify(this.userRegistration));
    formData.append('photo', this.thirdFormGroup.get('photo_name').value);
    formData.append('nricFront', this.thirdFormGroup.get('nric_front_name').value);
    formData.append('nricRear', this.thirdFormGroup.get('nric_rear_name').value);
    formData.append('passportFront', this.thirdFormGroup.get('passport_front_name').value);
    formData.append('workPermit', this.thirdFormGroup.get('work_permit_name').value);
    console.log(formData);
    //this.openDialog();
    this.commonService.showLoader(true);
    this.commonService.saveDetails(formData).subscribe(res => {
      if (res) {
        this.commonService.showSnackBar("Successfully Registered ... !");
        this.modalService.dismissAll();
        localStorage.removeItem('RegistrationData');
        this.route.navigate(['/sign-in']);
      }
    }, error => { }, () => { this.commonService.showLoader(false) });}
  }
  openDialog() {
    this.dialog.open(ConfirmDialogComponent,);
  }
  displayfn(type, id) {
    if (id && this.flag) {
      switch (type) {
        case 'Nationality': this.nationality=this.nationalityList?.find(f => f.id == id).country_name;
           return this.nationality
        case 'NRICType':this.nricTYpe =this.nricTypeList?.find(f => f.id == id)[this.translateVal];
           return this.nricTYpe
        case 'POB':this.pob= this.placeOfBirthList?.find(f => f.id == id)[this.translateVal];
           return this.pob
        case 'Zip': this.zip=this.postalCodeList?.find(f => f.id == id);
           return this.zip.postal_code
        case 'Race': this.race=this.raceList?.find(f => f.id == id)[this.translateVal]
           return this.race;
        case 'Preference': this.pref=this.preferenceList?.find(f => f.id == id)[this.translateVal]
           return this.pref;
      }
    }
  }
  getICTypeChange() {

    const restrictList = [1, 2, 6]
    // this.personalDetailsForm.value.nric_number.charAt(this.personalDetailsForm.value.nric_number.length-1)
    if (restrictList.indexOf(this.userRegistration.nricType) >= 0) {
      if ((this.userRegistration.nric_number.charAt(this.userRegistration.nric_number.length - 1)) % 2 == 0) {
        this.userRegistration.gender = "Female"
      } else {
        this.userRegistration.gender = "Male";
      }
    } else {
      this.userRegistration.gender = ""; ``
    }
  }

  getNRICNumberChange() {
    if (this.userRegistration.nric_number) {
      this.commonService.checkNRICExistence(this.userRegistration.nric_number)
        .subscribe(res => {
          if (res['status'] == 'New') {
            this.userRegistration.date_of_birth = new Date((this.userRegistration.nric_number).substr(2, 2) + "/" + (this.userRegistration.nric_number).substr(4, 2) + "/" + (this.userRegistration
              .nric_number).substr(0, 2))
            const restrictList = [1, 2, 6]
            if (restrictList.indexOf(this.userRegistration.nricType) >= 0) {
              if ((this.userRegistration.nric_number.charAt(this.userRegistration.nric_number.length - 1)) % 2 == 0) {
                this.userRegistration.gender = "Female"
              } else {
                this.userRegistration.gender = "Male"
              }
            } else {
              this.userRegistration.gender = ""
            }
          } else {
            this.commonService.showSnackBar("NRIC Number Already Exists");
            this.userRegistration.nric_number = '';
          }

        })
    }
  }

  getPassportNumberChange() {
    if (this.userRegistration.passport_number) {
      this.commonService.checkPassportExistence(this.userRegistration.passport_number)
        .subscribe(res => {
          if (res['status'] == 'New') {
          } else {
            this.commonService.showSnackBar("Passport Number Already Exists");
            this.userRegistration.passport_number = '';
          }
        })
    }
  }
  userNameExist() {
    if (this.userRegistration.user_name) {
      this.commonService.checkUsernameExistence(this.userRegistration.user_name)
        .subscribe(res => {
          if (res['status'] == 'New') {
          } else {
            this.commonService.showSnackBar("User Name Already Exists");
            this.userRegistration.user_name = '';
          }
        })
    }
  }

  nricSelected() {
    var a = [2, 3, 4]
    this.userRegistration.nationality = a.includes(this.userRegistration.nricType) ? 135 : null
  }
}