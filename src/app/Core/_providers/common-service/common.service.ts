import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http:HttpClient) { }

  getBrands(data){
    return this.http.post(`${environment.apiUrl}brands/get`, JSON.stringify(data));
  }

  getModelDetails(data){
    const addgroupToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjIwMDksIkZpcnN0TmFtZSI6IlByYXNhZCIsIkxhc3ROYW1lIjoiY2hhdmFsaSIsIlBob25lIjoiIiwiRW1haWwiOiJwY2hhdmFsaUBnbWFpbC5jb20iLCJBZGRyZXNzIjoiIiwiTWFwQWRkcmVzcyI6IjAiLCJSb2xlSWQiOjAsIklzQWRtaW4iOiJZIiwiVXNlclR5cGUiOiJBIiwiU3RhdHVzIjoiWSIsIkNyZWF0ZWREYXRlIjoiMjAyMC0xMC0xM1QyMDozMjozOS4zMTMiLCJDcmVhdGVkVXNlcklkIjowLCJVcGRhdGVkRGF0ZSI6IjIwMjAtMTAtMTNUMjA6MzI6MzkuMzEzIiwiVXBkYXRlZFVzZXJJZCI6MCwiVG9rZW4iOm51bGwsImlhdCI6MTYwMjg1NTkzMCwiZXhwIjoxNjM0MzkxOTMwfQ.JGqUfMrcXcPE2-gV1ePjQXKtozK5M924vGIsOuHzX80'
      })
    };

    return this.http.post(`${environment.apiUrl}model/get`, JSON.stringify(data), addgroupToken);

  }

  getStyles(obj){
    const addgroupTokenw = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjIwMDksIkZpcnN0TmFtZSI6IlByYXNhZCIsIkxhc3ROYW1lIjoiY2hhdmFsaSIsIlBob25lIjoiIiwiRW1haWwiOiJwY2hhdmFsaUBnbWFpbC5jb20iLCJBZGRyZXNzIjoiIiwiTWFwQWRkcmVzcyI6IjAiLCJSb2xlSWQiOjAsIklzQWRtaW4iOiJZIiwiVXNlclR5cGUiOiJBIiwiU3RhdHVzIjoiWSIsIkNyZWF0ZWREYXRlIjoiMjAyMC0xMC0xM1QyMDozMjozOS4zMTMiLCJDcmVhdGVkVXNlcklkIjowLCJVcGRhdGVkRGF0ZSI6IjIwMjAtMTAtMTNUMjA6MzI6MzkuMzEzIiwiVXBkYXRlZFVzZXJJZCI6MCwiVG9rZW4iOm51bGwsImlhdCI6MTYwMjg1NTkzMCwiZXhwIjoxNjM0MzkxOTMwfQ.JGqUfMrcXcPE2-gV1ePjQXKtozK5M924vGIsOuHzX80'
      })
    };

    return this.http.post(`${environment.apiUrl}styles/GET`, JSON.stringify(obj), addgroupTokenw);

  }

}
