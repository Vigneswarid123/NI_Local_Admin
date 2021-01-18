import { Component, Renderer2, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormControl} from '@angular/forms';
import { ApiService } from "../../Core/_providers/api-service/api.service";
import { DomSanitizer } from '@angular/platform-browser';
//import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactComponent } from '../contact/contact.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {BrandpopupComponent} from '../brandpopup/brandpopup.component';


@Component({
  selector: 'app-oemgroups',
  templateUrl: './oemgroups.component.html',
  styleUrls: ['./oemgroups.component.scss']
})


export class OemgroupsComponent implements OnInit {

  groupForm: FormGroup;
  submitted = false;
  addclick = false;
  showgrid = false;

  selectedFile:any=null;
  file: File;

  fileName: string = "";
  ImageFolder="http://nidevapi.azaz.com/api/resources/images/";

  EditView = false;
  AddView = false;
  oemid=0;

  fileData: File = null;
  oemgroups: any;
  
  Brands: any=[];
  showBrandDiv:boolean=false;

  

  myControl: FormControl = new FormControl();
  selectedBrands: any=[];
  selectedbrandid: any=[];
  selectedBrandsList:any=[];

  //@ViewChild('groupbrand', { static: false }) toggleButton: ElementRef;
  @ViewChild('menu', { static: false }) menu: ElementRef;
  selectedItem: any;
  noGroup: boolean;
  txtsearch: any='';
  ShowBrand: boolean=false;
  //brandpopupForm: FormGroup;
  groupcontact: any = [];
  statesData: any=[];

  phoneFormat: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  EditCheck: boolean;
  editStatus: string;

  constructor(private fB: FormBuilder, private ApiService: ApiService,private sanitizer: DomSanitizer,private renderer: Renderer2, public dialog: MatDialog) {

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
    this.groupForm = this.fB.group({
      groupname: ['', [Validators.required, Validators.maxLength(51)]],
      groupbrands:['',Validators.required],
      file: ['',Validators.required],
      address1 :[''],
      address2 :[''],
      city:[''],
      state : [''],
      country:[''],
      zip:[''],
      phone :[''],


    });
    // this.brandpopupForm = this.fB.group({
    //    brandname:[''],
    //    branddesc:[''],
    //    brandurl:[''],
    //    file : ['']
    // });
   }
   

  ngOnInit(): void {
    this.GetOEMGroups();
    this.getStates();
  }
  
  processFile(event){
    if(this.EditView==true){
    this.selectedFile='';
    this.EditView=false;
    }
    // this.groupForm=this.fB.group({
    //   file:''
    // });
    
    // this.fileData= <File>element.target.files[0];
    // this.preview();
     //this.fileData= <File>element.target.files[0];
     this.selectedFile="";
     this.fileName = event.target.files[0];
     //this.file = file;
    // if(this.oemid ==0)
      this.AddView = true;
     


var reader = new FileReader();      
reader.readAsDataURL(event.target.files[0]); 
reader.onload = (event) => { 
  this.selectedFile = reader.result;
}
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

  getSearchData(e){
  
    this.GetOEMGroups()

  }

  GetOEMGroups(){
    this.oemgroups=[];
    let expression='';
    if(this.txtsearch !="")
    expression = " OEM_Name like '%"+this.txtsearch+"%'";
    const obj = { "Id": 0,expression :expression };
    this.ApiService.GetOEMGroupsList(obj).subscribe((response:any)=>{
         console.log(response.response)
         if(response.status==200){
           if(response.response.length !=0)
           this.oemgroups=response.response;
           else
            this.noGroup=true;
         }
         
    })
  }
  showAddPanel() {
    this.addclick = true;
    this.showgrid = false;
    this.AddView = true;
    this.EditView=false;
    this.EditCheck=false;
    this.GetBrandsList();
    this.selectedFile='';
    this.groupForm = this.fB.group({
       groupname:['',Validators.required],
       file:['',Validators.required],

    });
  
    this.selectedBrandsList=[];
    this.selectedbrandid=[];
    this.selectedFile='';
    this.oemid=0;
    this.groupcontact=[];
  }

  filter(val: string): string[] {
    return this.Brands.filter(option =>
      option.brand_name.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  getPosts(val){
    console.log(val)
  }

  editGroup(gid){
    this.groupcontact=[];
    this.EditView = true;
    this.AddView=false;
    this.oemid=gid;
    this.oemgroups = [];
    this.selectedBrandsList=[];
    this.selectedbrandid=[];
    this.EditCheck=true;

    this.groupForm.patchValue({
      groupname: '',
      //groupbrands: response.response[0].brandnames,
      
      file:'',
    });
    
    const obj = { "Id": gid,"expression":"" };
    this.ApiService.GetOEMGroupsList(obj).subscribe((response: any) => {
      console.log(response)
      if (response.status == 200) {
        this.addclick = true;
        this.showgrid = false;
        // this.groupForm.patchValue({
        //   groupname: response.response[0].OEM_Name,
        //   //groupbrands: response.response[0].brandnames,
          
        //   //file: response.response[0].OEM_Logo
        // });
        this.groupForm = this.fB.group({
          groupname:[response.response[0].OEM_Name,Validators.required],
          status: response.response[0].OEM_Status,
          address1 : response.response[0].OEM_Address1,
          address2 : response.response[0].OEM_Address2,
          city : response.response[0].OEM_City,
          state : response.response[0].OEM_State,
          country : response.response[0].OEM_Country,
          zip : response.response[0].OEM_Zip,
          phone : response.response[0].OEM_Phone,

          //file:[response.response[0].OEM_Logo]
       });
       this.editStatus = response.response[0].OEM_Status;
       if(response.response[0].contactdetails!=null)
          this.groupcontact = JSON.parse(response.response[0].contactdetails);
          else
          this.groupcontact = []
       if(response.response[0].OEM_Status == 'Y')
          this.groupForm.value.status = true;
        else
        this.groupForm.patchValue({status: false});
        // let objectURL = 'data:image/png;base64,' + response.response[0].OEM_Logo;
        // this.selectedFile = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.selectedFile=response.response[0].OEM_Logo;
        if(response.response[0].brandnames.length > 0){
          let result= response.response[0].brandnames.split(',');
          for(let y in result){
            
          this.selectedBrandsList.push({brand_id:result[y].split('_')[0],brand_name:result[y].split('_')[1]});
          this.selectedbrandid.push(result[y].split('_')[0]);
          }
        }
        else
           this.selectedBrands = response.response[0].brandnames
        // if(response.response[0].oem_brands.length > 0)   
        //   this.selectedbrandid=response.response[0].oem_brands.split(',');
        // else
        // this.selectedbrandid=response.response[0].oem_brands;  
        this.GetBrandsList();
        
        console.log(this.selectedbrandid)
      }
    });
  }

  selectItem(event:Event,item,index){
         event.stopPropagation();
         if(this.selectedbrandid == "")
            this.selectedbrandid=[];
       if(item!=''){
        //  this.selectedBrands.push(itemval);
          this.selectedbrandid.push(item.brand_id);
         this.selectedBrandsList.push({brand_id:item.brand_id,brand_name:item.brand_name});
         this.selectedItem=item;
       
       if(this.selectedBrandsList.length>0)
        //this.selectedBrands=this.selectedBrands+',';
        this.selectedBrandsList.join(",")
        //if(this.selectedbrandid.length>0)
        //this.selectedbrandid=this.selectedbrandid+',';
        //this.selectedbrandid.join(',')
        //const index=this.Brands.indexOf(itemval);
        //this.Brands.splice(index,1);
        this.Brands = this.Brands.filter(x => x.brand_id != item.brand_id);
        this.showBrandDiv=false;
        this.groupForm.patchValue({
          groupbrands:''});
        }
       console.log(this.selectedBrandsList) 
       console.log(this.selectedbrandid)    
  }

  highlightRow(option){
    this.selectedItem = option.brand_name;
  }
  GetBrandsList() {
    this.Brands=[];
    const obj = { "brand_id": 0 };
    this.ApiService.GetOemBrands(obj).subscribe(
      (response: any) => {
        if (response.message == "success") {
          this.Brands = response.response;
          if(this.selectedbrandid !=''){
            if(this.selectedbrandid.length >0){
              for(let i=0;i<this.selectedbrandid.length;i++){
                //this.Brands.splice(this.selectedbrandid[i],1);
                this.Brands = this.Brands.filter(item => item.brand_id != this.selectedbrandid[i])
              }
           }
          }
          console.log(this.Brands)
        }
       
      });
  }
  showGridPanel() {
    this.showgrid = true;
    this.addclick = false;
    this.GetOEMGroups();
  }

  OnChangeEvent(e){
  
     this.selectedBrands=this.filter(e.target.value.toLowerCase())
     this.showBrandDiv=true;
     
  }
  closeDiv(){
    this.showBrandDiv=false;
  }

  getStates(){
    this.ApiService.getStates('states?185').subscribe((res:any)=>{
     if(res.status = 200)
       this.statesData=res.response;

    });
  }

  OnSubmit(){
    this.submitted = true;
    if (this.groupForm.invalid) {
      return
    }
    if(this.selectedbrandid.length == 0)
     return false;
    const formdata:any = new FormData();
    let groupid=0;
   
    if(this.oemid!=0)
    groupid=this.oemid;
    if(this.oemid == 0){   
    const obj = {
      oemid: groupid,
     
      oemname: this.groupForm.value.groupname,
      oembrands : this.selectedbrandid.join(','),
      oemaddress1 : this.groupForm.value.address1,
      oemaddress2 : this.groupForm.value.address2,
      oemcit:this.groupForm.value.city,
      oemstate : this.groupForm.value.state,
      oemcountry : this.groupForm.value.country,
      oemzip : this.groupForm.value.zip,
      oemphone : this.groupForm.value.phone,
      oemcontact : this.groupcontact,
    
      oemstatus: "Y"
    };
   // if (this.selectedFile && groupid == 0){
    formdata.append('data', JSON.stringify(obj));
   
      //formdata.append('file', this.file,this.fileName);
      formdata.append('file', this.fileName);
   // }
      //console.log(obj)
    
      this.ApiService.postmethod('OEMGroups',formdata).subscribe((response:any)=>{
        console.log(response);
        if(response.status == 200){
          this.addclick=false;
          this.showgrid=true;
          this.GetOEMGroups();
        }
      },
      
    //},
     (error) => {
      console.log(error);
    });
  }
  else{
    //let editstatus='N';
    // if(this.groupForm.value.status == "Y" || this.groupForm.value.status == "true")
    // editstatus = 'Y';
    const obj1 = {
      oemid: groupid,
     
      oemname: this.groupForm.value.groupname,
      oembrands : this.selectedbrandid.join(','),
      oemlogo:this.selectedFile,
      oemaddress1 : this.groupForm.value.address1,
      oemaddress2 : this.groupForm.value.address2,
      oemcit:this.groupForm.value.city,
      oemstate : this.groupForm.value.state,
      oemcountry : this.groupForm.value.country,
      oemzip : this.groupForm.value.zip,
      oemphone : this.groupForm.value.phone,
      oemcontact : this.groupcontact,
      oemstatus: this.editStatus
    };
   
      formdata.append('data', JSON.stringify(obj1));
     if(this.fileName !='')
       formdata.append('file', this.fileName);
     else   
         formdata.append('file', this.selectedFile);
    //   }
    this.ApiService.putmethod('OEMGroups',formdata).subscribe((response:any)=>{
      console.log(response);
      if(response.status == 200){
        this.addclick=false;
        this.showgrid=true;
        this.GetOEMGroups();
      }
    },
    
  //},
   (error) => {
    console.log(error);
  });
  }
  }
  onChange(e){
    //console.log(e)
    if(e.target.checked== true)
     this.editStatus = 'Y';
    else
      this.editStatus = 'N' ;
  }
  removeBrandTag(item,index,id){
    this.Brands.push({brand_id:id,brand_name:item});
  
    this.selectedBrandsList.splice(index,1);
    this.selectedbrandid.splice(index,1)

  }

  deleteGroup(id){
    const obj = { "oemid": id};
    this.ApiService.deleteOEMGroup(obj).subscribe((res:any)=>{
       if(res.status == 200){
         alert("OEM Group deleted successfully");
         this.GetOEMGroups();
       }
    });
  }
  onkeyPress(event:any){
    const pattern = /[0-9+( )-]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
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
    });
  }
  showBrandPopup(){
    const dialogRef = this.dialog.open(BrandpopupComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      const resp = JSON.parse(`${result}`);
      this.GetBrandsList();
      console.log('Dialog result:', resp);
    });
  }

}
