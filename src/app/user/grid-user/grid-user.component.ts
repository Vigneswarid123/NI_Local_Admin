import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../_services/api.service';
import { AlertifyService } from '../../_services/alertify.service';

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-grid-user',
  templateUrl: './grid-user.component.html',
  styleUrls: ['./grid-user.component.scss']
})
export class GridUserComponent implements OnInit {
  
  users = [];

  public Brands: any = [];

  brandForm: FormGroup;
  submitted = false;
  addclick = false;
  showgrid = false;

  // selectedFile: string | ArrayBuffer =
  //   "https://bulma.io/images/placeholders/480x480.png";

  selectedFile: any = null;
  file: File;

  fileName: string = "";
  ImageFolder = "http://localapi.throttle.com/api/resources/images/";


  EditView = false;
  AddView = false;
  BrandId = 0;

  fileData: File = null;

  constructor(private fB: FormBuilder, private userSrvc: ApiService, private alertify: AlertifyService, private sanitizer: DomSanitizer) {
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
      file: ['']
    });
  }

  ngOnInit(): void {
    this.showUsers();
  }
  showUsers(): any {
    const obj = {
      "User_Id": 0
    };

    // console.log(obj);

    this.userSrvc.getUsers(obj).subscribe((res: any) => {
      if (res.status === 200) {
        const user = res.response;

        if (user) {
          this.users = res.response;
          // this.users = this.users.filter(usr => usr.Status === 'Y');

          console.log(user);
        }
      }
      else {
        this.alertify.error(res.message);
      }
    });
  }

  
  processFile(element: any) {
    this.fileData = <File>element.target.files[0];
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

  GetBrandsList() {

    const obj = { "brand_id": 0 };
    this.userSrvc.GetBrands(obj).subscribe(
      (response: any) => {
        if (response.message == "success") {
          this.Brands = response;
          console.log(this.Brands.response)
        }
        //this.BrandContant=this.Brands.response[0].brand_id.toString();
      });
  }
  OnSubmit() {
    this.submitted = true;
    if (this.brandForm.invalid) {
      return
    }
    const formdata: any = new FormData();
    let brid = 0;

    if (this.BrandId != 0)
      brid = this.BrandId;

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
      status: "Y"
    };
    if (this.selectedFile && brid == 0) {
      formdata.append('data', JSON.stringify(obj));

      formdata.append('file', this.file, this.fileName);
    }
    console.log(obj)
    if (brid == 0) {
      this.userSrvc.postmethod('brands', formdata).subscribe((response: any) => {
        console.log(response);
        if (response.status == 200) {
          this.addclick = false;
          this.showgrid = true;
          this.GetBrandsList();
        }
      },

        //},
        (error) => {
          console.log(error);
        });
    }
    else {
      const obj1 = {
        Brand_Id: brid,
        ChromeId: this.brandForm.value.chromeid,
        BrandName: this.brandForm.value.brandname,
        BrandLogo: this.brandForm.value.file,
        BrandUrl: this.brandForm.value.brandurl,
        Description: this.brandForm.value.branddesc,
        Logohoghlights: this.brandForm.value.logohighlights,
        Acronym: this.brandForm.value.brandacronym,
        BackGroundColor: this.brandForm.value.backgroundcolor,
        RecallUrl: this.brandForm.value.recallurl,
        status: "Y"
      };
      this.userSrvc.putmethod('brands', obj1).subscribe((response: any) => {
        console.log(response);
        if (response.status == 200) {
          this.addclick = false;
          this.showgrid = true;
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
  editBrand(brid) {
    //const file1="";
    this.EditView = true;
    this.BrandId = brid;
    this.Brands = [];
    const obj = { 'brand_id': brid };
    this.userSrvc.GetBrands(obj).subscribe((response: any) => {
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
        // const reader = new FileReader();
        // const file1=response.response[0].brand_logo;
        // reader.readAsDataURL(file1);
        // reader.onload = () => {
        //   this.selectedFile = reader.result;
        // }
        let objectURL = 'data:image/png;base64,' + response.response[0].brand_logo;
        this.selectedFile = this.sanitizer.bypassSecurityTrustUrl(objectURL);

      }
    });
  }
}
