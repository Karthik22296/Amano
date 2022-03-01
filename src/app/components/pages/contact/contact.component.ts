import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language-service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  lan: string;
  subscription: Subscription = new Subscription;
  alive = true;
  contactForm:FormGroup;
  disable=false
  customerObj={
    name: null,
    subject:  null,
    message:  null,
    email_id:  null,
    mobile_no:  null,
  }
  constructor(private languageService: LanguageService,private _formBuilder: FormBuilder,private commonservice:CommonService) {
    this.lan = this.languageService.language;
    this.subscription = this.languageService.languageChanged.pipe(takeWhile(() => this.alive)).subscribe(() => {
      this.lan = this.languageService.language;
    });
    this.intForm();
  }
  intForm(){
    this.contactForm = this._formBuilder.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      email_id: ['', [Validators.required, Validators.email]],
      mobile_no: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }
  get validate() {
    return this.contactForm.controls;
  }
  ngOnDestory() {
    this.alive = false;
    this.subscription.unsubscribe();
  }
  submit(){
    if(this.contactForm.valid){
    this.disable=true;
    this.commonservice.showLoader(true)
    this.commonservice.setCustomerContactDetails(this.customerObj).subscribe(res=>{},error=>{},()=>{this.disable=false
  this.commonservice.showLoader(false)}
    )}
  }
}
