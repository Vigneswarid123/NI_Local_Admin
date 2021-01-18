import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

import { LoginModel } from '../../_models/login';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { roleModel } from '../../_models/role';
import { usersModel } from '../../_models/users';
import { incentiveTermsModel } from '../../../Core/_models/incentiveTerms';
import { incentiveTypesModel } from '../../../Core/_models/incentiveTypes';
import { subscriptionPlansModel } from '../../../Core/_models/subscriptionPlans';


const headersData ={ headers: new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  decodedToken: any;
  jwtHelper = new JwtHelperService();

  public obj: any = [];

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
   
  // GetBrands(obj){
  //   return this.http.post(`${environment.apiUrl}brands/get`, JSON.stringify(obj))
  // }

  GetBrands(obj){
    return this.http.post(`${environment.apiUrl}brands/get`, JSON.stringify(obj),headersData)
  }

  GetOemBrands(obj){
    return this.http.post(`${environment.apiUrl}oembrands/get`, JSON.stringify(obj), headersData)
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
    
    updateRole(model: roleModel) {
      return this.http.put(`${environment.apiUrl}roles`, model);
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
    
        GetDealershipGroups(data) {
          //return this.http.post(`${environment.apiUrl}dealershipgroups/get`, JSON.stringify(data));

          const API_URL1=`${environment.apiUrl}dealershipgroups/get`;
        
          return this.http.post(API_URL1, data).pipe(
          // catchError(this.error)
          );
        }


        
        GetStyles(obj){
          const addgroupTokenw = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjIwMDksIkZpcnN0TmFtZSI6IlByYXNhZCIsIkxhc3ROYW1lIjoiY2hhdmFsaSIsIlBob25lIjoiIiwiRW1haWwiOiJwY2hhdmFsaUBnbWFpbC5jb20iLCJBZGRyZXNzIjoiIiwiTWFwQWRkcmVzcyI6IjAiLCJSb2xlSWQiOjAsIklzQWRtaW4iOiJZIiwiVXNlclR5cGUiOiJBIiwiU3RhdHVzIjoiWSIsIkNyZWF0ZWREYXRlIjoiMjAyMC0xMC0xM1QyMDozMjozOS4zMTMiLCJDcmVhdGVkVXNlcklkIjowLCJVcGRhdGVkRGF0ZSI6IjIwMjAtMTAtMTNUMjA6MzI6MzkuMzEzIiwiVXBkYXRlZFVzZXJJZCI6MCwiVG9rZW4iOm51bGwsImlhdCI6MTYwMjg1NTkzMCwiZXhwIjoxNjM0MzkxOTMwfQ.JGqUfMrcXcPE2-gV1ePjQXKtozK5M924vGIsOuHzX80'
            })
          };
      
          return this.http.post(`${environment.apiUrl}styles/GET`, JSON.stringify(obj), addgroupTokenw);
      
        }


        GetStylesDataValue(data){
          const API_URL1=`${environment.apiUrl}styles/get`;
          return this.http.post(API_URL1, data).pipe(
            );
        }
      

        getStates(path: string): Observable<any> {
          return this.http.get(`${environment.apiUrl}${path}`, {})
                .pipe(map(
                  (res: Response) => {
          if (res) {
          return res;
                    } else {
          return'';
                    }
                  }));
            }
      
            // GetOEMGroupsList(obj){
            //   return this.http.post(`${environment.apiUrl}OEMGroups/get`, JSON.stringify(obj))
            // }


          GetOEMGroupsList(obj){​​​​​​​​
                return this.http.post(`${​​​​​​​​environment.apiUrl}OEMGroups/get`, JSON.stringify(obj),headersData)
            }​​​​​​​​

            addRegion(data){
              return this.http.post(`${environment.apiUrl}regions`,JSON.stringify(data));
              }

           showRegionsData(data){
               return this.http.post(`${environment.apiUrl}regions/get`,JSON.stringify(data));
           }

           getRegion(data){
            return this.http.post(`${environment.apiUrl}regions/get`,JSON.stringify(data));
        }

        updateRegion(data){
          return this.http.put(`${environment.apiUrl}regions`,JSON.stringify(data));
          }

          deleteOEMGroup(id){
            return this.http.request('delete',`${environment.apiUrl}OEMGroups`,{body : id});
         }

         getUserByID(User_Id: number) {
          return this.http.post(`${environment.apiUrl}users/GET`, {
            User_Id: User_Id
          });
        }

        addUsers(data) {
          return this.http.post(`${environment.apiUrl}users`, data);
        }
      
        updateUser(model: usersModel) {
          return this.http.put(`${environment.apiUrl}users`, model);
        }

        getContractForm(obj){
          return this.http.post(`${environment.apiUrl}dealershipcontractform/get`,JSON.stringify(obj), headersData);
         }

         showIncentiveTerms(data) {
          return this.http.post(`${environment.apiUrl}incentiveterms/get`, JSON.stringify(data))
         }

         getIncentiveTermsById(Id: number){
          return this.http.post(`${environment.apiUrl}incentiveterms/get`, {
            id: Id
          });
        }

        addIncentiveTerms(data){
          return this.http.post(`${environment.apiUrl}incentiveterms`, (data));
          }
      
          updateIncentiveTerms(model: incentiveTermsModel) {
            return this.http.put(`${environment.apiUrl}incentiveterms`, model);
          }

          Getdmsnames(obj){
            return this.http.post(`${environment.apiUrl}dmsnames/get`, obj,headersData);
          }

          delete(id){
            return this.http.request('delete', `${environment.apiUrl}dmsnames`, {body : id});
         }

         showIncentiveTypes(data) {
          return this.http.post(`${environment.apiUrl}incentivetypes/get`, JSON.stringify(data))
         }

         getIncentiveTypesById(Id: number){
          return this.http.post(`${environment.apiUrl}incentivetypes/get`, {
            incentivetype_id: Id
          });
        }

        updateIncentiveTypes(model: incentiveTypesModel) {
          return this.http.put(`${environment.apiUrl}incentivetypes`, model);
        }

        addIncentiveTypes(data){
          return this.http.post(`${environment.apiUrl}incentivetypes`, (data));
          }

          showSubscriptionPlans(data) {
            return this.http.post(`${environment.apiUrl}subscriptionplans/get`, JSON.stringify(data));
           }
        
          getSubscriptionPlansById(Id: number){
            return this.http.post(`${environment.apiUrl}subscriptionplans/get`, {
              sp_id: Id
            });
          }
          
          addSubscriptionPlans(data){
            return this.http.post(`${environment.apiUrl}subscriptionplans`, (data));
            }
        
          updateSubscriptionPlans(model: subscriptionPlansModel) {
              return this.http.put(`${environment.apiUrl}subscriptionplans`, model);
            }
        
          deleteSubscriptionPlan(data) {
              this.obj = data;
              const options = {
          headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjUsIkZpcnN0TmFtZSI6ImFuayIsIkxhc3ROYW1lIjoibXVwIiwiUGhvbmUiOiIxMjM0NTY3ODkwIiwiRW1haWwiOiJ0ZXN0dXNlckBnbWFpbC5jb20iLCJBZGRyZXNzIjoicmp5IiwiTWFwQWRkcmVzcyI6InRlc3QiLCJSb2xlSWQiOjAsIklzQWRtaW4iOiJZIiwiVXNlclR5cGUiOiJBIiwiU3RhdHVzIjoiWSIsIkNyZWF0ZWREYXRlIjoiMjAyMC0wOC0yNVQyMDoxNjoyNC41NTAiLCJDcmVhdGVkVXNlcklkIjowLCJVcGRhdGVkRGF0ZSI6IjIwMjAtMDgtMjVUMjA6MTY6MjQuNTUwIiwiVXBkYXRlZFVzZXJJZCI6MCwiVG9rZW4iOm51bGwsImlhdCI6MTYwMDE2Nzk4NiwiZXhwIjoxNjMxNzAzOTg2fQ.LPfPFsfCgW2f5bBrfEU6-RvVSGBJ7p5_4EOtxsf9aYw',
            }),
          body: {
            sp_id: this.obj.sp_id
            }
          };
              return this.http.delete(`${environment.apiUrl}subscriptionplans`, options );
            }

            getDealersHoursList(data){
              const addgroupTokenw = {
                headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjIwMDksIkZpcnN0TmFtZSI6IlByYXNhZCIsIkxhc3ROYW1lIjoiY2hhdmFsaSIsIlBob25lIjoiIiwiRW1haWwiOiJwY2hhdmFsaUBnbWFpbC5jb20iLCJBZGRyZXNzIjoiIiwiTWFwQWRkcmVzcyI6IjAiLCJSb2xlSWQiOjAsIklzQWRtaW4iOiJZIiwiVXNlclR5cGUiOiJBIiwiU3RhdHVzIjoiWSIsIkNyZWF0ZWREYXRlIjoiMjAyMC0xMC0xM1QyMDozMjozOS4zMTMiLCJDcmVhdGVkVXNlcklkIjowLCJVcGRhdGVkRGF0ZSI6IjIwMjAtMTAtMTNUMjA6MzI6MzkuMzEzIiwiVXBkYXRlZFVzZXJJZCI6MCwiVG9rZW4iOm51bGwsImlhdCI6MTYwMjg1NTkzMCwiZXhwIjoxNjM0MzkxOTMwfQ.JGqUfMrcXcPE2-gV1ePjQXKtozK5M924vGIsOuHzX80'
                })
              };
          
              return this.http.post(`${environment.apiUrl}dealerhours/get`, JSON.stringify(data),addgroupTokenw);
              
            }
          
            updateDealersHours(data){
              const addgroupTokenw = {
                headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjIwMDksIkZpcnN0TmFtZSI6IlByYXNhZCIsIkxhc3ROYW1lIjoiY2hhdmFsaSIsIlBob25lIjoiIiwiRW1haWwiOiJwY2hhdmFsaUBnbWFpbC5jb20iLCJBZGRyZXNzIjoiIiwiTWFwQWRkcmVzcyI6IjAiLCJSb2xlSWQiOjAsIklzQWRtaW4iOiJZIiwiVXNlclR5cGUiOiJBIiwiU3RhdHVzIjoiWSIsIkNyZWF0ZWREYXRlIjoiMjAyMC0xMC0xM1QyMDozMjozOS4zMTMiLCJDcmVhdGVkVXNlcklkIjowLCJVcGRhdGVkRGF0ZSI6IjIwMjAtMTAtMTNUMjA6MzI6MzkuMzEzIiwiVXBkYXRlZFVzZXJJZCI6MCwiVG9rZW4iOm51bGwsImlhdCI6MTYwMjg1NTkzMCwiZXhwIjoxNjM0MzkxOTMwfQ.JGqUfMrcXcPE2-gV1ePjQXKtozK5M924vGIsOuHzX80'
                })
              };
          
              return this.http.post(`${environment.apiUrl}dealerhours`, JSON.stringify(data),addgroupTokenw);
            }
    
            getStoreHolidays(data){
              const addgroupTokenw = {
                headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjIwMDksIkZpcnN0TmFtZSI6IlByYXNhZCIsIkxhc3ROYW1lIjoiY2hhdmFsaSIsIlBob25lIjoiIiwiRW1haWwiOiJwY2hhdmFsaUBnbWFpbC5jb20iLCJBZGRyZXNzIjoiIiwiTWFwQWRkcmVzcyI6IjAiLCJSb2xlSWQiOjAsIklzQWRtaW4iOiJZIiwiVXNlclR5cGUiOiJBIiwiU3RhdHVzIjoiWSIsIkNyZWF0ZWREYXRlIjoiMjAyMC0xMC0xM1QyMDozMjozOS4zMTMiLCJDcmVhdGVkVXNlcklkIjowLCJVcGRhdGVkRGF0ZSI6IjIwMjAtMTAtMTNUMjA6MzI6MzkuMzEzIiwiVXBkYXRlZFVzZXJJZCI6MCwiVG9rZW4iOm51bGwsImlhdCI6MTYwMjg1NTkzMCwiZXhwIjoxNjM0MzkxOTMwfQ.JGqUfMrcXcPE2-gV1ePjQXKtozK5M924vGIsOuHzX80'
                })
              };
          
              return this.http.post(`${environment.apiUrl}dealerholidays/get`, JSON.stringify(data),addgroupTokenw);
            }     
        
}
