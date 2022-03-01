import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject  } from '@angular/core';
import { StudentScheduleService } from '../../students-schedule.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatRadioChange } from '@angular/material/radio';

import {  FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { Calendar } from '../../students-schedule.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass']
})


export class FormDialogComponent {

  action: string;
  dialogTitle: string;
  calendarForm: FormGroup;
  calendar: Calendar;
  showDeleteBtn = false;
  scheduleList : any;
  timeArray : any;

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedInstructor: any;
  enrollData:any;
  finalArray: any[] = [];


  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public calendarService: StudentScheduleService,
    private fb: FormBuilder,private commonService:CommonService
  ) {
    // Set the defaults
    this.getTimeDetails();
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.calendar.title;
      this.calendar = data.calendar;
      this.enrollData={
        studentId:data.calendar.enrollData.student_id,
        enrollId:data.calendar.enrollData.id,
        statusId:data.calendar.statusid,
        scheduleDate:data.calendar.startDate
      };
      this.calendarService.getSelectedScheduleInfoStudent(this.enrollData,sessionStorage.client)
      .subscribe(res=>{
        let resData=res['scheduleList'];
        let existingSchedule=res['existingSchedule'];
        for(let i=0;i<resData.length;i++){
          for(let j=0;j<this.timeArray.length;j++){
            let timeSlotDt=this.zeroPad(resData[i].TimeSlot,this.timeArray.length);
              if(timeSlotDt[j] == 1){
                this.timeArray[j].employeeList.push({
                  id:resData[i].employee_id,
                  name:resData[i].employeeName,
                  checked:false
                })
              }
          }
        }

        if(existingSchedule.length > 0){
          this.finalArray=[];
          for(let i=0;i<existingSchedule.length;i++){
            for(let j=0;j<this.timeArray.length;j++){
              let timeSlotDt=this.zeroPad(existingSchedule[i].TimeSlot,this.timeArray.length);
              if(timeSlotDt[j] == 1){
                if(this.timeArray[j].employeeList.length > 0 ){
                  for(let k=0;k<this.timeArray[j].employeeList.length;k++){
                      if(this.timeArray[j].employeeList[k].id == existingSchedule[i].employee_id){
                        this.timeArray[j].employeeList[k].checked=true;
                          var obj=this.timeArray[j];
                          obj.selected=this.timeArray[j].employeeList[k];
                          this.finalArray.push(obj);
                      }else{
                        this.timeArray[j].employeeList[k].checked=false;
                      }
                  }
                }
              }
            }
          }
        }
      })
      this.calendarForm = this.editContactForm();
    } else {
      
    }
    
    
  }

  zeroPad(num,total) {
    return num.toString().padStart(Number(total), "0");
  }


  editContactForm(): FormGroup {
    return this.fb.group({
      id: [this.calendar.id],
      lead_time: [
        this.calendar.lead_time,
        [Validators.required]
      ],
      schedule_name: [this.calendar.schedule_name],
      schedule_view: [this.calendar.schedule_view],
      startDate: [this.calendar.startDate,
      [Validators.required]
      ],
      endDate: [this.calendar.endDate,
      [Validators.required]
      ]
    });
  }
 
  
  submit(){

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  setStudentScheduleInfo() {
    for(let i=0;i<this.finalArray.length;i++){
      this.finalArray[i].timeSlot='';
      for(let j=0;j<this.timeArray.length;j++){
        this.finalArray[i].timeSlot=this.finalArray[i].timeSlot+(this.finalArray[i].range == this.timeArray[j].range ? 1 : 0)
      }
    }
    this.calendarService.setStudentScheduleInfo(this.finalArray,this.enrollData,sessionStorage.client)
    .subscribe(res=>{
        if(res['status'] == 'Success'){
          this.commonService.showSnackBar("Scheduled Successfully!!");
          this.dialogRef.close('submit');
        }
    })

  }

  displayFn(user): string {
    return user && user.name ? user.name : '';
  }

  

  
  instructorChange(event: MatRadioChange, data){
    var obj = this.timeArray.filter(x => x.range == data.range)[0];
    obj.selected = event.value;
    if (!this.finalArray.some(x => x.range == data.range)) {
          this.finalArray.push(obj);
    }

  }



  getTimeDetails(){
    this.calendarService.getTimeDetails(sessionStorage.client)
    .subscribe((res)=>{
        let resObj=res['data'][0];
        this.makeTimeIntervals((resObj.working_hour_from).substr(0, 5),(resObj.working_hour_to).substr(0, 5),60,(resObj.rest_hour_from).substr(0, 5),(resObj.rest_hour_to).substr(0, 5))
    })
  }

  makeTimeIntervals (startTime, endTime, increment, restStart, restEnd){
    startTime = startTime.toString().split(':');
    endTime = endTime.toString().split(':');
    increment = parseInt(increment, 10);

    var pad = function (n) { return (n < 10) ? '0' + n.toString() : n; },
        startHr = parseInt(startTime[0], 10),
        startMin = parseInt(startTime[1], 10),
        endHr = parseInt(endTime[0], 10),
        endMin = parseInt(endTime[1], 10),
        currentHr = startHr,
        currentMin = startMin,
        previous = currentHr + ':' + pad(currentMin),
        current = '',
        r = [];

    do {
        currentMin += increment;
        if ((currentMin % 60) === 0 || currentMin > 60) {
            currentMin = (currentMin === 60) ? 0 : currentMin - 60;
            currentHr += 1;
        }
        current = currentHr + ':' + pad(currentMin);
        r.push({'range':previous + ' - ' + current,'checkValue':0,employeeList:[]});
        previous = current;
  } while (currentHr !== endHr);
      var restTime=restStart+' - '+ restEnd;
      this.timeArray=r.filter((el)=>{return el.range != restTime});
};

}
