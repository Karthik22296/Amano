import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/pages/about/about.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { HomeOneComponent } from './components/pages/home-one/home-one.component';
import { CancellationPolicyComponent } from './components/pages/privacy-policy/cancellation-policy.component';
import { SignInComponent } from './components/pages/sign-in/sign-in.component';
import { SignUpComponent } from './components/pages/sign-up/sign-up.component';
import { TermsConditionsComponent } from './components/pages/terms-conditions/terms-conditions.component';
import { LicenseComponent } from './components/pages/license/license.component';
import { LicenseTwoComponent } from './components/pages/license-two/license-two.component';
import { AuthGuard } from './services/auth.guard';
import { TimelineComponent } from './components/pages/timeline/timeline.component';
import { AddScheduleComponent } from './components/pages/schedule/add-schedule/add-schedule.component';
import { ResetPasswordComponent } from './components/common/reset-password/reset-password.component';
import { PrivacyPolicyComponent } from './components/pages/privacyPolicy/privacy-policy.component';

const routes: Routes = [
    { path: '', component: HomeOneComponent },
    { path: 'about', component: AboutComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'sign-in', component: SignInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'terms-conditions', component: TermsConditionsComponent },
    { path: 'cancellation-policy', component: CancellationPolicyComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'license', component: LicenseComponent },
    { path: 'license-2', component: LicenseTwoComponent, canActivate: [AuthGuard] },
    { path: 'timeline', component: TimelineComponent, canActivate: [AuthGuard] },
    { path: 'schedule-list', component: AddScheduleComponent, canActivate: [AuthGuard] },
    { path: 'resetpassword/:id', component: ResetPasswordComponent },

    { path: '**', component: HomeOneComponent } // This line will remain down from the whole component list
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }