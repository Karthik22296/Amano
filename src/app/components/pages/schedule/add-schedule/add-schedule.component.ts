import { Component, ViewChild, OnInit } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/angular';
import { Observable, map, startWith, debounceTime, switchMap, of } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { EventInput } from '@fullcalendar/angular';
import { MatDialog } from '@angular/material/dialog';
import { StudentScheduleService } from '../students-schedule.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormDialogComponent } from '../dialogs/form-dialog/form-dialog.component';
import { Calendar } from '../students-schedule.model';
import { formatDate } from '@angular/common';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { AppService } from 'src/app/app.service';
import { CommonService } from 'src/app/services/common.service';
import { ThisReceiver } from '@angular/compiler';

function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string') {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss']
})
export class AddScheduleComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  @ViewChild('calendar', { static: false })
  calendar: Calendar | null;
  public addCusForm: FormGroup;
  scheduleList;

  dialogTitle: string;
  filterOptions = 'All';
  calendarData = [];
  filterItems = []

  calendarEvents: EventInput[];
  tempEvents: EventInput[];
  tranNumberData: any;

  nricNumberData: any;
  passportNumberData: any;
  handler: any;


  nric_number = new FormControl('', { validators: [autocompleteObjectValidator()] });
  passport_number = new FormControl('', { validators: [autocompleteObjectValidator()] });
  enrollment_no = new FormControl('', { validators: [autocompleteObjectValidator()] });

  nricNumberList: Observable<string[]>;
  passportNumberList: Observable<string[]>;
  tranNumberList: Observable<string[]>;

  enrollDetails: any;
  authToken: string;
  apiToken: string;
  SchData: any;
  amountToPay: any;
  showPaymentBtn: boolean;
  upcomingStatus: any;
  scheduleStatus: string;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public calendarService: StudentScheduleService,
    private snackBar: MatSnackBar,
    private appService: AppService,
    private commonService: CommonService
  ) {
    super();
    this.dialogTitle = 'Add New Event';
    this.calendar = new Calendar({});
    this.addCusForm = this.createCalendarForm(this.calendar);

    this.authToken = sessionStorage.getItem("authToken");
    this.apiToken = this.appService.getConfig('apiToken')
  }

  public ngOnInit(): void {
    this.authToken = sessionStorage.getItem("authToken");
    this.apiToken = this.appService.getConfig('apiToken')
    this.selectedNricNumber()

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

  displayFnTransactionNumber(user): string {
    console.log("user===", user)
    return user && user.enrollment_no ? user.enrollment_no : '';
  }

  private _filterTranNumber(name: string): [] {
    const filterValue = name.toLowerCase();
    return this.tranNumberData.filter(option => option.enrollment_no.toLowerCase().includes(filterValue));
  }

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    displayEventTime: false,
    weekends: true,
    editable: true,
    // selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    // select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  };


  changeCategory(event: MatCheckboxChange, filter) {
    if (event.checked) {
      this.filterItems.push(filter.status);
    } else {
      this.filterItems.splice(this.filterItems.indexOf(filter.status), 1);
    }
    this.filterEvent(this.filterItems);
  }

  filterEvent(element) {
    const list = this.calendarEvents.filter((x) =>
      element.map((y) => y).includes(x.title)
    );

    this.calendarOptions.events = list;
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.eventClick(clickInfo);
  }

  eventClick(row) {

    const calendarData: any = {
      id: row.event.id,
      title: row.event.title,
      lead_time: row.event._def.extendedProps.lead_time,
      statusid: row.event._def.extendedProps.statusid,
      schedule_name: row.event._def.extendedProps.schedule_name,
      schedule_view: row.event._def.extendedProps.schedule_view,
      schedule_view_assignment: row.event._def.extendedProps.employeeName,
      startDate: row.event.start,
      endDate: row.event.end,
      enrollData: this.enrollDetails
    };

    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        calendar: calendarData,
        action: 'edit',
      },
      direction: tempDirection,
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 'submit') {
        // this.getScheduleDetails();
        this.addCusForm.reset();
      } else if (result === 'delete') {
        // this.getScheduleDetails();
      }
    });
  }

  editEvent(eventIndex, calendarData) {
    const calendarEvents = this.calendarEvents.slice();
    const singleEvent = Object.assign({}, calendarEvents[eventIndex]);
    singleEvent.id = calendarData.id;
    singleEvent.title = calendarData.title;
    singleEvent.start = calendarData.startDate;
    singleEvent.end = calendarData.endDate;
    singleEvent.className = '';
    singleEvent.groupId = calendarData.category;
    singleEvent.details = calendarData.details;
    calendarEvents[eventIndex] = singleEvent;
    this.calendarEvents = calendarEvents; // reassign the array

    this.calendarOptions.events = calendarEvents;
  }

  handleEvents(events: EventApi[]) {
    // this.currentEvents = events;
  }

  createCalendarForm(calendar): FormGroup {
    return this.fb.group({
      id: [calendar.id],
      lead_time: [
        calendar.lead_time,
        [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')],
      ],
      schedule_name: [calendar.schedule_name],
      schedule_view: [calendar.schedule_view],
      startDate: [calendar.startDate, [Validators.required]],
      endDate: [calendar.endDate, [Validators.required]],
    });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
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

  getStudentSchedulePerEnroll(event) {
    this.showPaymentBtn=false;
    this.SchData=event.option.value;
    console.log("event.option.value---===========getStudentSchedule==========--", event.option.value);
    this.commonService.showLoader(true)
    this.calendarService.checkPaymentDone(this.SchData).subscribe(res => {
      this.amountToPay=res.amountToBePaid;
      this.upcomingStatus=res['nextStatus'][0];
      if(res['status'] == 'Success'){
        if(this.upcomingStatus.id == 7){
            this.scheduleStatus="Waiting";
        }else{
          this.scheduleStatus='Success';
          this.getScheduleInfo(this.SchData)
        }
      }else if(res['status'] == 'Pay'){
        this.showPaymentBtn=true;
          this.receipt(this.SchData, this.amountToPay)
      }
      // if (res.status == 'Success') { 
      //   this.getScheduleInfo(this.SchData)
      // }
      // else {
      //   this.showPaymentBtn=true;
      //   this.receipt(this.SchData, this.amountToPay)
      // }
    }, error => { }, () => { this.commonService.showLoader(false) });
  }
  receipt(schData, amountToBePaid) {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_aeUUjYYcx4XNfKVW60pmHTtI',
      locale: 'auto',
      token: (token: any) => {
        this.calendarService.setPaymentDetails(schData, amountToBePaid).subscribe(res => {
          if (res.status == 'Success') {
            this.showPaymentBtn=false;
            this.getScheduleInfo(schData);
          }else{
            this.commonService.showSnackBar("Payment Failed Please Try Again")
          }
        })

      }
    })
    handler.open({
      name: 'Demo Site',
      description: '2 widgets',
      amount: amountToBePaid
    });

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
  getScheduleInfo(schData) {
    this.calendarService.getSchedulePerEnroll(schData)
      .subscribe((res) => {
        this.calendarData = [];
        this.enrollDetails = schData;
        for (let i = 0; i < res['scheduleList'].length; i++) {
          this.calendarData.push({
            title: res['scheduleList'][i].status,
            start: new Date(res['scheduleList'][i].startDate),
            end: new Date(res['scheduleList'][i].endDate),
            className: res['scheduleList'][i].schedule_color,
            id: res['scheduleList'][i].id,
            statusid: res['scheduleList'][i].status_id,
            schedule_name: res['scheduleList'][i].status,
            schedule_view: res['scheduleList'][i].schedule_view,
            assignment: res['scheduleList'][i].AssignmentList,
            startDate: new Date(res['scheduleList'][i].startDate),
            endDate: new Date(res['scheduleList'][i].endDate),
            employeeName: res['scheduleList'][i].employee_name
          })
        }
        this.calendarEvents = this.calendarData;
        this.tempEvents = this.calendarEvents;
        this.calendarOptions.events = this.calendarEvents;
      }, error => { }, () => { this.commonService.showLoader(false) });
  }
}





