import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate() {
    if (this.appService.isLoged()) return true;
    else {
      this.router.navigate(["/sign-in"]); return false
    }
  }


  constructor(private appService: AppService, private router: Router) {
  }

}
