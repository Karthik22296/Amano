import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  public languages: string[] = ['en', 'ml'];
  public languageChanged: BehaviorSubject<boolean>;
  public language = '';

  constructor(public translate: TranslateService) {
    this.languageChanged = new BehaviorSubject<boolean>(false);
    let browserLang;
    translate.addLangs(this.languages);

    if (localStorage.getItem('lang')) {
      browserLang = localStorage.getItem('lang');
    } else {
      browserLang = translate.getBrowserLang();
    }
    translate.use(browserLang.match(/en|ml/) ? browserLang : 'en');
  }

  public setLanguage(lang) {
    this.translate.use(lang);
    this.language = lang;
    localStorage.setItem('lang', lang);
    this.languageChanged.next(true);
  }
}
