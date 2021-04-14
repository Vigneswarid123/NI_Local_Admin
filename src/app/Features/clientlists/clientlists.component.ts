import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import {AdminServiceService} from '../../Core/_providers/admin-service/admin-service.service'
import { Router } from '@angular/router';
// import { AlertifyService } from '../../_services/alertify.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-clientlists',
  templateUrl: './clientlists.component.html',
  styleUrls: ['./clientlists.component.scss']
})
export class ClientlistsComponent implements OnInit {
  ClientsArray = [];


  SearchclientsForm: FormGroup;
  hide:boolean=false;
  alphaSrch:string='';
  atozFltr:boolean=false;
  ClientInfo:any=[];
  alphaColumns:any=["ENDUSER_TITLE"];
  constructor(private fB: FormBuilder,
    private service: AdminServiceService,
    private router: Router,
    private SpinnerService: NgxSpinnerService) { 
      this.SearchclientsForm =this.fB.group({
        txtSearch:""
      });
    }
 ngOnInit(): void {
    this.router.navigateByUrl('clientList');
    this.ClientList();
  }

  ClientList(){
    this.SpinnerService.show();
    const obj = {
    };
  this.service.clientlist(obj).subscribe((res: any) => {
    if (res.status === 200) {
   
    
        this.ClientsArray = res.response;
        this.ClientInfo = res.response;
        console.log(this.ClientInfo);
        this.SpinnerService.hide();

      
}
    else {
      //this.alertify.error(res.message);
    }
  });
}
onAlphaCatch(alphabet){
  this.hide=true;
  this.atozFltr=true;
  this.alphaSrch=alphabet;
   
}

onSearch(){
  this.alphaSrch= this.SearchclientsForm.controls['txtSearch'].value;
}

atoZClick(){
  if(!this.atozFltr)
  this.atozFltr=true;
  else
  this.atozFltr=false;
}

}
