import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LanguageService } from 'src/app/services/language-service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { StudentScheduleService } from '../schedule/students-schedule.service';
import { AppService } from 'src/app/app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string') {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  nricNumberData: any;
  passportNumberData: any;
  tranNumberData: any;
  translateVal;
  statusDone;
  enrollment_no = new FormControl('', { validators: [autocompleteObjectValidator()] });
  enId: any;
  status_id: number;
  LicenseData: any;
  statusDetail: any;



  constructor(private fb: FormBuilder,
    private languageService: LanguageService, private timelineService: CommonService,
    public calendarService: StudentScheduleService,
    private modalService: NgbModal) {

  }

  nric_number = new FormControl('', { validators: [autocompleteObjectValidator()] });
  passport_number = new FormControl('', { validators: [autocompleteObjectValidator()] });
  registration_no = new FormControl('', { validators: [autocompleteObjectValidator()] });


  nricNumberList: Observable<string[]>;
  passportNumberList: Observable<string[]>;
  tranNumberList: Observable<string[]>;
  remark: string;
  statusList: any;
  statusUpdateForm: FormGroup;



  ngOnInit(): void {
    this.languageService.languageChanged.subscribe(() => {
      this.translateVal = (localStorage.lang == 'ml' ? 'malay' : 'english');
    });
    this.selectedNricNumber();
    this.statusUpdateForm = this.fb.group({
      status: [''],
      result: [''],
      remarks: ['']
    });
  }

  getStatusList() {
    this.timelineService.getStatusList()
      .subscribe(res => {
        this.statusList = res;
      })
  }
  displayFnTransactionNumber(user): string {
    console.log("user===", user)
    return user && user.enrollment_no ? user.enrollment_no : '';
  }
  public validation_msgs = {
    'nric_number': [
      { type: 'invalidAutocompleteObject', message: 'NRIC Number not recognized. Click one of the options.' }
    ],
    'passport_number': [
      { type: 'invalidAutocompleteObject', message: 'Passport Number not recognized. Click one of the options.' }
    ],
    'enrollment_no': [
      { type: 'invalidAutocompleteObject', message: 'Transaction Number not recognized. Click one of the options.' }
    ]
  }


  selectedNricNumber() {
    this.calendarService.getEnrollmentNumberForSchedule()
      .subscribe((res) => {
        this.tranNumberData = res['enrollData'];
        this.tranNumberList = this.enrollment_no.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value.enrollment_no)),
          map(name => (name ? this._filterTranNumber(name) : this.tranNumberData.slice())),
        );
      })

  }
  private _filterTranNumber(name: string): [] {
    const filterValue = name.toLowerCase();
    return this.tranNumberData.filter(option => option.enrollment_no.toLowerCase().includes(filterValue));
  }
  updateStatus(id: number, deleteRecord) {
    this.timelineService.getStatusListForStudent(this.enrollment_no.value.id)
      .subscribe(res => {
        let expiryData=res['expiryData'];
        if (res['data'].length > 0) {
          if (id == res['data'][0].id) {
            if(res['data'][0].id == 7){
              if(expiryData[0].LDL_license_no != null){
                this.status_id=res['data'][0].id;
                this.statusDetail=res['data'][0];
                this.statusUpdateForm.patchValue({
                  'status':res['data'][0].status
                })
                this.modalService.open(deleteRecord, { ariaLabelledBy: 'modal-basic-title' });
              }else{
                this.timelineService.showSnackBar("LDL License is in Process..")
              }
            }else if(res['data'][0].id == 15){
              if(expiryData[0].PDL_license_no != null){
                this.status_id=res['data'][0].id;
                this.statusDetail=res['data'][0];
                this.statusUpdateForm.patchValue({
                  'status':res['data'][0].status
                })
                this.modalService.open(deleteRecord, { ariaLabelledBy: 'modal-basic-title' });
              }else{
                this.timelineService.showSnackBar("PDL License is in Process..")
              }
            }else{
              this.status_id=res['data'][0].id;
              this.statusDetail=res['data'][0];
              this.statusUpdateForm.patchValue({
                'status':res['data'][0].status
              })
              this.modalService.open(deleteRecord, { ariaLabelledBy: 'modal-basic-title' });
            }
          }
          // if (id == res['data'][0].id) {
          //   this.status_id = res['data'][0].id;
          //   this.statusDetail=res['data'][0];
          //   this.statusUpdateForm.patchValue({
          //     'status':res['data'][0].status
          //   })
          //   this.modalService.open(deleteRecord, { ariaLabelledBy: 'modal-basic-title' });
          // }
        }

      })
  }
  checkStudentTimeLine(event) {
    console.log("event.option.value---===========getStudentSchedule==========--", event.option.value);
    this.enId = event.option.value.id;
    this.LicenseData = ''
    this.timelineService.showLoader(true);
    this.getStatusList();
    this.timelineService.checkStudentTimeLine(event.option.value.id)
      .subscribe((res) => {
        this.statusDone = res['timelineData'];
        let licenseinfo = res['LicenseData'];
        for (let i = 0; i < licenseinfo.length; i++) {
          console.log(licenseinfo[i].license_class)
          this.LicenseData = licenseinfo[i].license_class ? this.LicenseData + licenseinfo[i].license_class + ', ' : this.LicenseData;

        }
        for (let i = 0; i < this.statusList.length; i++) {
          this.statusList[0]['BColor'] = 'timeline-green';
          this.statusList[0]['completed_date'] = res['timelineData'][0].cur_date;//this.nricNumberData ? this.nricNumberData[0].cur_date : this.passportNumberData[0].cur_date;
          for (let j = 0; j < this.statusDone.length; j++) {
            if (this.statusList[i].id == this.statusDone[j].status_id) {
              this.statusList[i]['BColor'] = 'timeline-green';
              // this.statusList[i]['scheduled_date']=this.statusDone[j].scheduled_date;
              this.statusList[i]['completed_date'] = this.statusDone[j].completed_date;
            }
          }
        }
      }, () => { }, () => { this.timelineService.showLoader(false); })
  }
  updateStudentStatusInfo() {
    let statusdt = {
      status_id: this.status_id,
      remarks: this.statusUpdateForm.value.remarks,
      result: this.statusUpdateForm.value.result
    }
    this.timelineService.updateStudentStatusInfo(this.enrollment_no.value.id, statusdt)
      .subscribe(() => {
        this.timelineService.showSnackBar("Updated Successfully!!!");
      })
  }

}
