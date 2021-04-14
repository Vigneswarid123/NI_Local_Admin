import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../Core/_providers/api-service/api.service';;
import { usersModel } from '../../../Core/_models/users';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PwdpopupComponent } from '../../user/pwdpopup/pwdpopup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent implements OnInit {
  rolesArray: any[] = [];
  closeResult: string;
  PopUpPswForm: FormGroup;
  public globalResponse: any = [];
  addUserForm: FormGroup;
  submitted = false;
  loading = false;
  User_Id: number;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  uploadedFileName: any;
  UserDetails: any = [];
  EditableLogo: any;
  phoneFormat: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private modalService: NgbModal,
    // tslint:disable-next-line: max-line-length
    private usersrvc: ApiService, private spinner: NgxSpinnerService, private alertify: AlertifyService, public dialog: MatDialog) {
    this.route.queryParams.subscribe(params => {
      this.User_Id = params.User_Id;
      console.log(this.User_Id);
    });

  }

  ngOnInit(): void {
    this.userEditForm();
    this.addUserForm = this.formBuilder.group({
      User_Firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z# ]*'), Validators.maxLength(50)]],
      User_Lastname: ['', [Validators.required]],
      User_Phone: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(5)]],
      User_Email: ['', [Validators.required, Validators.pattern('[a-zA-Z# ]*'), Validators.maxLength(50)]],
      User_Address: ['', [Validators.required, Validators.pattern('[a-zA-Z# ]*'), Validators.maxLength(50)]],
      User_Mapaddresslink: ['', [Validators.required, Validators.pattern('[a-zA-Z# ]*'), Validators.maxLength(50)]],
      User_Profileimage: ['', [Validators.required]],
      User_Roleid: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(5)]],
      User_IsAdmin: [''],
      User_Type: [''],
      User_Status: [''],
      User_Password: ['', [Validators.required]],
      avatar: [null]
    });

    this.rolesList();
  }

  userEditForm() {
    this.spinner.show();
    this.usersrvc.getUserByID(this.User_Id).subscribe(res => {
      this.globalResponse = res;
      this.EditableLogo = this.globalResponse.response[0].User_Profileimage;
      this.previewUrl = `${environment.apiUrl}`+'/resources/images/' + this.globalResponse.response[0].User_Profileimage;
      this.UserDetails = this.globalResponse.response[0];
      // this.addUserForm = this.formBuilder.group({User_Roleid: this.UserDetails.User_Roleid});
      // this.addUserForm.setValue({User_Roleid: this.UserDetails.User_Roleid});

      this.spinner.hide();

    });
  }

  updateUsers(): any {
    this.spinner.show();
    const fd: any = new FormData();
    const UserUpdate = {
      User_Id: this.User_Id,
      User_Firstname: this.addUserForm.value.User_Firstname,
      User_Lastname: this.addUserForm.value.User_Lastname,
      User_Phone: this.addUserForm.value.User_Phone,
      User_Email: this.addUserForm.value.User_Email,
      User_Address: this.addUserForm.value.User_Address,
      User_Mapaddresslink: this.addUserForm.value.User_Mapaddresslink,
      Password: this.addUserForm.value.User_Password,
      User_Roleid: this.addUserForm.value.User_Roleid,
      User_Profileimage: this.EditableLogo,
      User_IsAdmin: this.addUserForm.value.User_IsAdmin,
      User_Type: this.addUserForm.value.User_Type,
      User_Status: this.addUserForm.value.User_Status,
      User_Created_Userid: 2,
      User_Updated_Userid: 1
    };
    fd.append('data', JSON.stringify(UserUpdate));
    if (this.uploadedFileName != '' && this.uploadedFileName != undefined)
      fd.append('file', this.fileData);
    else
      fd.append('file', this.EditableLogo);

    this.usersrvc.putmethod('users', fd).subscribe((resp: any) => {
      // console.log('Post Resp:', resp);
      //  console.log('res', resp.status);
      if (resp.status == 200) {
        this.spinner.hide();
        this.alertify.success('User Updated Successfully');
        //  alert('user updated successfully');
        this.router.navigate(['adminusers']);
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

  // open(content) {
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }
  openDialog(): void {
    const dialogRef = this.dialog.open(PwdpopupComponent, {
      width: '300px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      const resp = JSON.parse(`${result}`);
      console.log('Dialog result:', resp);
    });
  }


  rolesList() {


    const obj = {
      Role_Id: 0
    };
    this.usersrvc.showRolesData(obj).subscribe((res: any) => {
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
