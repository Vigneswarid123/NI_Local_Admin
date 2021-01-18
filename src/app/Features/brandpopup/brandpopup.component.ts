import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-brandpopup',
  templateUrl: './brandpopup.component.html',
  styleUrls: ['./brandpopup.component.scss']
})
export class BrandpopupComponent implements OnInit {

  brandpopupForm :FormGroup; 
  submitted: boolean;
  fileData: File = null;
  selectedFile:any='';
  file: File;
  fileName: string = "";
  oemBrands: any[];
  selectedbrandid: string;

  constructor(private fB: FormBuilder,private ApiService: ApiService,public dialog: MatDialog) {
    this.brandpopupForm = this.fB.group({
      brandname: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
     
      brandurl: [''],
      branddesc: [''],
      file: [''],
     
    });
   }

  ngOnInit(): void {
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
  OnBrandSubmit(){
     
    this.submitted = true;
    if (this.brandpopupForm.invalid) {
      return
    }
    const formdata:any = new FormData();
    let brid=0;

    const obj = {
      Brand_Id: brid,
      ChromeId: 0,
      BrandName: this.brandpopupForm.value.brandname,
      BrandUrl: this.brandpopupForm.value.brandurl,
      Description: this.brandpopupForm.value.branddesc,
      BrandLogo : '',
      Logohoghlights: '',
      Acronym: '',
      BackGroundColor: '',
      RecallUrl: '',
      status: "Y"
    };
    if (this.selectedFile == '' && brid == 0){
      formdata.append('data', JSON.stringify(obj));
     
        formdata.append('file', '');
      }
       else if (this.selectedFile && brid == 0){
        formdata.append('data', JSON.stringify(obj));
       
          formdata.append('file', this.file,this.fileName);
        }
        console.log(obj)
       if(brid == 0){
        this.ApiService.postmethod('oembrands',formdata).subscribe((response:any)=>{
          console.log(response);
          if(response.status == 200){
            this.dialog.closeAll();
            this.getOemBrandsList();
          }
        });
      }

  }
  getOemBrandsList(){
    this.oemBrands=[];
    const obj = { "brand_id": 0 };
    this.ApiService.GetOemBrands(obj).subscribe(
      (response: any) => {
        if (response.message == "success") {
          this.oemBrands = response.response;
          if(this.selectedbrandid !=''){
            if(this.selectedbrandid.length >0){
              for(let i=0;i<this.selectedbrandid.length;i++){
                //this.Brands.splice(this.selectedbrandid[i],1);
                this.oemBrands = this.oemBrands.filter(item => item.brand_id != this.selectedbrandid[i])
              }
           }
          }
          //console.log(this.Brands)
        }
       
      });
  }
  closeBrand(){
    this.dialog.closeAll();
  }

}
