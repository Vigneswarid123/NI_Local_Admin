import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss'],

})
export class BrandListComponent implements OnInit {

  public Brands: any = [];

  brandForm: FormGroup;
  submitted = false;
  addclick = false;
  showgrid = false;
  SearchBrandForm: FormGroup;


  hide: boolean = false;
  alphaSrch: string = '';
  atozFltr: boolean = false;
  BrandInfo: any = [];
  alphaColumns: any = ["brand_name"];
  // selectedFile: string | ArrayBuffer =
  //   "https://bulma.io/images/placeholders/480x480.png";

  selectedFile: any = null;
  file: File;

  fileName: string = "";
  ImageFolder = "http://devadmin.netimpact.com/assets/Images/BrandLogo/";


  EditView = false;
  AddView = false;
  BrandId = 0;



  fileData: File = null;

  constructor(private fB: FormBuilder, private ApiService: ApiService, private sanitizer: DomSanitizer, private router: Router,
    private SpinnerService: NgxSpinnerService) {
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
      Brand_category: ['']
    });

    this.SearchBrandForm = this.fB.group({
      txtSearch: ""
    });

  }

  ngOnInit(): void {
    this.router.navigateByUrl('Brands');
    this.GetBrandsList();
    this.alphaSrch = "";

  }


  // processFile(file:File){
  //   if (file) {
  //       this.AddView = true;
  //   this.EditView = false;
  //     this.fileName = file.name;
  //     this.file = file;

  //     const reader = new FileReader();

  //     reader.readAsDataURL(file);
  //     reader.onload = event => {
  //       this.selectedFile = reader.result as string;
  //     };

  //   }
  // }
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

  brndTempData: any = [];
  GetBrandsList() {
    this.BrandInfo = [];
    this.alphaSrch = "";
    this.SpinnerService.show();
    const obj = { "brand_id": 0 };
    this.ApiService.GetBrands(obj).subscribe(
      (resp: any) => {
        if (resp.message == "success") {
          this.Brands = resp;
          this.SpinnerService.hide();

          this.BrandInfo = resp.response;
          this.brndTempData = this.BrandInfo;
          console.log("data" + this.BrandInfo)
        }
        // this.BrandContant=this.Brands.response[0].brand_id.toString();
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
      status: "Y",
      Brand_category: this.brandForm.value.Brand_category
    };
    if (this.selectedFile && brid == 0) {
      formdata.append('data', JSON.stringify(obj));

      formdata.append('file', this.file, this.fileName);
    }
    console.log(obj)
    if (brid == 0) {
      this.ApiService.postmethod('brands', formdata).subscribe((response: any) => {
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
        status: "Y",
        category: this.brandForm.value.Brand_category
      };

      formdata.append('data', JSON.stringify(obj1));
      if (this.fileName != '')
        formdata.append('file', this.fileName);
      else
        formdata.append('file', this.selectedFile);
      this.ApiService.putmethod('brands', formdata).subscribe((response: any) => {
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
    this.selectedFile = '';

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
      Brand_category: ['']
    });

  }
  showGridPanel() {
    this.showgrid = true;
    this.addclick = false;
    this.GetBrandsList();
  }

  onAlphaCatch(alphabet) {
    this.hide = true;
    this.atozFltr = true;
    this.alphaSrch = alphabet;
    this.BrandInfo = this.brndTempData;
    console.log(this.alphaSrch);
  }

  onSearch() {

    this.alphaSrch = this.SearchBrandForm.controls['txtSearch'].value;
    console.log(this.alphaSrch);
    this.BrandInfo = this.brndTempData;

  }

  atoZClick() {
    if (!this.atozFltr)
      this.atozFltr = true;
    else
      this.atozFltr = false;
  }

  editBrand(brid) {
    //const file1="";
    this.EditView = true;
    this.BrandId = brid;
    this.Brands = [];
    const obj = { 'brand_id': brid };
    this.ApiService.GetBrands(obj).subscribe((response: any) => {
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
          file: response.response[0].brand_logo,
          Brand_category: response.response[0].brand_category
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
