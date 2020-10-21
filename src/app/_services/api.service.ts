import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

import { LoginModel } from '../_models/login';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  decodedToken: any;
  jwtHelper = new JwtHelperService();



  constructor(private http: HttpClient) { }

 

  login(model: LoginModel) {
    return this.http.post(`${environment.apiUrl}auth/signin`, model);
  }

  loggedIn() {
    const token = localStorage.getItem('thrott_token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  getToken() {
    return localStorage.getItem('thrott_token');
  }

  logout(): any {
    return this.http.delete(`${environment.apiUrl}auth/logout`);
  }

  addgroup(data): Observable<any> {
    const addgroupToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjUsIkZpcnN0TmFtZSI6ImFuayIsIkxhc3ROYW1lIjoibXVwIiwiUGhvbmUiOiIxMjM0NTY3ODkwIiwiRW1haWwiOiJ0ZXN0dXNlckBnbWFpbC5jb20iLCJBZGRyZXNzIjoicmp5IiwiTWFwQWRkcmVzcyI6InRlc3QiLCJSb2xlSWQiOjAsIklzQWRtaW4iOiJZIiwiVXNlclR5cGUiOiJBIiwiU3RhdHVzIjoiWSIsIkNyZWF0ZWREYXRlIjoiMjAyMC0wOC0yNVQyMDoxNjoyNC41NTAiLCJDcmVhdGVkVXNlcklkIjowLCJVcGRhdGVkRGF0ZSI6IjIwMjAtMDgtMjVUMjA6MTY6MjQuNTUwIiwiVXBkYXRlZFVzZXJJZCI6MCwiVG9rZW4iOm51bGwsImlhdCI6MTYwMDE2Nzg5NCwiZXhwIjoxNjMxNzAzODk0fQ.Pf1Lcr4YvwEUsq-KXW4_PHladSMdNENhEcjB3oSj0Tg'
      })
    };
    const API_URL1 = `${environment.apiUrl}dealershipgroups`;
    return this.http.post(API_URL1, data, addgroupToken).pipe(
      map(res => {
        console.log(res);
        return res;
      })
    );
  }
   
  GetBrands(obj){
    return this.http.post(`${environment.apiUrl}brands/get`, JSON.stringify(obj))
  }

  getBrand(data){
    return this.http.post(`${environment.apiUrl}brands/get`, JSON.stringify(data));
  }
  
  // getModel(data){
  //   return this.http.post(`${environment.apiUrl}model/get`, JSON.stringify(data));
  // }


  

  getModelDetails(data){
    const addgroupTokenw = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjIwMDksIkZpcnN0TmFtZSI6IlByYXNhZCIsIkxhc3ROYW1lIjoiY2hhdmFsaSIsIlBob25lIjoiIiwiRW1haWwiOiJwY2hhdmFsaUBnbWFpbC5jb20iLCJBZGRyZXNzIjoiIiwiTWFwQWRkcmVzcyI6IjAiLCJSb2xlSWQiOjAsIklzQWRtaW4iOiJZIiwiVXNlclR5cGUiOiJBIiwiU3RhdHVzIjoiWSIsIkNyZWF0ZWREYXRlIjoiMjAyMC0xMC0xM1QyMDozMjozOS4zMTMiLCJDcmVhdGVkVXNlcklkIjowLCJVcGRhdGVkRGF0ZSI6IjIwMjAtMTAtMTNUMjA6MzI6MzkuMzEzIiwiVXBkYXRlZFVzZXJJZCI6MCwiVG9rZW4iOm51bGwsImlhdCI6MTYwMjg1NTkzMCwiZXhwIjoxNjM0MzkxOTMwfQ.JGqUfMrcXcPE2-gV1ePjQXKtozK5M924vGIsOuHzX80'
      })
    };

    return this.http.post(`${environment.apiUrl}model/get`, JSON.stringify(data), addgroupTokenw);

  }

  postmethod(endpoint: string, obj: object): Observable<any> {
    return this.http.post(`${environment.apiUrl}${endpoint}`, obj)
    .pipe(map(
      (res: any) => {
      return res;
    }));
    }


  putmethod(endpoint: string, obj: object): Observable<any> {
    return this.http.put(`${environment.apiUrl}${endpoint}`, obj)
    .pipe(map(
      (res: any) => {
      return res;
    }));
    }

    showRolesData(data) {
      return this.http.post(`${environment.apiUrl}roles/get`, JSON.stringify(data));
    }

    getRole(Role_Id:number){
      return this.http.post(`${environment.apiUrl}roles/get`,{
        Role_Id:Role_Id
      });
    }
    
    addRole(data){
      return this.http.post(`${environment.apiUrl}roles`,JSON.stringify(data));
      }

      GetModel(obj){
        return this.http.post(`${environment.apiUrl}model/GET`, JSON.stringify(obj));
      }

      GetStylesData(obj){
        return this.http.post(`${environment.apiUrl}styles/GET`, JSON.stringify(obj));
      }

      getUsers(data) {

        return this.http.post(`${environment.apiUrl}users/GET `, JSON.stringify(data));
    
      }

      GetDealershipGroupsData(data) {
        return this.http.post(`${environment.apiUrl}dealershipgroups/get`, JSON.stringify(data));
      }


      dealershipList(data){
       
        const API_URL1=`${environment.apiUrl}dealerships/get`;
        
        return this.http.post(API_URL1, data).pipe(
        // catchError(this.error)
        );
        }
    
      
}
