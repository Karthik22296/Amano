import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { License } from 'src/app/models/licenseInfo';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language-service';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})

export class LicenseComponent implements OnInit {
  subscription;
  alive: boolean=true;
  lan: boolean;
  apiUrl: string;
  
  constructor(private commonService: CommonService,private languageService:LanguageService,private route :Router) {
    this.lan = this.languageService.language=='en'?true:false;
    this.subscription = this.languageService.languageChanged.pipe(takeWhile(() => this.alive)).subscribe(() => {
      this.lan = this.languageService.language=='en'?true:false;
    });
   }
  license: License[];
  ngOnInit(): void {
   this.getLicenceList();
   this.apiUrl = this.commonService.getConfig('apiUrl');
  }
  getLicenceList() {
    this.commonService.showLoader(true);
    this.commonService.getLicenceList().subscribe(res => {
     this.license=res;
    },error=>{},()=>{this.commonService.showLoader(false)})
  }
gotoSignIn(){
  this.route.navigate(['/sign-in']);
}
}
