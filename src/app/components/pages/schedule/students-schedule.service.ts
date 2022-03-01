import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Calendar } from "./students-schedule.model";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { map } from 'rxjs/operators';
import { AppService } from "src/app/app.service";

@Injectable({
  providedIn: 'root',
})
export class StudentScheduleService {

  private readonly API_URL = "assets/data/calendar.json";
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  dataChange: BehaviorSubject<Calendar[]> = new BehaviorSubject<Calendar[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  apiUrl: string;
  constructor(private appService: AppService,private http: HttpClient ) {
    this.apiUrl= this.appService.getConfig('apiUrl');
  }
  get data(): Calendar[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  getAllCalendars(): Observable<Calendar[]> {
    return this.http
      .get<Calendar[]>(this.API_URL)
      .pipe(catchError(this.errorHandler));
  }


  deleteCalendar(calendar: Calendar): void {
    this.dialogData = calendar;
  }
  errorHandler(error) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }



  

  getTimeDetails(client){
    return this.http
      .post<any>(`${this.apiUrl}onlineCustomer/getOverallTimeDetails`,{client})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  
  getSelectedScheduleInfoStudent(enrollData,client){
    return this.http
      .post<any>(`${this.apiUrl}onlineCustomer/getStudentScheduleInfo`,{enrollData,client})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

 

  getEnrollDetailsForSchedule(authToken,clientid){
    return this.http
    .post<any>(`${this.apiUrl}onlineCustomer/getEnrollDetailsForSchedule`,{authToken,clientid})
    .pipe(
      map((res) => {
        return res;
      })
    );
  }

  setStudentScheduleInfo(finalArray,enrollData,client){
    return this.http
    .post<any>(`${this.apiUrl}onlineCustomer/setStudentScheduleDetails`,{finalArray,enrollData,client})
    .pipe(
      map((res) => {
        return res;
      })
    );
  }

  getEnrollmentNumberForSchedule(){
    return this.http
    .get<any>(`${this.apiUrl}onlineCustomer/getEnrollmentNumberForSchedule`)
    .pipe(
      map((res) => {
        return res;
      })
    );
  }

  getSchedulePerEnroll(studentInfo){
    return this.http
    .post<any>(`${this.apiUrl}onlineCustomer/getSchedulePerEnroll`,{studentInfo})
    .pipe(
      map((res) => {
        return res;
      })
    );
  }
  checkPaymentDone(studentInfo){
    return this.http
    .post<any>(`${this.apiUrl}onlineCustomer/checkPaymentDone`,{studentInfo})
    .pipe(
      map((res) => {
        return res;
      })
    );
  }
  setPaymentDetails(enrollValue,amountToBePaid){
    return this.http
    .post<any>(`${this.apiUrl}onlineCustomer/setPaymentDetails`,{enrollValue,amountToBePaid})
    .pipe(
      map((res) => {
        return res;
      })
    );
  }
}
