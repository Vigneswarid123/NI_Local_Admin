import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjUsIkZpcnN0TmFtZSI6ImFuayIsIkxhc3ROYW1lIjoibXVwIiwiUGhvbmUiOiIxMjM0NTY3ODkwIiwiRW1haWwiOiJ0ZXN0dXNlckBnbWFpbC5jb20iLCJBZGRyZXNzIjoicmp5IiwiTWFwQWRkcmVzcyI6InRlc3QiLCJSb2xlSWQiOjAsIklzQWRtaW4iOiJZIiwiVXNlclR5cGUiOiJBIiwiU3RhdHVzIjoiWSIsIkNyZWF0ZWREYXRlIjoiMjAyMC0wOC0yNVQyMDoxNjoyNC41NTAiLCJDcmVhdGVkVXNlcklkIjowLCJVcGRhdGVkRGF0ZSI6IjIwMjAtMDgtMjVUMjA6MTY6MjQuNTUwIiwiVXBkYXRlZFVzZXJJZCI6MCwiVG9rZW4iOm51bGwsImlhdCI6MTYwMDE2Nzk4NiwiZXhwIjoxNjMxNzAzOTg2fQ.LPfPFsfCgW2f5bBrfEU6-RvVSGBJ7p5_4EOtxsf9aYw',

  })
};

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  fullUrl = `${environment.apiUrl}`;
  sampleUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) { }



  addAdmin(data) {
    return this.http.post(`${environment.apiUrl}cmsmodules`, JSON.stringify(data), httpOptions);
  }
  adminModules(data) {
    return this.http.post(`${environment.apiUrl}cmsmodules/GET`, JSON.stringify(data), httpOptions);

  }
  updateAdmin(data) {
    return this.http.put(`${environment.apiUrl}cmsmodules`, JSON.stringify(data), httpOptions);
  }
  deleteAdmin(data) {
    return this.http.delete(`${environment.apiUrl}cmsmodules`, httpOptions);
  }
  getAdminModule(mod_id: number) {
    return this.http.post(`${environment.apiUrl}cmsmodules/GET`, {
      mod_id: mod_id
    }, httpOptions);
  }
  GetDealerships(data) {
    return this.http.post(`${environment.apiUrl}dealerships/get`, JSON.stringify(data), httpOptions);
  }
  GetDealershipGroups(data) {
    return this.http.post(`${environment.apiUrl}dealershipgroups/get`, JSON.stringify(data), httpOptions);
  }

  // addgroup(data) {
  //   return this.http.post(`${environment.apiUrlSameple}dealershipgroups`, JSON.stringify(data), httpOptions);
  // }

  postmethod(url: string, obj: object): Observable<any> {
    return this.http.post(`${this.fullUrl}${url}`, obj)
      .pipe(map(
        (res: Response) => {
          return res;
        }));
  }
  Sample_postmethod(url: string, obj: object): Observable<any> {
    return this.http.post(`${this.sampleUrl}${url}`, obj)
      .pipe(map(
        (res: Response) => {
          return res;
        }, httpOptions));
  }

  get(path: string): Observable<any> {
    return this.http.get(`${this.sampleUrl}${path}`, {})
      .pipe(map(
        (res: Response) => {
          if (res) {
            return res;
          } else {
            return '';
          }
        }));
  }
}