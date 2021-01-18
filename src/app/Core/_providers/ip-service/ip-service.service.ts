import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// const headers ={ headers: new HttpHeaders({'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin': '*',
// 'X-Requested-With': 'XMLHttpRequest'})};
@Injectable({
  providedIn: 'root'
})
export class IpServiceService {

  constructor(private http:HttpClient) { }
  public getIPAddress()  
  {  
    return this.http.get("https://cors-anywhere.herokuapp.com/http://api.ipify.org/?format=json");  
  } 
}
