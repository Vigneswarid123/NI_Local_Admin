import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner"; 
import { MatDialog } from '@angular/material/dialog';
import {ContactComponent} from '../../Features/contact/contact.component';
import {OemgrouppopupComponent} from '../../Features/oemgrouppopup/oemgrouppopup.component'

@Component({
  selector: 'app-oembrands',
  templateUrl: './oembrands.component.html',
  styleUrls: ['./oembrands.component.scss']
})
export class OembrandsComponent implements OnInit {

  public Brands: any = [];

  brandForm: FormGroup;
  submitted = false;
  addclick = false;
  showgrid = false;
  SearchBrandForm: FormGroup;


  hide:boolean=false;
  alphaSrch:string='';
  atozFltr:boolean=false;
  BrandInfo:any=[];
  alphaColumns:any=["brand_name"];
   
  selectedFile:any=null;
  file: File;

  fileName: string = "";
  ImageFolder="http://devadmin.netimpact.com/assets/Images/BrandLogo/";
  

  EditView = false;
  AddView = false;
  BrandId=0;
  fileData: File = null;



  selectedBrands: any=[];
  showBrandDiv:boolean=false;
  oemgroups: any;
  selectedItem: any;
  selectedOemGroups: any=[];
  selectedgroupid: any=[];
  selectedgroupList: any=[];
  groupcontact: any = [];

  @ViewChild('menu', { static: false }) menu: ElementRef;
  

  constructor(private fB: FormBuilder, private ApiService: ApiService,private sanitizer: DomSanitizer, private router: Router,
    private SpinnerService: NgxSpinnerService,private renderer: Renderer2, public dialog: MatDialog) {

      this.renderer.listen('window', 'click',(e:Event)=>{
        //console.log(this.menu.nativeElement.value);
        //if(e.target !== this.menu.nativeElement){
          if(this.menu == undefined){
          this.showBrandDiv=false; 
        }
        else
        this.showBrandDiv=false; 
      });
    this.showgrid = true;
    this.brandForm = this.fB.group({
      brandname: ['', [Validators.required, Validators.maxLength(51)]],
      branddesc: [''],
      brandurl: [''],
      recallurl: [''],
      chromeid: ['', Validators.required],
      brandacronym: [''],
      backgroundcolor: [''],
      //forecolor:[''],
      logohighlights: [''],
      file: [''],
      groupbrands: ['']
    });

    this.SearchBrandForm =this.fB.group({
      txtSearch:""
    });
  
  }

  ngOnInit(): void {
    this.router.navigateByUrl('oembrands');
    this.GetBrandsList();
    this.alphaSrch="";
    this.GetOEMGroups();
     
  }

  processFile(element:any){
    this.fileData= <File>element.target.files[0];
    this.preview();
  }
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.selectedFile = reader.result; 
    }
}

  brndTempData:any=[];
  GetBrandsList() {
    this.BrandInfo=[];
    this.alphaSrch="";
    this.SpinnerService.show();
    const obj = { "brand_id": 0 };
    this.ApiService.GetOemBrands(obj).subscribe(
      (resp: any) => {
        if (resp.message == "success") {
          this.Brands = resp;
          this.SpinnerService.hide();
          
          this.BrandInfo = resp.response;
          this.brndTempData=this.BrandInfo;
          console.log("data"+ this.BrandInfo)
        }
        //this.BrandContant=this.Brands.response[0].brand_id.toString();
      });
  }
  OnSubmit() {
    this.submitted = true;
    if (this.brandForm.invalid) {
      return
    }
    const formdata:any = new FormData();
    let brid=0;
   
    if(this.BrandId!=0)
       brid=this.BrandId;
       
    const obj = {
      Brand_Id: brid,
      ChromeId: this.brandForm.value.chromeid,
      BrandName: this.brandForm.value.brandname,
      BrandUrl: this.brandForm.value.brandurl,
      Description: this.brandForm.value.branddesc,
      Logohoghlights: this.brandForm.value.logohighlights,
      Acronym: this.brandForm.value.brandacronym,
      BackGroundColor: this.brandForm.value.backgroundcolor,
      RecallUrl: this.brandForm.value.recallurl,
      status: "Y",
      contact : this.groupcontact
    };
    if (this.selectedFile && brid == 0){
    formdata.append('data', JSON.stringify(obj));
   
      formdata.append('file', this.file,this.fileName);
    }
      console.log(obj)
     if(brid == 0){
      this.ApiService.postmethod('oembrands',formdata).subscribe((response:any)=>{
        console.log(response);
        if(response.status == 200){
          this.addclick=false;
          this.showgrid=true;
          this.GetBrandsList();
        }
      },
      
    //},
     (error) => {
      console.log(error);
    });
  }
  else{
    const obj1 = {
      Brand_Id: brid,
      ChromeId: this.brandForm.value.chromeid,
      BrandName: this.brandForm.value.brandname,
      BrandLogo:this.brandForm.value.file,
      BrandUrl: this.brandForm.value.brandurl,
      Description: this.brandForm.value.branddesc,
      Logohoghlights: this.brandForm.value.logohighlights,
      Acronym: this.brandForm.value.brandacronym,
      BackGroundColor: this.brandForm.value.backgroundcolor,
      RecallUrl: this.brandForm.value.recallurl,
      status: "Y",
      contact : this.groupcontact
    };
    this.ApiService.putmethod('oembrands',obj1).subscribe((response:any)=>{
      console.log(response);
      if(response.status == 200){
        this.addclick=false;
        this.showgrid=true;
        this.GetBrandsList();
      }
    },
    
  //},
   (error) => {
    console.log(error);
  });
  }
  }
  showAddPanel() {
    this.addclick = true;
    this.showgrid = false;
    this.AddView = true;
  }
  showGridPanel() {
    this.showgrid = true;
    this.addclick = false;
    this.GetBrandsList();
  }

  onAlphaCatch(alphabet){
    this.hide=true;
    this.atozFltr=true;
    this.alphaSrch=alphabet;
    this.BrandInfo=this.brndTempData;
    console.log(this.alphaSrch);
  }

  onSearch(){
    
    this.alphaSrch= this.SearchBrandForm.controls['txtSearch'].value;
    console.log(this.alphaSrch);
    this.BrandInfo=this.brndTempData;
    
  }

  atoZClick(){
    if(!this.atozFltr)
    this.atozFltr=true;
    else
    this.atozFltr=false;
  }

  editBrand(brid) {
    //const file1="";
    this.EditView = true;
    this.BrandId=brid;
    this.Brands = [];
    const obj = { 'brand_id': brid };
    this.ApiService.GetOemBrands(obj).subscribe((response: any) => {
      console.log(response)
      if (response.status == 200) {
        this.addclick = true;
        this.showgrid = false;
        this.brandForm.patchValue({
          brandname: response.response[0].brand_name,
          branddesc: response.response[0].brand_desc,
          brandurl: response.response[0].brand_url,
          recallurl: response.response[0].brand_recall_url,
          chromeid: response.response[0].brand_chrome_id,
          brandacronym: response.response[0].brand_acronym,
          backgroundcolor: response.response[0].brand_backgroundcolor,

          logohighlights: response.response[0].brand_logohighlights,
          file: response.response[0].brand_logo
        });
      
        let objectURL = 'data:image/png;base64,' + response.response[0].brand_logo;
        this.selectedFile = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        
      }
    });
  }

  OnChangeEvent(e){
    this.selectedOemGroups=this.filter(e.target.value.toLowerCase())
    this.showBrandDiv=true;
 }

 filter(val: string): string[] {
  return this.oemgroups.filter(option =>
    option.OEM_Name.toLowerCase().indexOf(val.toLowerCase()) === 0);
}


GetOEMGroups(){
  this.oemgroups=[];
   
  let expression='';
  
  expression = "";
  const obj = { "Id": 0, expression :expression };
  this.ApiService.GetOEMGroupsList(obj).subscribe((response:any)=>{
       console.log(response.response)
       if(response.status==200){
         
         this.oemgroups=response.response;
       }         
  });
}

highlightRow(option){
  this.selectedItem = option.OEM_Name;
}

selectItem(event:Event,item,index){
  event.stopPropagation();
  if(this.selectedgroupid == "")
     this.selectedgroupid=[];
if(item!=''){
   this.selectedgroupid.push(item.OEM_Id);
  this.selectedgroupList.push({OEM_Id:item.OEM_Id,OEM_Name:item.OEM_Name});
  this.selectedItem=item;
}
// if(this.selectedgroupList.length>0)
//  this.selectedBrandsList.join(",")
 
 this.oemgroups.splice(index,1);
 this.showBrandDiv=false;
 this.brandForm.patchValue({
   groupbrands:''});
// console.log(this.selectedBrandsList) 
// console.log(this.selectedbrandid)    
}

OpenContactPopUp(){
  if(this.groupcontact == null)
    this.groupcontact =[];
  const dialogRef = this.dialog.open(ContactComponent, {
    width: '500px',
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    //const resp = JSON.parse(`${result}`);
    //console.log('Dialog result:', resp);
    if (result != undefined)
      this.groupcontact.push(result);
      console.log('groupcontact', this.groupcontact);
      this.GetOEMGroups();
  });
}
showOEMPopup(){
  // if(this.groupcontact == null)
  //   this.groupcontact =[];
  const dialogRef = this.dialog.open(OemgrouppopupComponent, {
    width: '700px',
    data: {}
  });

  // dialogRef.afterClosed().subscribe(result => {
  //   //const resp = JSON.parse(`${result}`);
  //   //console.log('Dialog result:', resp);
  //   if (result != undefined)
  //     this.groupcontact.push(result);
  //     console.log('groupcontact', this.groupcontact);
  // });
}

}