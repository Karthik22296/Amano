import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language-service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    lan = 'en';
    subscription: Subscription;
    alive: boolean = true;
    loggedIn: any;
    constructor(private appService: AppService, private languageService: LanguageService,private route:Router) {
        //this.lan = localStorage.getItem('lang');
        this.langChanged(this.lan)
        this.subscription = this.appService._loggedInChanged?.pipe(takeWhile(() => this.alive)).subscribe(value => {
         this.loggedIn = this.appService.isLoged()

        });
    }

    ngOnInit(): void {
    }
    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }
    langChanged(event: any) {
        this.languageService.setLanguage(event);
    }
    logOut() { 
     this.appService.Studentlogout().subscribe(res=>{});
     this.route.navigate(['/']);
    }
}