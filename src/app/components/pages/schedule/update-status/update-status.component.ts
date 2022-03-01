import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements OnInit {
@Input()enrollid:number;
@Input()status_id:number;
  constructor(
    public dialog: MatDialog,
    public commonService: CommonService,
    public appService :AppService

  ) { }

  ngOnInit(): void {
  }
  
  updateStudentStatusInfo(){
    // this.commonService.updateStudentStatusInfo(sessionStorage.authToken,this.appService.getConfig('apiToken'),event.option.value.id,status_id)
    // .subscribe(res=>{
    //   this.commonService.showSnackBar("Updated Successfully!!!");
    // })
  }

}
