import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServiceService } from '../../Core/_providers/admin-service/admin-service.service';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import { GridRolesComponent } from '../roles/grid-roles/grid-roles.component';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-dealerusers',
  templateUrl: './dealerusers.component.html',
  styleUrls: ['./dealerusers.component.scss']
})

export class DealerusersComponent implements OnInit {
 
 selecteimage=false;
  SearchText: any;
  dshipForm: FormGroup;
  dealerForm:FormGroup;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  uploadedFileName: any;
  submitted:boolean=false;
  Addeditpnl:boolean=false;
  gridpnl:boolean=true;
  chkstatus:boolean=false;
  id:number;
  dealers:number;
  defaultdealer=1
 // image: any=[];
  imagebinding = 'http://niapi.local.com/api/resources/images/';
  public Dealeruser:any =[];
    constructor(private fB: FormBuilder,  private adminService:AdminServiceService, private Api:ApiService, private router: Router,
    private SpinnerService: NgxSpinnerService) {
    this.dshipForm = this.fB.group({
       FirstName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*')]],
       LastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*')]],
       DateofJoining:['', Validators.required],
       JobTitle:[''],
       Dob:['', Validators.required],
       Address2:[''],
       Gender: ['', Validators.required],
       Address1: ['', [Validators.required, Validators.maxLength(50)]],
       loginId: ['', [Validators.required, Validators.maxLength(50),Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')]],
       Password: ['', [Validators.required, Validators.maxLength(50)]],
       City: ['', [Validators.required, Validators.maxLength(50)]],
       State:['', Validators.required],
       Zip:['', Validators.required],
       Phone:['', Validators.required],
       fileUpload:[''],
       Role: ['', Validators.required],
       dealeruser: ['', Validators.required],
       avatar: [null],
       status:['']
    });
    this.dealerForm = this.fB.group({
      dealer: ['', ''],
   
      // year: ['', [Validators.required]],
      // model: ['', [Validators.required]]
    })
   }
   get f() { return this.dshipForm.controls; }
  ngOnInit(){
  //  this.bindGrid();
  this.rolesList();
  this.getstates();
  this.getDealerNames();

  let obj={
    "id": "",
    "DealerId": 1,
    "expression": ""
  }
  this.Api.postmethod('dealeruser/get',obj).subscribe(res=>{
   //console.log("d-users",res);
   if(res.status==200){
    this.dealerUsersArry=res.response;
    console.log(this.dealerUsersArry)
    this.dealerUsersArry.forEach(element => {
      this.rolesArray.forEach(data => {
        if (element.Du_Role == data.Role_UniqId) {
          console.log('ccc', data.Role_Name);
          element.rolename=data.Role_Name
      
        }
      })
   //   console.log('rolenames', this.dealerUsersArry)
    });

   
   }
  })
    
  }
 
  public proimg: any = '';
  public showimg: boolean = true;
  public showchangeimg: boolean = false;
  public selectedFile: any = null;
  public imageChangedEvent: any = '';
 
  imageLoaded(image: HTMLImageElement) {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
  imageCropped(event: ImageCroppedEvent) {
    this.proimg = event.base64;
    this.previewUrl = event.base64;
    const fileToUpload: File = new File([this.dataURItoBlob(this.previewUrl)], 'filename.png');
    this.selectedFile = fileToUpload;
    this.uploadedFileName = fileToUpload;
    
    console.log(this.uploadedFileName)
    this.showimg = false;
    this.showchangeimg = true;
}
dataURItoBlob(dataURI): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.selecteimage=true;
}
  public preview(): void {
    // Show preview
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }
  removeimg() {
    console.log( this.uploadedFileName);
    this.previewUrl = '';
    this.selecteimage=false;
    this.proimg='';
  }
  showAddPanel(){
    this.Addeditpnl=true;
    this.gridpnl=false;
    this.rolesList();
    //this.getstates();
    this.getDealerNames();
  }
  Cancel(){
    this.Addeditpnl=false;
    this.gridpnl=true;
    this.dshipForm.reset();
    this.dshipForm.markAsUntouched();
    this.dshipForm.markAsPristine();
  }
  editBrand(val){

    console.log(val.Du_Id, 'ddd');
 
 
    this.router.navigate(['dealerusersedit'], { queryParams: { Du_Id: val.Du_Id } });


  }
  getstates() {
    this.adminService.get('states?185').subscribe(
      response => {
        // console.log('Getstates', response.response);
        this.getstates =  response;
  });
}
dealerUsersArry:any=[];
bindGrid(){
  this.SpinnerService.show();
  let obj={
    "id": "",
    "DealerId": this.dealers,
    "expression": ""
  }
  this.Api.postmethod('dealeruser/get',obj).subscribe(res=>{
   //console.log("d-users",res);
   if(res.status==200){
    this.dealerUsersArry=res.response;
    console.log(this.dealerUsersArry)
    this.dealerUsersArry.forEach(element => {
      this.rolesArray.forEach(data => {
        if (element.Du_Role == data.Role_UniqId) {
          console.log('ccc', data.Role_Name);
          element.rolename=data.Role_Name
      
        }
      })
   //   console.log('rolenames', this.dealerUsersArry)
    });

   
  }
});
    this.SpinnerService.hide();
 
}
rolesArray:any=[];
rolesList(){
  const obj = {
    Role_Id: 0
  };
this.Api.showRolesData(obj).subscribe((res: any) => {
  if (res.status === 200) {
    const roles = res.response;
    if (roles) {
      this.rolesArray = res.response;
      console.log(roles);
    }
}
  else {
    //this.alertify.error(res.message);
  }
});
}
dealerNames:any=[];
getDealerNames() {
  const dealergroupObj = {
    "dealergroupid": 0,
    "expression": "dg_status = 'Y'"
  };

  this.Api.GetDealershipGroupsData(dealergroupObj).subscribe((resp: any) => {
    console.log('Get groups Resp', resp);
    if (resp.status == 200) {
      this.dealerNames = JSON.parse(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
     // console.log('DealerGroups', this.dealerNames);
    }
  });
}
getid(e){
  console.log(e.target.value)
 this.dealers=e.target.value;
 
 console.log(this.dealers)
  
 
 }
display(){
 // this.submitted=true;
  if (this.dealerForm.invalid) {
alert("please select value")
}
console.log("display")
this.bindGrid();
// this.gridpnl=true;
// this.Addeditpnl=false;
}
onSubmit(){
  this.submitted=true;
  if (this.dshipForm.invalid) {
    return;
  }
const  obj ={
  F_Name: this.dshipForm.value.FirstName,
  L_Name: this.dshipForm.value.LastName, 
  Dealer_id:this.dshipForm.value.dealeruser, 
  Gender: this.dshipForm.value.Gender,
  JoinDate: this.dshipForm.value.DateofJoining,
  Job_title:this.dshipForm.value.JobTitle,
  Dob: this.dshipForm.value.Dob, 
  Address1:this.dshipForm.value.Address1, 
  Address2:this.dshipForm.value.Address2,
  login_id:this.dshipForm.value.loginId, 
        Password:this.dshipForm.value.Password,
        City:this.dshipForm.value.City,
        State:this.dshipForm.value.State,
         Zip:this.dshipForm.value.Zip,
         Phone: this.dshipForm.value.Phone,
         Role: this.dshipForm.value.Role,
       Status: 'Y'
  }
  const fd: any = new FormData();
      fd.append('data', JSON.stringify(obj));
    fd.append('file', this.uploadedFileName);
      console.log('Final Obj', obj);
      const options = { content: fd };
      this.adminService.postmethod('dealeruser',fd).subscribe((response:any)=>{
        console.log(response);
        if(response.status == 200){
          alert("Record inserted successfully");
            console.log(response);
            this.dshipForm.reset();
            this.dshipForm.markAsUntouched();
            this.dshipForm.markAsPristine();
this.gridpnl=true;
this.Addeditpnl=false;
this.bindGrid();
           // this.router.navigate(['DealershipList']); 
        }
      },
     (error) => {
      console.log('error',error);
    }); 
  
  
}
}
