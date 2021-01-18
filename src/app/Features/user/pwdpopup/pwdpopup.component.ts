import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-pwdpopup',
  templateUrl: './pwdpopup.component.html',
  styleUrls: ['./pwdpopup.component.scss']
})
export class PwdpopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PwdpopupComponent>) { }

  ngOnInit(): void {
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

}
