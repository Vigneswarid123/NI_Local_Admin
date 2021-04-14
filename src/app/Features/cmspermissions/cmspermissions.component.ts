import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, OnInit } from '@angular/core';

//import { AlertfyService } from '../alertfy.service';
//import { AuthService } from '../auth/auth.service';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cmspermissions',
  templateUrl: './cmspermissions.component.html',
  styleUrls: ['./cmspermissions.component.css']
})
export class CmspermissionsComponent implements OnInit {

  module: any;

  cmsModules: any;
  uid: any = [];
  roleId = '0';
  TypeId='0';
  modeType = "";
  cmsModulesMap: any = [];
  cmsTittleMap:any=[];
  ShowButtons=false;
  showdata=true;
 // isLoading = false;
  constructor(private auth: ApiService, private alertfy: AlertifyService,private router: Router,
  ) { }

  ngOnInit(): void {
  
  }


  public onOptionsSelectedType(event){
    console.log(event);
   this.getRoles(event.target.value);
  }


  public onOptionsSelected(event) {

    let vals='';
    if(this.TypeId='A')
    vals="mod_admin='Y'"
    else if(this.TypeId='F')
    vals="mod_front='Y'"
  
    this.roleId = event.target.value;
      const modulesCms = {
        "RoleID": this.roleId,
        "expression": vals
      }
      this.auth.postmethod('permissionsbasedonroles/get',modulesCms).subscribe((resCmsModule:any)=>{
        this.ShowButtons=true;
        this.showdata=false;
        this.cmsModules=[];
        this.cmsModules = resCmsModule.response;
      //   this.cmsModulesMap=[];
      //  //this.cmsModulesMap=resCmsModule.response;
      //    for(let T in this.cmsModules){
      //     if(this.cmsModules[T].smod_mod_id!=0){
      //       this.cmsModulesMap.push(this.value(this.cmsModules[T]));
      //     }
      //    }
      //   // this.uid=[];
      //    for(let i=0; i< this.cmsModules.length; i++){
      //     for(let j=0; j<this.cmsModulesMap.length; j++){
      //       if (this.cmsModulesMap[j].smod_mod_id == this.cmsModules[i].mod_id && this.cmsModules[i].smod_id==0  ) {
      //         this.cmsModules[i].status="Y";
      //       }
      //       else{this.cmsModules[i].status="N";}
      //     }
      //   }
        
        this.uid=[];
        this.cmsModules.forEach(el => {
          if (el.status == "Y") {
            this.cmsModules[el.mod_id].status="Y";
            this.uid.push(el.smod_id.toString());
          }
        })
      })
  }

  
  // value(dt)  {
  //   return ({
  //     smod_mod_id:dt.smod_mod_id,
  //     smod_id:dt.smod_id,
  //     status:dt.status
  //   });
  // };

  checkChild(id, main, evt) {
    let arry1: any = [];
    let target = evt.target;
    if (target.checked) {

      for (let i = 0; i < this.cmsModules.length; i++) {
        if (id.smod_mod_id == this.cmsModules[i].mod_id) {
           //console.log(this.cmsModules[i]);
          id.status = "Y";
          this.cmsModules[i].status = "Y";

          break;

        }
      }
    } else {

      for (let i = 0; i < this.cmsModules.length; i++) {
        if (main.mod_id == this.cmsModules[i].smod_mod_id) {
         // console.log(this.cmsModules[i]);
          arry1.push(this.cmsModules[i]);
          id.status = "N";
        }
      }
      const allEqual = arr => arr.every(val => val.status === "N");
      const result = allEqual(arry1) // output: false
      result == true ? main.status = "N" : main.status = "Y"

    }
    if (target.checked) {
      this.uid=[];
      this.cmsModules.forEach(el => {
        if (el.status == "Y") {
          this.uid.push(el.smod_id.toString());
        }
      })
    } else {
      this.cmsModules.forEach(el => {
        if (el.status == "N") {

          this.uid.forEach((e, index) => {
            if (e == el.smod_id) {
              this.uid.splice(index, 1);
            }
          })
        }
      })
      // this.uid.forEach((e, index) => {
      //   if (e == id.smod_id) {
      //     this.uid.splice(index, 1)
      //   }
      // })


    }

  }
  
  checkParent(id, evt) {
    let target = evt.target;
    if (target.checked) {

      for (let i = 0; i < this.cmsModules.length; i++) {
        if (id.mod_id == this.cmsModules[i].smod_mod_id) {
          this.cmsModules[i].status = "Y";
        }
      }
      this.uid=[];
      this.cmsModules.forEach(el => {
        if (el.status == "Y") {
          this.uid.push(el.smod_id.toString());
        }
      })
    } else {
      for (let i = 0; i < this.cmsModules.length; i++) {
        if (id.mod_id == this.cmsModules[i].smod_mod_id) {
          // console.log(this.cmsModules[i]);
          this.cmsModules[i].status = "N";
        }
      }
      this.cmsModules.forEach((el) => {
        if (el.status == "N") {
          this.uid.forEach((e, index) => {
            if (e == el.smod_id) {
              this.uid.splice(index, 1);
            }
          })

        }
      })
      this.uid.forEach((e, index) => {
        if (e == id.smod_id) {
          this.uid.splice(index, 1)
        }
      })
    }
  }

  Roles: any = [];
  getRoles(flag) {
    let val='';
    if(flag=='A')
    val="Role_Admin='Y'";
    else if(flag=='F')
    val="Role_Front='Y'";
     const obj={"Role_Id":'0',"expression":val}
    this.auth.postmethod('roles/get',obj).subscribe((roleEditData: any) => {
      if (roleEditData.status == 200) {
        this.Roles = roleEditData.response;     
      }
    }, err => {

    })
  }


saveModulePermissons() {
if(this.uid.length>0  ){
//console.log(this.roleId,this.uid.join(","),this.TypeId);
const obj={
  "Action":'U',
  "NI_ROLE_ID":this.roleId,
  "NI_SMOD_ID":this.uid.join(","),
  "NI_TYPE":this.TypeId
}
this.auth.putmethod('permissionsbasedonroles',obj).subscribe((data: any) => {
  if (data.status == 200) {
        
            this.alertfy.success(data.response)
    
          }
        }, err => {
          this.alertfy.error("Modules don't not added!!");
        })

}else{
  this.alertfy.error("Please select modules");
}
    
};

cancelBack() {
  this.ShowButtons=false;
  this.router.navigate(['/dashboard']);
}


}

 

 

