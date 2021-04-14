import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import {ContactComponent} from '../../Features/contact/contact.component';
import {OemgrouppopupComponent} from '../../Features/oemgrouppopup/oemgrouppopup.component';

@Component({
  selector: 'app-oembrands',
  templateUrl: './oembrands.component.html',
  styleUrls: ['./oembrands.component.scss']
})
export class OembrandsComponent implements OnInit {

  id: number;
  brand: any = [];
  SearchText: any;
  brandsarray = [];

  hide: boolean = false;
  alphaSrch: string = '';
  atozFltr: boolean = false;
  brandsInfo: any = [];
  alphaColumns: any = ["brand_name"];
  SearchBrandsForm: FormGroup;

  showgrid = false;
  editview = false;
  addview = false;

  addBrandForm: FormGroup;
  submitted = false;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  uploadedFileName: any;

  public globalResponse: any = [];
  editbrandform: FormGroup;
  loading = false;
  brand_id: number;
  BrandDetails: any = [];
  EditableLogo: any;


  constructor(
    private fB: FormBuilder,
    private apisrvc: ApiService,
    private alertify: AlertifyService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2, 
    public dialog: MatDialog,
  ) {
    this.SearchBrandsForm = this.fB.group({
      txtSearch: ""
    });


    this.addBrandForm = this.fB.group({
      brand_name: ['',[Validators.required,Validators.maxLength(50)]],       
      brand_url: ['',[Validators.required,Validators.maxLength(50)]],  
      brand_desc: ['', Validators.required, Validators.maxLength(100)],
      fileUpload: ['', [Validators.required]],
      brand_category: ['', [Validators.required]],
      avatar: [null],
      brand_status: ['Y'],
      brand_logohighlights: [''],
      brand_acronym: [''],
      brand_recall_url: [''],
      chrome_id: [''],
      oemcontact: this.fB.array([]),
      groupbrands: [''],
    });


    this.editbrandform = this.fB.group({
      brand_name: ['', [Validators.required, Validators.maxLength(50)]],
      brand_desc: ['', [Validators.required]],
      brand_chrome_id: ['', [Validators.required, Validators.maxLength(50)]],
      brand_url: ['', [Validators.required, Validators.maxLength(50)]],
      brand_logohighlights: ['', [Validators.required, Validators.maxLength(50)]],
      brand_acronym: ['', [Validators.required, Validators.maxLength(50)]],
      brand_backgroundcolor: ['', [Validators.required]],
      brand_recall_url: ['', [Validators.required, Validators.maxLength(5)]],
      brand_category: [''],
      brand_logo: [''],
      brand_status: [''],
      avatar: [null],
      fileUpload: ['',Validators.required]
    });

    this.renderer.listen('window', 'click',(e:Event)=>{
      //console.log(this.menu.nativeElement.value);
      //if(e.target !== this.menu.nativeElement){
        if(this.menu == undefined){
        this.showBrandDiv=false; 
      }
      else
      this.showBrandDiv=false; 
    });

  }

  ngOnInit(): void {
    this.showgrid = true;
    this.addview = false;
    this.editview = false;
    this.showBrands();
  }


  showBrands(): any {
    this.spinner.show();
    const obj = {
      brand_id: 0,
    };
    this.apisrvc.postmethod('oembrands/get', obj).subscribe((res:any)=>{
      if (res.status === 200) {
        const user = res.response;

        if (user) {
          var k: string | number,
            arr = [];
          let obj = res;
          for (k in obj.response) {
            var item = obj.response[k];
            arr.push({
              brand_id: item.brand_id,
              brand_chrome_id: item.brand_chrome_id,
              brand_name: item.brand_name,
              brand_url: item.brand_url,
              brand_desc: item.brand_desc,
              brand_status: item.brand_status,
              brand_backgroundcolor: item.brand_backgroundcolor,
              brand_category: item.brand_category,
              brand_logo:
              `${environment.apiUrl}`+'/resources/images/' +
                item.brand_logo,
            });
          }
          this.brandsarray = arr;
          this.brandsInfo = arr;
          this.spinner.hide();
        }
      } else {
        this.alertify.error(res.message);
        this.spinner.hide();
      }
    });
  }


  edititem: any = []
  Action(value) {
    this.brand.push(value);
    this.edititem = [];
    this.edititem = value;
    this.brandEditForm();
    console.log('edititem', this.edititem)
    this.showgrid = false;
    this.addview = false;
    this.editview = true;
    console.log('Value', value)
    console.log('id' + this.brand[0].brand_id);
    this.id = this.brand[0].brand_id;
    console.log('brandid', this.id);
  }

  getoemcontacts: any = [];
  brandEditForm() {
    this.spinner.show();
    const obj: any ={​​​​​​​​
      brand_id: this.edititem.brand_id
    }
    console.log('brandid', this.brand_id)​​​​​​​​
this.apisrvc.postmethod('oembrands/get', obj).subscribe((res:any)=>{
  this.getoemcontacts = res.response[0].contactdetails;
  console.log('getoemcontacts', this.getoemcontacts);
  console.log('editbrands', res);
      this.globalResponse = res;
      console.log('edit', res)
      this.EditableLogo = this.globalResponse.response[0].brand_logo;
      this.previewUrl = `${environment.apiUrl}`+'/resources/images/' + this.globalResponse.response[0].brand_logo;
      this.BrandDetails = this.globalResponse.response[0];
      this.spinner.hide();
    });
  }

  get f() {
    return this.addBrandForm.controls;
  }


public processFile(fileInput: any): void {
    this.fileData = <File>fileInput.target.files[0];
    this.uploadedFileName = <File>fileInput.target.files[0].name;
    console.log('file upload', this.uploadedFileName);

    const file = (fileInput.target as HTMLInputElement).files[0];
    this.addBrandForm.patchValue({
      avatar: file,
    });

    this.addBrandForm.get('avatar').updateValueAndValidity();

    this.preview();
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


   // tslint:disable-next-line: typedef
   addBrand() {
    console.log(this.addBrandForm.value)
    this.submitted = true;
    if (this.addBrandForm.invalid) {
      return;
    }
    this.spinner.show();
    const fd: any = new FormData();
    const obj = {
      ChromeId: '',
     // oemgroups: '',
      BrandName: this.addBrandForm.value.brand_name,
      Description: this.addBrandForm.value.brand_desc,
      BrandUrl: this.addBrandForm.value.brand_url,
      BackGroundColor: '',
      Category: this.addBrandForm.value.brand_category,
      Status: 'Y',
      Logohoghlights: '',
      Acronym: '',
      RecallUrl: '',
      oemcontact: this.groupcontact as FormArray,
      brand_logo: ''
    };

    fd.append('data', JSON.stringify(obj));
    if (this.uploadedFileName != '' && this.uploadedFileName != undefined)
    {
      fd.append('file', this.fileData);
    }
    console.log('Final Obj', fd);
    console.log('addobj', obj);
    const options = { content: fd };
    this.apisrvc.postmethod('oembrands', fd).subscribe(
      (resp: any) => {
        if (resp.status == 200) {
          this.spinner.hide();
          this.alertify.success('OEM Brand Added successfully');
          this.showgrid = true;
          this.addview = false;
          this.editview = false;
          this.showBrands();
        } else {
          this.spinner.hide();
          console.log('object',obj)
          this.alertify.error('Please check the details');
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }


  updateBrand(): any {
    // {
    //   this.submitted = true;
    //   if (this.editbrandform.invalid) {
    //     return;
    //   }
    // }
    this.spinner.show();
    const fd: any = new FormData();
    const brandUpdate = {
      "action":"U",
      Brand_Id: this.edititem.brand_id,
      ChromeId: this.editbrandform.value.brand_chrome_id,
      BrandName: this.editbrandform.value.brand_name,
      BrandLogo: this.EditableLogo,
      BrandUrl: this.editbrandform.value.brand_url,
      Status: this.editbrandform.value.brand_status,
      Description: this.editbrandform.value.brand_desc,
      Logohoghlights: '',
      Acronym: '',
      BackGroundColor: this.editbrandform.value.brand_backgroundcolor,
      RecallUrl: '',
      Category: this.editbrandform.value.brand_category,
      oemcontact: this.groupcontact as FormArray
    };
    fd.append('data', JSON.stringify(brandUpdate));
    if (this.uploadedFileName != '' && this.uploadedFileName != undefined)
      fd.append('file', this.fileData);
    else
      fd.append('file', this.EditableLogo);

    this.apisrvc.putmethod('oembrands', fd).subscribe((resp: any) => {
      if (resp.status == 200) {
        this.spinner.hide();
        this.alertify.success('OEM Brand Updated Successfully');
        this.showgrid = true;
        this.addview = false;
        this.editview = false;
        this.showBrands();
      }
      else {
        this.spinner.hide();
        alert('Please check the details');
      }
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      });

  }


  showAddPanel(){
    this.showgrid= false;
    this.addview =true;
    this.editview = false;
    this.EditableLogo = '';
    this.previewUrl= '';
    this.addBrandForm.controls['fileUpload'].setValue(null);
  }

  showGridPanel(){
    this.showgrid= true;
    this.addview = false;
    this.editview = false;
    this.submitted = false;
  }

  onAlphaCatch(alphabet) {
    this.hide = true;
    this.atozFltr = true;
    this.alphaSrch = alphabet;
  }

  onSearch() {
    this.alphaSrch = this.SearchBrandsForm.controls['txtSearch'].value;
  }

  atoZClick() {
    if (!this.atozFltr)
      this.atozFltr = true;
    else
      this.atozFltr = false;
  }


  selectedBrands: any=[];
  showBrandDiv:boolean=false;
  oemgroups: any;
  selectedItem: any;
  selectedOemGroups: any=[];
  selectedgroupid: any=[];
  selectedgroupList: any=[];
  groupcontact: any = [];

  @ViewChild('menu', { static: false }) menu: ElementRef;


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
  this.apisrvc.GetOEMGroupsList(obj).subscribe((response:any)=>{
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

 
 this.oemgroups.splice(index,1);
 this.showBrandDiv=false;
 this.addBrandForm.patchValue({
   groupbrands:''});
   
}

OpenContactPopUp(){
  if(this.groupcontact == null)
    this.groupcontact =[];
  const dialogRef = this.dialog.open(ContactComponent, {
    width: '500px',
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result != undefined)
      this.groupcontact.push(result);
      console.log('groupcontact', this.groupcontact);
      this.GetOEMGroups();
  });
}
showOEMPopup(){
  const dialogRef = this.dialog.open(OemgrouppopupComponent, {
    width: '700px',
    data: {}
  });
}

}
