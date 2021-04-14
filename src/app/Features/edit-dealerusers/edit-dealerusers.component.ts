
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServiceService } from '../../Core/_providers/admin-service/admin-service.service';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DealeruserchangepwdpopupComponent } from '../dealeruserchangepwdpopup/dealeruserchangepwdpopup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';


// import * as moment from 'moment/moment';
// import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-edit-dealerusers',
  templateUrl: './edit-dealerusers.component.html',
  styleUrls: ['./edit-dealerusers.component.scss']
})
export class EditDealerusersComponent implements OnInit {
  public globalResponse: any = [];
  dshipForm: FormGroup;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  uploadedFileName: any;
  submitted = false;
  Du_Id: number;
  chkstatus: false;
  login: string;
  fname: string;
  lname: string;
  job: string;
  city: string;
  address1: string;
  address2: string;
  dealergender: string;
  phone: number;
  selecteimage = false;
  public dealerUsersArry: any = [];
  gender: Array<any> = [];
  public image: any = '';
  public proimg: any = '';
  public showimg = true;
  public showchangeimg = false;
  public selectedFile: any = null;
  public imageChangedEvent: any = '';
  public dealerNames: any = [];
  du_status: string;


  rolesArray: any = [];
  now = new Date();
  dateofbirth: any;
  dateofjoining: any;
  croppedimage: any = '';
  imagebinding = `${environment.apiUrl}`+'/resources/Images/';
  updatedimage: any;
  defaultPassword: any;

  jdate: any;
  doj: any;

  constructor(private fB: FormBuilder, private adminService: AdminServiceService, private Api: ApiService, private router: Router,
    public datepipe: DatePipe,
    private SpinnerService: NgxSpinnerService, private route: ActivatedRoute, private alertify: AlertifyService, public dialog: MatDialog, ) {
    this.route.queryParams.subscribe(params => {
      this.Du_Id = params.Du_Id;
      console.log(this.Du_Id);
    });


    this.gender = [


      { "value": "F", "group": "Female" },
      { "value": "M", "group": "Male" },


    ]
    // this.jdate = new Date().toISOString().split('T')[0];
  }
  get f() { return this.dshipForm.controls; }
  ngOnInit() {
    this.bindGrid();
    this.rolesList();
    this.getstates();
    this.getAllDealerShips();
    //  this.getDealerNames();
    this.dshipForm = this.fB.group({
      FirstName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*')]],
      LastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*')]],
      DateofJoining: [''],
      JobTitle: [''],
      Dob: [''],
      Address2: [''],
      Gender: ['', Validators.required],
      Address1: [''],
      loginId: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')]],
      Password: [''],
      City: [''],
      State: [''],
      Zip: [''],
      Phone: [''],
      fileUpload: [''],
      Role: ['', Validators.required],
      dealeruser: ['', Validators.required],
      // avatar: [null],
      status: ['']
    });
    //   this.today ='12/02/2001';
    console.log(this.dealerUsersArry);
  }

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
    this.selecteimage = true;
    this.image = '';
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

  getAllDealerShips() {
    const obj = {
      "DealerShipId": 0,
      "expression": ""
    }
    this.Api.postmethod('dealerships/alldealerships', obj).subscribe(res => {
      console.log(res);
      if (res.status == 200) {
        this.dealerNames = res.response;
        console.log(this.dealerNames);
      }
    });
    this.SpinnerService.hide();
  }

  showAddPanel() {

    //this.getstates();
    //  this.getDealerNames();
  }
  Cancel() {

    this.dshipForm.reset();
    this.dshipForm.markAsUntouched();
    this.dshipForm.markAsPristine();
    this.router.navigate(['dealerusers']);
  }

  getstates() {
    this.adminService.get('states?185').subscribe(
      response => {
        // console.log('Getstates', response.response);
        this.getstates = response.response;
      });
  }
  // dealerUsersArry:any=[];

  bindGrid() {
    this.SpinnerService.show();
    let obj = {
      "id": this.Du_Id,
      "DealerId": "",
      "expression": ""
    }

    this.Api.postmethod('dealeruser/get', obj).subscribe(res => {
      if (res.status == 200) {
        this.globalResponse = res.response;
        this.dealerUsersArry = this.globalResponse[0];
        console.log(this.dealerUsersArry)
        this.login = this.dealerUsersArry.Du_Login_Id.replace(/\s/g, '');
        this.fname = this.dealerUsersArry.Du_First_Name.replace(/\s/g, '');
        this.lname = this.dealerUsersArry.Du_Last_Name.replace(/\s/g, '');
        this.city = this.dealerUsersArry.Du_City.replace(/\s/g, '');
        this.address1 = this.dealerUsersArry.Du_address1.replace(/\s/g, '');
        this.address2 = this.dealerUsersArry.Du_address2.replace(/\s/g, '');
        this.dealergender = this.dealerUsersArry.Du_Gender.replace(/\s/g, '');
        this.phone = this.dealerUsersArry.Du_Phone.replace(/\s/g, '');
        this.job = this.dealerUsersArry.Du_Job_Title.replace(/\s/g, '');
        this.dateofbirth = this.datepipe.transform(this.dealerUsersArry.Du_date_Of_Birth, 'yyyy-MM-dd');
        this.jdate = this.datepipe.transform(this.dealerUsersArry.Du_Date_Of_Joining, 'yyyy-MM-dd');
        this.du_status = this.dealerUsersArry.Du_Status;
        this.croppedimage = this.dealerUsersArry.Du_Image;
        this.image = this.imagebinding + this.croppedimage;
        this.SpinnerService.hide();

      }
    });
  }

  rolesList() {
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
  // getDealerNames() {
  //   const dealergroupObj = {
  //     "dealergroupid": 0,
  //     "expression": "dg_status = 'Y'"
  //   };

  //   this.Api.GetDealershipGroupsData(dealergroupObj).subscribe((resp: any) => {
  //     console.log('Get groups Resp', resp);
  //     console.log(resp)
  //     if (resp.status == 200) {
  //       this.dealerNames = JSON.parse(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
  //       // console.log('DealerGroups', this.dealerNames);
  //       console.log(resp)
  //     }
  //   });
  // }
  removeimg() {
    console.log(this.uploadedFileName);
    this.previewUrl = '';
    this.selecteimage = false;
    this.proimg = '';
  }
  onSubmit() {
    console.log('hello');
    this.submitted = true;
    if (this.dshipForm.invalid) {
      console.log('hello203');
      console.log(this.dshipForm.value)
      return;
    }
    const fd: any = new FormData();
    // if (this.croppedimage== null || this.croppedimage == '') {
    // console.log('this.uploadedFileName',this.croppedimage);
    // fd.append('file', this.uploadedFileName);
    // console.log(this.uploadedFileName);
    // } else {
    // console.log(this.croppedimage)
    // fd.append('file', this.croppedimage);
    // }
    if (this.uploadedFileName != null && this.uploadedFileName != undefined) {
      console.log(this.uploadedFileName)
      this.updatedimage = null
      fd.append('file', this.uploadedFileName);
    }
    else {
      this.updatedimage = this.croppedimage;
      console.log(this.updatedimage)
      fd.append('file', null);
      console.log(this.croppedimage);
    }

    const obj = {
      Id: this.Du_Id,
      F_Name: this.dshipForm.value.FirstName,
      L_Name: this.dshipForm.value.LastName,
      Dealer_id: this.dshipForm.value.dealeruser,
      Gender: this.dshipForm.value.Gender,
      JoinDate: this.dshipForm.value.DateofJoining,
      Job_title: this.dshipForm.value.JobTitle,
      Dob: this.dshipForm.value.Dob,
      Address1: this.dshipForm.value.Address1,
      Address2: this.dshipForm.value.Address2,
      login_id: this.dshipForm.value.loginId,
      Password: this.dshipForm.value.Password,
      City: this.dshipForm.value.City,
      State: this.dshipForm.value.State,
      Zip: this.dshipForm.value.Zip,
      Phone: this.dshipForm.value.Phone,
      Role: this.dshipForm.value.Role,
      Image: this.updatedimage,
      Status: this.dshipForm.value.status,
      Userenable: 'N'
    };

    console.log(this.croppedimage)
    fd.append('data', JSON.stringify(obj));
    console.log('Final Obj', obj);
    fd.append('file', this.dealerUsersArry.Du_Image);
    fd.append('file', '');
    const options = { content: fd };
    this.adminService.Putmethod('dealeruser', fd).subscribe((response: any) => {
      console.log(response);
      if (response.status == 200) {
        this.alertify.success('Dealeruser Updated in succesfully');
        // alert("Record updated successfully");
        console.log(response);
        this.dshipForm.reset();
        this.dshipForm.markAsUntouched();
        this.dshipForm.markAsPristine();
        this.image = '';
        this.router.navigate(['dealerusers']);
        // this.router.navigate(['DealershipList']); 
      }
    },
      (error) => {
        this.alertify.error(error);
      });


  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DealeruserchangepwdpopupComponent, {
      width: '400px',

      data: {}
    });

  }

}
