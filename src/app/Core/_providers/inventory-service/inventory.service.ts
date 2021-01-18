import { ApiService } from '../api-service/api.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private apiSrvc:ApiService,private http:HttpClient) { }

  getInventories(data):Observable<any>{

    const addgroupToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjUsIkZpcnN0TmFtZSI6ImFuayIsIkxhc3ROYW1lIjoibXVwIiwiUGhvbmUiOiIxMjM0NTY3ODkwIiwiRW1haWwiOiJ0ZXN0dXNlckBnbWFpbC5jb20iLCJBZGRyZXNzIjoicmp5IiwiTWFwQWRkcmVzcyI6InRlc3QiLCJSb2xlSWQiOjAsIklzQWRtaW4iOiJZIiwiVXNlclR5cGUiOiJBIiwiU3RhdHVzIjoiWSIsIkNyZWF0ZWREYXRlIjoiMjAyMC0wOC0yNVQyMDoxNjoyNC41NTAiLCJDcmVhdGVkVXNlcklkIjowLCJVcGRhdGVkRGF0ZSI6IjIwMjAtMDgtMjVUMjA6MTY6MjQuNTUwIiwiVXBkYXRlZFVzZXJJZCI6MCwiVG9rZW4iOm51bGwsImlhdCI6MTYwMDE2Nzg5NCwiZXhwIjoxNjMxNzAzODk0fQ.Pf1Lcr4YvwEUsq-KXW4_PHladSMdNENhEcjB3oSj0Tg'
      })
    };

    //return this.http.post<any>(`${environment.apiUrl}inventory/get`, JSON.stringify(data), addgroupToken);

    return this.http.post(`${environment.apiUrl}inventory/get`, JSON.stringify(data), addgroupToken)
    .pipe(map(
      (res: any) => {
      return res;
    }));
    
  }

}
