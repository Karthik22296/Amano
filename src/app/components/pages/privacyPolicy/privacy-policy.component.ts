import { Component, OnInit } from '@angular/core';
import { Subscription, takeWhile } from 'rxjs';
import { LanguageService } from 'src/app/services/language-service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
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
