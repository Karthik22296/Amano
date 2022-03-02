import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeOneComponent } from './components/pages/home-one/home-one.component';
import { PreloaderComponent } from './components/common/preloader/preloader.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { CancellationPolicyComponent } from './components/pages/privacy-policy/cancellation-policy.component';
import { TermsConditionsComponent } from './components/pages/terms-conditions/terms-conditions.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { SignInComponent } from './components/pages/sign-in/sign-in.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { AboutComponent } from './components/pages/about/about.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { LicenseComponent } from './components/pages/license/license.component';
import { MaterialModule } from './components/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppService } from './app.service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LicenseTwoComponent } from './components/pages/license-two/license-two.component';
import { AuthGuard } from './services/auth.guard';
import { TimelineComponent } from './components/pages/timeline/timeline.component';
import { FormDialogComponent } from './components/pages/schedule/dialogs/form-dialog/form-dialog.component';
import { AddScheduleComponent } from './components/pages/schedule/add-schedule/add-schedule.component';
import { LoaderComponent } from './components/common/loader/loader.component';
import { ResetPasswordComponent } from './components/common/reset-password/reset-password.component';
import { JwtInterceptor } from './services/jwt.interceptor';
import { PrivacyPolicyComponent } from './components/pages/privacyPolicy/privacy-policy.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    HomeOneComponent,
    PreloaderComponent,
    FooterComponent,
    NavbarComponent,
    CancellationPolicyComponent,
    TermsConditionsComponent,
    SignUpComponent,
    SignInComponent,
    ErrorComponent,
    AboutComponent,
    ContactComponent,
    LicenseComponent,
    LicenseTwoComponent,
    TimelineComponent,
    FormDialogComponent,
    AddScheduleComponent,
    LoaderComponent,
    ResetPasswordComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ], exports: [TranslateModule, LoaderComponent],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: (appService: AppService) => () => appService.load(),
    deps: [AppService],
    multi: true,
  }, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, , AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
