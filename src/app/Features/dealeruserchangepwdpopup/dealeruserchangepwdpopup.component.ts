import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Core/_providers/api-service/api.service';
import { dealerusersPwdModel } from '../../Core/_models/users';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from '../../Core/_providers/alert-service/alertify.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  AbstractControl,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ValidatorServiceService } from '../../Core/_providers/validator/validator-service.service';


@Component({
  selector: 'app-dealeruserchangepwdpopup',
  templateUrl: './dealeruserchangepwdpopup.component.html',
  styleUrls: ['./dealeruserchangepwdpopup.component.scss']
})
export class DealeruserchangepwdpopupComponent implements OnInit {
  updatePasswordForm: FormGroup;
  Old_pswrd: FormControl;
  New_pswrd: FormControl;
  cnewPassword: FormControl;
  User_Id: number;
  Du_Id: number;
  submitted = false;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<DealeruserchangepwdpopupComponent>,
    private validatorService: ValidatorServiceService,
    private userSrvc: ApiService,
    private alertify: AlertifyService
  ) {
    // this.route.queryParams.subscribe(params => {
    //   this.User_Id = params.User_Id;
    //   console.log('pkpk', this.User_Id);
    // });
    this.route.queryParams.subscribe(params => {
      this.Du_Id = params.Du_Id;
      // console.log('pkp', this.Du_Id);
    });

  }

  ngOnInit(): void {
    this.Old_pswrd = new FormControl('', [Validators.required]);
    this.New_pswrd = new FormControl('', [
      Validators.required,
      Validators.maxLength(15),
      Validators.minLength(4),
      // this.validatorService.MustMatch(this.cnewPassword),
    ]);
    this.cnewPassword = new FormControl('', [
      Validators.required,
      this.validatorService.MustMatch(this.New_pswrd),
    ]);

    this.updatePasswordForm = this.fb.group({
      Old_pswrd: this.Old_pswrd,
      New_pswrd: this.New_pswrd,
      cnewPassword: this.cnewPassword,
    });
  }



  onSubmit(): any {
    {
      this.submitted = true;
      if (this.updatePasswordForm.invalid) {
        return;
      }
    }

    const PwdUpdate = new dealerusersPwdModel(
      this.Du_Id,
      this.updatePasswordForm.controls.Old_pswrd.value,
      this.updatePasswordForm.controls.New_pswrd.value,

    );

    this.userSrvc.updateDealerUserPwd(PwdUpdate).subscribe((res: any) => {
      console.log('res', res);
      if (res.status === 200) {
        this.alertify.success('Password Change Successfully');
        this.dialogRef.close();


      }
      else {
        this.alertify.error('Please check the details');
      }
    });
  }


  closeDialog(): void {
    this.dialogRef.close();
  }
}
