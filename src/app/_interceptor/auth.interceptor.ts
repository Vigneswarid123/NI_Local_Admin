import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {ApiService} from '../_services/api.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private apiSrvc: ApiService) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // if (request.url !== 'http://aaatapi.azaz.com/api/auth/signin') {
      if (request.url.search('/auth/signin') === -1) {
      request = request.clone({
        setHeaders: {
          // "Content-Type": "application/json; charset=utf-8",
          // Accept: "application/json",
          // Authorization: `Bearer ${this.authSrvc.getToken()}`,
          'x-access-token': `${this.apiSrvc.getToken()}`,
        },
      });
    }
      return next.handle(request);
  }
}
