import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language-service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  forgotPass=false;
  email:string;
  userName: string;
  password: string;
  lan: string;
  subscription: Subscription = new Subscription;
  alive = true;
  public forgotPasswordForm: FormGroup
  public successMessage: string;
  public errorMessage: string;
  public showSuccess: boolean;
  public showError: boolean;
  constructor(private _formBuilder: FormBuilder, private languageService: LanguageService, private AppService: AppService, private route: Router
    , private commonService: CommonService
  ) {
    this.lan = this.languageService.language;
    this.subscription = this.languageService.languageChanged.pipe(takeWhile(() => this.alive)).subscribe(() => {
      this.lan = this.languageService.language;
    });

  }
  signIn: FormGroup;

  ngOnInit(): void {
    this.getFormFields();
    this.AppService.logOut();
  }
  ngOnDestory() {
    this.alive = false;
    this.subscription.unsubscribe();
  }
  getFormFields() {
    this.signIn = this._formBuilder.group({
      userName: new FormControl('', Validators.required),
      password: new FormControl('',)
    });
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email])
    })
  }
  get validate() {
    return this.signIn.controls;
  }
  get validate2() {
    return this.forgotPasswordForm.controls;
  }
  login() {
    if (this.signIn.valid) {
      this.commonService.showLoader(true)
      this.AppService.login(this.userName, this.password).subscribe(res => {
        if (res.status == "Success") {
          sessionStorage.logedin=true
          this.AppService._loggedInChanged.next(true);
          this.AppService.loggedIn=true;
          this.route.navigate([''])

        } else {
          this.commonService.showSnackBar('Login Failed. Please try again');
        }
      }, error => { }, () => { this.commonService.showLoader(false) }
      );
    }else{
      return;
    }
  }

  public validateControl = (controlName: string) => {
    return this.forgotPasswordForm.controls[controlName].invalid && this.forgotPasswordForm.controls[controlName].touched
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.forgotPasswordForm.controls[controlName].hasError(errorName)
  }
  public forgotPassword (forgotPasswordFormValue) {
    this.AppService.sendForgotPasswordLink(forgotPasswordFormValue).subscribe(res=>{
      if(res.status!='Success'){
        this.commonService.showSnackBar("Email Not Found") 
      }else{
        this.commonService.showSnackBar("Email Sent Suucessfully. Please Check Mail")
      }
    })
  }
    

}
