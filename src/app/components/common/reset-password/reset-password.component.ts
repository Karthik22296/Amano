import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { CommonService } from 'src/app/services/common.service';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public resetPasswordForm: FormGroup;
  public hide = true;
  password: string
  Rpassword: string;
  matcher = new MyErrorStateMatcher();
  private _token: string;

  constructor(private _authService: AppService, private common: CommonService, private router: Router,
    private _formBuilder: FormBuilder, private route: ActivatedRoute) { }
  ngOnInit(): void {
    sessionStorage.removeItem("authToken");
    this._authService._loggedInChanged.next(false);
    this._token = this.route.snapshot.paramMap.get('id');
    this.resetPasswordForm = this._formBuilder.group({
      password: [
        Validators.required,
        Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/)
      ],
      confirmPassword: ['']
    }, { validators: this.checkPasswords }
    );
  }
  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value
    return pass === confirmPass ? null : { notSame: true }
  }

  public resetPassword(resetPasswordFormValue) {
    let resetInfo = {
      authToken: this._token,
      password: resetPasswordFormValue
    }
    this._authService.updatePasswordDetails(resetInfo).subscribe(res => {
      if (res.status == "Success") {
        this.common.showSnackBar("Password Updated Sucessfully");
        this.router.navigate(['/sign-in']);
      }
      else { this.common.showSnackBar("Something Went Worng. Please Try Again."); }
    })

  }
}
