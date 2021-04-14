import { Component, OnInit ,Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { AlertifyService } from '../../../Core/_providers/alert-service/alertify.service';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
})
export class ForgotpasswordComponent implements OnInit {
  forgotpwdForm: FormGroup;
  submitted = false;
  //modalTitle: string;
  constructor(
    private apiSrvc: ApiService,

    private fB: FormBuilder,
    private router: Router, private alertify: AlertifyService, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ForgotpasswordComponent>
  ) {
    this.forgotpwdForm = this.fB.group({
      forgotemail: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    console.log(this.data)
   // this.modalTitle = this.data.name; 
  }


  OnSubmit() {
    this.submitted = true;
    if (this.forgotpwdForm.invalid) {
      return
    }
  
       
    const obj = {

      Email: this.forgotpwdForm.value.forgotemail,
      MailStatus: "Y",
      Status: "Y",
      flag:"A"
    };
       console.log(obj)
     
      this.apiSrvc.postmethod('auth/reqpassword',obj).subscribe((response:any)=>{
        if(response.status == 200){
          this.alertify.success("Please check your email for password reset instructions"); 
          this.close(); 
        }
      },
      
     (error) => {
      console.log(error);
    });
   



 }

 
 close(): void {
  this.dialogRef.close();
}

}

