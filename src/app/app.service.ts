import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { catchError, map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class AppService {
    constructor(private http: HttpClient) {
    }
    config: any;
    public _loggedInChanged = new BehaviorSubject<boolean>(false);
    loggedIn = false;


    load(): Promise<object> {
        let promise = this.http.get(`./assets/config.json`).toPromise();
        promise.then(site => {
            this.config = site;
            this.isLogedIn().subscribe();
        });
        return promise;
    }
    getConfig(key: any): string {
        return this.config[key];
    }
    login(user_name: string, password: string): Observable<any> {
        let dataUrl = `${this.getConfig('apiUrl')}onlineCustomer/getLoginInfo/`;
        let body = JSON.stringify({ user_name, password })
        return this.http.post<any>(dataUrl, { user_name, password })
            .pipe(catchError(this.handleError));
    }
    handleError(handleError: any): any {
        throw new Error('Method not implemented.');
    }
    isLogedIn(): Observable<any> {
        let dataUrl = `${this.getConfig('apiUrl')}onlineCustomer/checkStudentLoggedIn/`;
        return this.http.get<any>(dataUrl)
            .pipe(map((res) => {
                console.log("res===========", res)
                sessionStorage.setItem('logedin', res);
            }));
    }
    isLoged() {
        return !!sessionStorage.getItem('logedin');
    }
    logOut() {
        this.Studentlogout().subscribe();
    }
    Studentlogout(): Observable<any> {
        let dataUrl = `${this.getConfig('apiUrl')}onlineCustomer/Studentlogout`;
        return this.http.get<any>(dataUrl)
            .pipe(
                map((res) => {
                        sessionStorage.removeItem('logedin');
                        this._loggedInChanged.next(!!res);
                    
                }));
    }
    // Studentlogout() {
    //     let dataUrl = `${this.getConfig('apiUrl')}onlineCustomer/Studentlogout`;
    //     return this.http.get<any>(dataUrl)
    //       .pipe(catchError(this.handleError));
    //   } 
    // Studentlogout():boolean {
    //     let dataUrl = `${this.getConfig('apiUrl')}onlineCustomer/checkStudentLoggedIn/`;
    //     return !!this.http.get<boolean>(dataUrl)
    //     .pipe();
    // }
    sendForgotPasswordLink(email_id: string): Observable<any> {
        let dataUrl = `${this.getConfig('apiUrl')}onlineCustomer/sendForgotPasswordLink/`;
        let body = JSON.stringify({ email_id })
        return this.http.post<any>(dataUrl, { email_id })
            .pipe(catchError(this.handleError));
    }
    updatePasswordDetails(resetInfo: any): Observable<any> {
        let dataUrl = `${this.getConfig('apiUrl')}onlineCustomer/updatePasswordDetails/`;
        let body = JSON.stringify({ resetInfo })
        return this.http.post<any>(dataUrl, { resetInfo })
            .pipe(catchError(this.handleError));
    }
}

