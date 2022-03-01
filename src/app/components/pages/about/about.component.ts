import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language-service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  lan: string;
  subscription: Subscription = new Subscription;
  alive = true;
  constructor(private languageService: LanguageService) {
    this.lan = this.languageService.language;
    this.subscription = this.languageService.languageChanged.pipe(takeWhile(() => this.alive)).subscribe(() => {
      this.lan = this.languageService.language;
    });

  }

  ngOnInit(): void {
  }
  ngOnDestory() {
    this.alive = false;
    this.subscription.unsubscribe();
  }
}
