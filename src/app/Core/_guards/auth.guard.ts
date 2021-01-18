import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {ApiService} from '../_providers/api-service/api.service';

import { AlertifyService } from '../_providers/alert-service/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private apiSrvc: ApiService, private alertify: AlertifyService, private router: Router) {
  }
  canActivate(): boolean {
    if (this.apiSrvc.loggedIn()){
      return true;
    }

    this.alertify.error('You are not authorised to access this page');
    this.router.navigateByUrl('login');
    return false;


  }
}
