import { Component, OnInit } from '@angular/core';
import {AdminServiceService} from '../../Core/_providers/admin-service/admin-service.service';
import { FormBuilder, Validators,FormGroup } from "@angular/forms";

@Component({
  selector: 'app-adminmodules',
  templateUrl: './adminmodules.component.html',
  styleUrls: ['./adminmodules.component.scss']
})
export class AdminmodulesComponent implements OnInit {
  SearchText: any;
  grid:boolean=true;
  editadmin:boolean=false;
  editsubmodule:boolean=false;
  addsubmodule:boolean=false;
  addadmin:boolean=false;
  submitted=false;
  public globalResponse: any = [];
  public subModuleResponse: any = [];
  public updatedResponse: any = [];
  public updatedSubModuleResponse: any = [];
  public insertedResponse: any = [];
  public editAdmin: any = [];
  public editSubModule: any = [];
  editAdminModule: any = [];
  editAdminSubModule: any = [];
  addSubModule: any = [];
  addAdminModule: any = [];
  adminModuleForm: FormGroup;
  subModuleForm: FormGroup;
  addSubModuleForm: FormGroup;
  addAdminModuleForm: FormGroup;
  activeStatus: string;
  adminStatus: string;
  activeStatusAdd: string;
  addadminStatus: string;
  subResult: string;
  Result: string;
  constructor(private service:AdminServiceService,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.adminList();
     this.adminModuleForm = this.fb.group({

     mod_name: ['' , [Validators.required,Validators.pattern('[a-zA-Z ]*'),Validators.maxLength(50)]],
      mod_seq: ['', [Validators.required,Validators.pattern('[0-9]*'),Validators.maxLength(5)]],
      // mod_uid: ['', [Validators.required,Validators.pattern('[0-9]*'),Validators.maxLength(5)]],
      mod_admin:  ['', [Validators.required]],
      mod_front:  ['', [Validators.required]],
      mod_status: [true, [Validators.requiredTrue]]
     })
  
     this.addAdminModuleForm = this.fb.group({
       
      mod_name: ['' , [Validators.required,Validators.pattern('[a-zA-Z ]*'),Validators.maxLength(50)]],
       mod_seq: ['', [Validators.required,Validators.pattern('[0-9]*'),Validators.maxLength(5)]],
       // mod_uid: ['', [Validators.required,Validators.pattern('[0-9]*'),Validators.maxLength(5)]],
       mod_admin:  ['Y', [Validators.required]],
       mod_front:  ['N', [Validators.required]],
       mod_status: [true, [Validators.requiredTrue]]
      })
    
     this.subModuleForm = this.fb.group({
    
      smod_name: ['', [Validators.required,Validators.pattern('[a-zA-Z ]*'),Validators.maxLength(50)]],
      smod_filename: ['' , [Validators.required,Validators.pattern('[a-zA-Z ]*'),Validators.maxLength(50)]],   
      smod_seq: ['', [Validators.required,Validators.pattern('[0-9]*'),Validators.maxLength(5)]],
      smod_active: [true, [Validators.requiredTrue]]
  
  // smod_id: 1
  // smod_mod_id: 20
  
    })
    this.addSubModuleForm = this.fb.group({
    
      smod_name: ['', [Validators.required,Validators.pattern('[a-zA-Z ]*'),Validators.maxLength(50)]],
      smod_filename: ['' , [Validators.required,Validators.pattern('[a-zA-Z ]*'),Validators.maxLength(50)]],   
      smod_seq: ['', [Validators.required,Validators.pattern('[0-9]*'),Validators.maxLength(5)]],
      smod_active: [true, [Validators.requiredTrue]]
  
  // smod_id: 1
  // smod_mod_id: 20
  
    })
     }
  adminList(){
    const obj={
    "ID":0,
    "expression":""
    
    }
    this.service.AdminModules(obj).subscribe(
      response => {
        this.globalResponse = response;
        if(this.globalResponse.response==""){
          this.Result="No Result Found!!!"
        }
        else{
          this.Result="";
        }
         console.log(this.globalResponse);
      });
      
  }
  subModuleList(){
    const obj={
    "modId":this.editAdminModule.mod_id,
    "subId":0,
    "expression":""
    
    }
    console.log(obj)
    this.service.adminSubModules(obj).subscribe(
      response => {
        this.subModuleResponse = response;
        if(this.subModuleResponse.response=="")
        {
          this.subResult="No Result Found!!!";
  
        }
        else{
          this.subResult="";
        }
          
         console.log(this.subModuleResponse);
      });
      
  }
 
  updateAdminonSubmit(){
     this.submitted = true;
    console.log('hi')
    if (this.adminModuleForm.invalid) {
     return;
    }
this.editAdmin=this.adminModuleForm.value;
 console.log(this.editAdmin)
 if(this.editAdmin.mod_status==true){
this.adminStatus="Y"
 }
    const obj={
      mod_id:this.editAdminModule.mod_id,
      mod_name:this.editAdmin.mod_name,
      mod_seq:this.editAdmin.mod_seq ,
      mod_uid:this.editAdminModule.mod_uid ,
  
      mod_admin:this.editAdmin.mod_admin ,
      mod_front:this.editAdmin.mod_front ,
      mod_status:this.adminStatus
     
    }
 
 console.log(obj)
    this.service.updateAdmin(obj).subscribe( response => {
      this.updatedResponse = response;
      if(this.updatedResponse.status==200){
        alert("Admin updated successfully");
        console.log(this.updatedResponse)
        this.grid=true;
        this.editadmin=false;
        this.adminList();
      }
    });
   
  }



  updateSubModuleonSubmit(){
    this.submitted = true;
   
   if (this.subModuleForm.invalid) {
    return;
   } 
    else {
    const val = this.subModuleForm.value;
    console.log(val);
    if(val.smod_active==true){
     this.activeStatus="Y"
    }
    console.log(this.activeStatus)
    const obj={
      smod_id:this.editAdminSubModule.smod_id,
      smod_mod_id:this.editAdminModule.mod_id,
      smod_name:val.smod_name,
      smod_seq:val.smod_seq ,
      smod_filename:val.smod_filename ,
      smod_active:this.activeStatus    
     }
    console.log(obj)
    this.service.updateSubModule(obj).subscribe( response => {
      this.updatedSubModuleResponse = response;
      if(this.updatedSubModuleResponse.status==200){
        alert("Sub module updated successfully");
        console.log(this.updatedSubModuleResponse)
        this.editsubmodule=false;
        this.editadmin=true;
      
        this.subModuleList();
      }
  });
    }
 }

 addSubModuleonSubmit(){
  this.submitted = true;
  if (this.addSubModuleForm.invalid) {
   return;
  }
  console.log('hi')
this.addSubModule=this.addSubModuleForm.value;
console.log(this.addSubModule)
if(this.addSubModule.smod_active==true){
this.activeStatusAdd="Y"
}
  const obj={
   smod_mod_id:this.editAdminModule.mod_id,
   smod_name:this.addSubModule.smod_name,
   smod_seq:this.addSubModule.smod_seq ,
   smod_filename:this.addSubModule.smod_filename ,
   smod_active:this.activeStatusAdd ,  
  }
console.log('hi')
console.log(obj)
  this.service.addSubModule(obj).subscribe( response => {
    this.updatedSubModuleResponse = response;
    if(this.updatedSubModuleResponse.status==200){
      alert("Sub module inserted successfully");
     this.resetSubModule();
     this.addSubModuleForm.markAsPristine();
  this.addSubModuleForm.markAsUntouched();
      this.addsubmodule=false;
      this.editadmin=true;
    
      this.subModuleList();
      console.log(this.updatedSubModuleResponse)
    }
});
 }

 addAdminonSubmit(){
  this.submitted = true;
    console.log('hi')
    if (this.addAdminModuleForm.invalid) {
     return;
    }
this.addAdminModule=this.addAdminModuleForm.value;
 console.log(this.addAdminModule)
 if(this.addAdminModule.mod_status==true){
this.addadminStatus="Y"
 }
    const obj={
     
      mod_name:this.addAdminModule.mod_name,
      mod_seq:this.addAdminModule.mod_seq ,
      mod_uid:1 ,
  
      mod_admin:this.addAdminModule.mod_admin ,
      mod_front:this.addAdminModule.mod_front ,
      mod_status:this.addadminStatus
     
    }
 
 console.log(obj)
    this.service.addAdmin(obj).subscribe( response => {
      this.insertedResponse = response;
      if(this.insertedResponse.status==200){
        alert("Admin Inserted successfully");
        this.resetAdminModule();
        this.addAdminModuleForm.markAsPristine();
        this.addAdminModuleForm.markAsUntouched();
        this.grid=true;
        this.addadmin=false;
        this.adminList();
        console.log(this.insertedResponse)
     
      }
    });
   
  }
 
 addSubMod(){
 
  this.grid=false;
  this.editadmin=false;
  this.editsubmodule=false;
  this.addsubmodule=true;
  
 }
 ActionAdmin(val){
  this.grid=false;
  this.editadmin=true;
  this.editsubmodule=false;
  this.addsubmodule=false;
  console.log(val)
 this.editAdminModule=val;
 if (this.editAdminModule.mod_status=="D"){
this.editAdminModule.mod_status=false;
 }
 else{
   this.editAdminModule.mod_status=true;
 }
 console.log(this.editAdminModule);
 this.subModuleList();

  }


backgrid(){
  this.grid=true;
  this.editadmin=false;
  this.editsubmodule=false;
  this.addsubmodule=false;
  this.addadmin=false;
    this.adminList();
}

ActionSubAdmin(val){
  this.grid=false;
  this.editadmin=false;
  this.editsubmodule=true;
  this.addsubmodule=false;
  this.addadmin=false;
  this.editAdminSubModule=val;
  if (this.editAdminSubModule.smod_active=="Y"){
    this.editAdminSubModule.smod_active=true;
     }
     else{
       this.editAdminSubModule.smod_active=false;
     }
     console.log(this.editAdminSubModule);
    
 
}
resetSubModule(){

  this.addSubModuleForm.controls.smod_name.reset("");
  this.addSubModuleForm.controls.smod_filename.reset("");
  this.addSubModuleForm.controls.smod_seq.reset("");
}

resetAdminModule(){

  this.addAdminModuleForm.controls.mod_name.reset("");
  this.addAdminModuleForm.controls.mod_seq.reset("");

}
backeditadmin(){
  this.addSubModuleForm.markAsPristine();
  this.addSubModuleForm.markAsUntouched();
  this.grid=false;
  this.editadmin=true;
  this.editsubmodule=false;
  this.addsubmodule=false;
  this.addadmin=false; 
  this.subModuleList();
 this.resetSubModule();
  
}
addAdmin(){
  this.grid=false;
  this.editadmin=false;
  this.editsubmodule=false;
  this.addsubmodule=false; 
 this.addadmin=true;
}
afteradd(){
  this.addAdminModuleForm.markAsPristine();
  this.addAdminModuleForm.markAsUntouched();
  this.grid=true;
  this.editadmin=false;
  this.editsubmodule=false;
  this.addsubmodule=false;
  this.addadmin=false;
    this.adminList(); 
   this.resetAdminModule();
  //  location.reload();
  
}

}
