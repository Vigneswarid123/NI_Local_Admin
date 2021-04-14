import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServiceService } from '../../Core/_providers/admin-service/admin-service.service';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
import { environment } from '../../../environments/environment';


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
  SearchDealerForm:FormGroup;
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
  defaultPassword:any;
  defaultdealer=1
 // image: any=[];
 result:string;

 atozFltr:boolean=false;
 hide:boolean=false;
 alphaSrch:string='';
 DealerInfo:any=[];
alphaColumns:any=["Du_First_Name","Du_Last_Name"];
// alphaColumns:any=["rolename"];
 SearchAdminForm: FormGroup;

  imagebinding = `${environment.apiUrl}`+'/resources/images/';
  public Dealeruser:any =[];
  public dealerNames:any=[];

    constructor(private fB: FormBuilder,  private adminService:AdminServiceService, private Api:ApiService, private router: Router,
    private SpinnerService: NgxSpinnerService, private alertify: AlertifyService) {

    

    this.dshipForm = this.fB.group({
       FirstName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*')]],
       LastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*')]],
       DateofJoining:[''],
       JobTitle:[''],
       Dob:[''],
       Address2:[''],
       Gender: ['', Validators.required],
       Address1: [''],
       loginId: ['', [Validators.required, Validators.maxLength(50),Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')]],
       Password: [''],
       City: [''],
       State:[''],
       Zip:[''],
       Phone:[''],
       fileUpload:[''],
       Role: ['', Validators.required],
       dealeruser: ['', Validators.required],
       avatar: [null],
       status:['']
    });
    this.dealerForm = this.fB.group({
      dealer: ['', ''],
   
    })
    this.SearchDealerForm =this.fB.group({
      txtSearch:""
    });
   }
   get f() { return this.dshipForm.controls; }
  ngOnInit(){
  //  this.bindGrid();
  this.rolesList();
  this.getstates();
 // this.getDealerNames();
 this.getAllDealerShips();
  this.dshipForm.markAsUntouched();
  this.dshipForm.markAsPristine();
 // this.initialGrid();

    
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
initialGrid(){
  let obj={
    "id": "",
    "DealerId": 1,
    "expression": ""
  }
  this.Api.postmethod('dealeruser/get',obj).subscribe(res=>{
   //console.log("d-users",res);
   if(res.status==200){
   
    this.dealerUsersArry=res.response;
  //  this.DealerInfo=this.dealerUsersArry.response;
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
if(this.dealerUsersArry.length==0)
   {
     console.log(this.result)
this.result="No Records Found!!!";
   }
   else{
     this.result='';
   }
   }
  })
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
    this.submitted=false;
    this.rolesList();
    //this.getstates();
   // this.getDealerNames();
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
  //  this.DealerInfo=this.dealerUsersArry.response;
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
    if(this.dealerUsersArry.length==0)
    {
      console.log(this.result)
 this.result="No Records Found!!!";
    }
    else{
      this.result='';
    }
   
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
      this.initialGrid();
    }
}
  else {
    //this.alertify.error(res.message);
  }
});
}
// getDealerNames() {
//   const dealergroupObj = {
//     "dealergroupid": 0,
//     "expression": "dg_status = 'Y'"
//   };

//   this.Api.GetDealershipGroupsData(dealergroupObj).subscribe((resp: any) => {
//     console.log('Get groups Resp', resp);
//     if (resp.status == 200) {
//       this.dealerNames = JSON.parse(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
//       console.log('DealerGroups', this.dealerNames);
//     }
//   });
// }

getAllDealerShips(){
  const obj ={
    "DealerShipId": 0,
    "expression": ""
  }
  this.Api.postmethod('dealerships/alldealerships',obj).subscribe(res=>{
    console.log(res);
   if(res.status==200){
    this.dealerNames=res.response;
    console.log(this.dealerNames);
        }
});
    this.SpinnerService.hide();
}

getid(e){
  console.log(e.target.value)
 this.dealers=e.target.value;
 
 console.log(this.dealers)
  
 
 }
display(){
//  // this.submitted=true;
//  //this.submitted=false;
//   if (this.dealerForm.invalid) {
// alert("please select value")
// }
console.log("display")
this.bindGrid();
console.log(this.submitted)
//this.submitted=true;
// this.gridpnl=true;
// this.Addeditpnl=false;
}
onSubmit(){
  console.log("hii")
  this.submitted=true;
  if (this.dshipForm.invalid) {
    return;
  }
  console.log(this.dshipForm.value.Password)
  if(this.dshipForm.value.Password == null || this.dshipForm.value.Password == ""){
    console.log(this.dshipForm.value.Password)
    this.defaultPassword=1234
    console.log(this.defaultPassword)
  }
  else{
    this.defaultPassword=this.dshipForm.value.Password;
    console.log(this.defaultPassword)

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
        Password:this.defaultPassword,
        City:this.dshipForm.value.City,
        State:this.dshipForm.value.State,
         Zip:this.dshipForm.value.Zip,
         Phone: this.dshipForm.value.Phone,
         Role: this.dshipForm.value.Role,
       Status: 'Y',
       Userenable: 'N'
  }
  console.log(obj)
  const fd: any = new FormData();
      fd.append('data', JSON.stringify(obj));
    fd.append('file', this.uploadedFileName);
      console.log('Final Obj', obj);
      console.log(this.uploadedFileName)
      const options = { content: fd };
      this.adminService.postmethod('dealeruser',fd).subscribe((response:any)=>{
        console.log(response);
        if(response.status == 200){
          this.alertify.success('Dealeruser Inserted in succesfully');
         // alert("Record inserted successfully");
            console.log(response);
            this.dshipForm.reset();
            this.dshipForm.markAsUntouched();
            this.dshipForm.markAsPristine();
this.gridpnl=true;
this.Addeditpnl=false;
this.initialGrid();
           // this.router.navigate(['DealershipList']); 
        }
        else{
          alert("Please Check Details")
        }
      },
     (error) => {
      this.alertify.error(error);
    }); 
  
  
}
onAlphaCatch(alphabet){
  console.log("hii")
  this.hide=true;
  this.atozFltr=true;
  this.alphaSrch=alphabet;
  console.log("Alphabet"+this.alphaSrch);
}

onSearch(){
  this.alphaSrch= this.SearchDealerForm.controls['txtSearch'].value;
}

atoZClick(){
  if(!this.atozFltr)
  this.atozFltr=true;
  else
  this.atozFltr=false;
}



}
