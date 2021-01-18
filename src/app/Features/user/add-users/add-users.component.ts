import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {
  rolesArray: any[] = [];

  addUserForm: FormGroup;
  submitted = false;
  public globalResponse: any = [];
  fileData: File = null; 
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  uploadedFileName: any;
  // Userid:any;
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute,
              private userSrvc: ApiService, private alertify: AlertifyService, private spinner: NgxSpinnerService) {

    this.addUserForm = this.formBuilder.group({
      User_Firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z# ]*'), Validators.maxLength(50)]],
      User_Lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z# ]*'), Validators.maxLength(5)]],
      User_Phone: ['', [Validators.required]],
      User_Email: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$")]],
      User_Address: ['', Validators.maxLength(1000)],
      User_Mapaddresslink: [''],
      User_Password: ['', [Validators.required]],
      fileUpload: ['', [Validators.required]],
      User_Roleid: ['', [Validators.required]],
      User_IsAdmin: [''],
      User_Type: ['A'],
      avatar: [null]
    });
  }

  get f() { return this.addUserForm.controls; }

  ngOnInit(): void {
    //  this.Userid = sessionStorage.getItem('UserId');
    //  console.log(this.Userid);
    this.rolesList();
  }

  public processFile(fileInput: any): void {
    this.fileData = <File>fileInput.target.files[0];
    this.uploadedFileName = <File>fileInput.target.files[0].name;
    console.log('file upload', this.uploadedFileName);

    const file = (fileInput.target as HTMLInputElement).files[0];
    this.addUserForm.patchValue({
      avatar: file
    });

    this.addUserForm.get('avatar').updateValueAndValidity();

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
  onSubmit() {
    this.submitted = true;
    if (this.addUserForm.invalid) {
      return;
    }
    this.spinner.show();
    const fd: any = new FormData();
    const obj = {
      User_Firstname: this.addUserForm.value.User_Firstname,
      User_Lastname: this.addUserForm.value.User_Lastname,
      User_Phone: this.addUserForm.value.User_Phone,
      User_Email: this.addUserForm.value.User_Email,
      User_Address: this.addUserForm.value.User_Address,
      User_Mapaddresslink: this.addUserForm.value.User_Mapaddresslink,
      Password: this.addUserForm.value.User_Password,
      User_Roleid: this.addUserForm.value.User_Roleid,
      User_Profileimage: "",
      User_IsAdmin: this.addUserForm.value.User_IsAdmin,
      User_Type: this.addUserForm.value.User_Type,
      User_Status: 'Y',
      User_Created_Userid: 2,
      User_Updated_Userid: 1
    };

    fd.append('data', JSON.stringify(obj));
    if (this.uploadedFileName != '' && this.uploadedFileName != undefined)
      fd.append('file', this.fileData);

    console.log('Final Obj', fd);
    const options = { content: fd };
    this.userSrvc.postmethod('users', fd).subscribe((resp: any) => {
      console.log('Post Resp:', resp);
      console.log('res', resp.status);
      if (resp.status == 200) {
        this.spinner.hide();
        this.alertify.success('Record Added successfully');
        this.router.navigate(['users']);
        // alert('data Added Succefully');
      }
      else {
        this.spinner.hide();
        this.alertify.error('Please check the details');
      }
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      });

  }

  allowNumbers(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  rolesList() {


    const obj = {
      Role_Id: 0
    };
    this.userSrvc.showRolesData(obj).subscribe((res: any) => {
      if (res.status === 200) {
        const roles = res.response;
        if (roles) {
          let array: any[] = res.response;
          console.log(roles);
          const res1 = array.filter(f => f.Role_Admin === 'Y');
          console.log('pk', res1);
          this.rolesArray = res1;


        }
      }
    });
  }


}
