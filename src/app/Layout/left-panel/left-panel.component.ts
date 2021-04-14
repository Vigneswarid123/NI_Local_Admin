import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {AdminServiceService} from '../../Core/_providers/admin-service/admin-service.service';
import*as $ from'jquery';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {
  fullUrl = `${environment.apiUrl}`; 
  indexval:number;
  CurrentPage:string;
  path:any;
  afterload:string;
  public response:any=[]
  public Paneldata:any =[]
  private previousUrl : string;
  private currentUrl: string; 
  navOpen:boolean;
  isSettingNavIsActive=true;

  constructor(private service:AdminServiceService,private router:Router,) {

  
    this.previousUrl=localStorage.getItem('currentUrl');
    console.log(this.previousUrl);
    router.events.subscribe(event => {     
      if (event instanceof NavigationEnd) {         
        this.currentUrl = event.url;  
        console.log(this.currentUrl);
        console.log( this.previousUrl);
        localStorage.setItem('currentUrl',this.currentUrl);
        if(this.currentUrl == "/dashboard"){
          this.CurrentPage="Dealerships",       
          console.log(this.CurrentPage)
        }
        else if(this.currentUrl !== this.previousUrl ){
          console.log(localStorage.getItem('currentpage'));
          this.afterload=localStorage.getItem('currentpage');
          console.log(this.afterload)
          this.CurrentPage=this.afterload;
          this.navOpen=true;
          console.log(this.CurrentPage)
        }
        else if(this.currentUrl !== "/dashboard"){
          console.log(localStorage.getItem('currentpage'));
          this.afterload=localStorage.getItem('currentpage');
          console.log(this.afterload)
          this.CurrentPage=this.afterload;
          this.navOpen=true;
          console.log(this.CurrentPage)
        }
      
      };
    });  
  }
  
  
  ngOnInit() {
     this.getData(); 
  }
 
  ival(val,index){
   this.indexval = index;
  this.CurrentPage=val.modname;
    console.log(this.CurrentPage)    
    localStorage.setItem('currentpage',this.CurrentPage); 
  
  }

  getData(){
    this.service.postmethod('adminmodules/getmoduleinfo',{​​​​​​​​"Type": "A"}​​​​​​​​).subscribe(res=>{​​​​​​​​
    this.response=res
    if(this.response.status==200){
    this.Paneldata=this.response.response.ModuleData.Module;
    console.log(this.Paneldata)
      }    
    })
  }
}
