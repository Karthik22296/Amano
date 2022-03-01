import { Component, OnInit } from '@angular/core';
import { NewUser } from 'src/app/models/newUser';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { License, LicenseInfo } from 'src/app/models/licenseInfo';
import { CommonService } from 'src/app/services/common.service';
import { AppService } from 'src/app/app.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { LanguageService } from 'src/app/services/language-service';
import { fromEvent, Observable, Subscriber } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { FileInput, FileValidator } from 'ngx-material-file-input';
import { Lookup } from 'src/app/models/LookUp';

@Component({
  selector: 'app-license-two',
  templateUrl: './license-two.component.html',
  styleUrls: ['./license-two.component.scss']
})
export class LicenseTwoComponent implements OnInit {
  userRegistration: NewUser = new NewUser();
  existing_license_front_preview;
  existing_license_rear_preview;
  licenseFormGroup: FormGroup;
  licenseInfo2: LicenseInfo = new LicenseInfo();
  selected: any;
  license: License[] = new Array<License>();
  list = [];
  buyPage: boolean = false;
  package: any;
  subscription;
  alive: boolean = true;
  lan: boolean;
  imgSrc: Blob = null;
  existingLicList: Lookup[];
  filterExistingLic: Lookup[];
  existLic;
  translateVal: string;
  licenseInfo = {
    existingLicense_id: null,
    expiry_date: null
  }
  packDt = {
    id: '',
    payment_phase: '',
    first_phase_amount: '',
    final_package_price: ''
  }
  dialogRef: MatDialogRef<any>;
  handler: any;
  apiUrl: string;


  constructor(private _formBuilder: FormBuilder, private appService: AppService,
    private commonService: CommonService, public dialog: MatDialog, private languageService: LanguageService) {
    this.lan = this.languageService.language == 'en' ? true : false;
    this.translateVal = (localStorage.lang == 'ml' ? 'malay' : 'english');
    this.subscription = this.languageService.languageChanged.pipe(takeWhile(() => this.alive)).subscribe(() => {
      this.lan = this.languageService.language == 'en' ? true : false;
      this.translateVal = (localStorage.lang == 'ml' ? 'malay' : 'english');
    });


  }
  proceed() {
    if (this.list.length > 0) {
      this.buyPage = true;
      this.commonService.getPackageInfo(this.list).subscribe(res => {
        this.package = res;
      })
    }
    else {
      this.commonService.showSnackBar("Select a licience")
    }

  }

  ngOnInit(): void {
    this.getLicenseFormFields();
    this.getLicenceListForCustomer();
    this.getExistingLicList();
    this.loadStripe();
    this.apiUrl = this.commonService.getConfig('apiUrl');
  }
  getLicenseFormFields() {
    this.licenseFormGroup = this._formBuilder.group({
      ExistingLicense: [''],
      LicenseExpiryDate: [''],
      existing_license_front: [''],
      existing_license_rear: [''],
      existing_license_front_name: [{ value: undefined, disabled: false }, [FileValidator.maxContentSize(4194304)]],
      existing_license_rear_name: [{ value: undefined, disabled: false }, [FileValidator.maxContentSize(4194304)]],
      cdl_licence: new FormControl('0')
    })
  }
  get validate() {
    return this.licenseFormGroup.controls;
  }
  onFileChangePhoto(event, filetype) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      const blob = new Blob([file], { type: event.target.files[0].type });
      this[filetype + '_preview'] = blob;
      this.licenseFormGroup.patchValue({
        [filetype]: file
      })
    }
  }
  readFile(file: File | Blob): Observable<any> {
    const reader = new FileReader();
    let loadend = fromEvent(reader, 'loadend').pipe(
      map((read: any) => {
        return read.target.result;
      })
    );
    reader.readAsDataURL(file);
    return loadend;
  }

  getLicenceListForCustomer() {
    this.licenseInfo2.cdl_license = this.licenseFormGroup.get('cdl_licence').value;
    this.commonService.getLicenceListCustomer(this.licenseInfo2).subscribe(res => {
      if (res) {
        this.license = res;
      }
    })
  }


  packageChecked(event, Id) {
    if (event) {
      this.list.push(Id);
    }
    else
      this.list = this.list.filter(f => f != Id);
  }
  receipt(pack) {
    
    this.packDt.id = pack.id;
    this.packDt.payment_phase = pack.payment_phase;
    this.packDt.first_phase_amount = pack.first_phase_amount;
    this.packDt.final_package_price = pack.final_package_price;
    var payamount = pack.payment_phase == 1 ? pack.final_package_price : pack.first_phase_amount;
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_aeUUjYYcx4XNfKVW60pmHTtI',
      locale: 'auto',
      token: (token: any) => {
        const formData = new FormData();
       let licenseInfo={
          existingLicense_id: this.licenseFormGroup.get('ExistingLicense').value,
          expiry_date:this.licenseFormGroup.get('LicenseExpiryDate').value
          }
        // formData.append('licenseSelected',JSON.stringify(this.list));
       // formData.append('expiry_date', )
        formData.append('packDt', JSON.stringify(this.packDt));
       
        formData.append('licenseInfo',JSON.stringify(licenseInfo));
        formData.append('existing_license_front', this.licenseFormGroup.get('existing_license_front').value);
        formData.append('existing_license_rear',this.licenseFormGroup.get('existing_license_rear').value);

        this.commonService.setStudentPackageDetails(formData).subscribe(res => {
          if (res) {
            this.dialogRef = this.dialog.open(ConfirmDialogComponent);
            this.dialogRef.componentInstance.data = res.data;
            this.dialogRef.componentInstance.pack = this.license.filter(f => this.list.includes(f.id)).map(m => m.license_class);

          }
        })

      }
    })
    handler.open({
      name: 'Demo Site',
      description: '2 widgets',
      amount: payamount * 100
    });

  }
  getExistingLicList() {
    this.commonService.getExistingLicList().subscribe(res => {
      this.existingLicList = res;
      this.filterExistingLic = res;

    })
  }
  displayfn(id) {
    return this.existingLicList?.find(f => f.id == id)[this.translateVal];
  }
  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_aeUUjYYcx4XNfKVW60pmHTtI',
          locale: 'auto',
          token: function (token: any) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            console.log(token)
            alert('Payment Success!!');
          }
        });
      }
      window.document.body.appendChild(s);
    }
  }
}
