import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-incentivesAccept',
  templateUrl: './incentivesAccept.component.html',
  styleUrls: ['./incentivesAccept.component.scss']
})
export class IncentivesAcceptComponent implements OnInit {

hide: boolean = false;
alphaSrch: string = '';
atozFltr: boolean = false;
IncentiveAcceptInfo: any = [];
alphaColumns: any = ['DEALER_NAME'];
SearchTermsForm: FormGroup;
showdata: any = false;


 constructor(
   private inceSrvc: ApiService,
   private router: Router,
   private fB: FormBuilder,
   private SpinnerService: NgxSpinnerService
   )
   {
     this.SearchTermsForm = this.fB.group({
      txtSearch: ''
    });
   }

 ngOnInit(): void {
  this.showdata = false;
  this.incentivesAcceptList(this.id);
  this.getIncentives(); 
  this.incForm = this.fB.group({
    inc:['', Validators.required],
  },
);
 }

 id: number;
 incentivesAcceptList(id){
  // this.SpinnerService.show();
    const obj = {
      ID: this.selected
    };
  // const obj={ ID: id};
  //  this.inceSrvc.showIncentivesAccept(obj).subscribe((res: any) => {
  this.inceSrvc.postmethod('incentiveaccept/get',obj).subscribe((res:any)=>{
   if (res.status === 200) {
     console.log('Selected Incentive ID:', obj.ID);
     const incentAccept = res.response;
     if (incentAccept) {
       this.IncentiveAcceptInfo = res.response;
       console.log('IncentiveAcceptInfo:', this.IncentiveAcceptInfo);
      // this.filtered = this.IncentiveAcceptInfo;
       this.SpinnerService.hide();
     }
}
 });
}

  onAlphaCatch(alphabet){
    this.hide = true;
    this.atozFltr = true;
    this.alphaSrch = alphabet;
  }

  onSearch(){
    this.alphaSrch = this.SearchTermsForm.controls.txtSearch.value;
  }

  atoZClick(){
    if (!this.atozFltr)
    {
    this.atozFltr = true;
    }
    else
    {
    this.atozFltr = false;
    }
  }

  noincentive = false;
  incentives :any=[]
  
  getIncentives(){
    this.incentives =[];
    const obj={ 'Id' : 0,'expression' : '' }
    this.inceSrvc.postmethod('incentivemaster/get',obj).subscribe((response:any)=>{
      console.log(response);
      if(response.status==200){
        if(response.response.length !=0)
        this.incentives=response.response;
        else
         this.noincentive=true;
      }
    });

  }

  selected:any;
  filtered : any=[];
  incForm: FormGroup;

    onOptionsSelected() {
      if (this.incForm.invalid) {
        alert('Please select an Incentive')
        return;        
      }
      else{
      console.log('dropdownValue:', this.selected); 
      this.filtered = this.IncentiveAcceptInfo.filter(t=>t.INM_ID == this.selected);
      console.log('filtered array:', this.filtered);  
      this.showdata = true; 
      this.incentivesAcceptList(this.selected);
      }      
    }  

      // {
      //   "inm_id": "5",
      //     "dealer_id": "21"
      // }

    public res: any = [];

    onAcceptClick(index: number, INM_ID: string, DEALER_ID: string){
      if (confirm('Are you sure to Accept ?'))
    {
      const obj = {
        inm_id : INM_ID,
        dealer_id : DEALER_ID,
      }      
     this.inceSrvc.postmethod('incentiveaccept', obj).subscribe((response:any)=>{
        this.res = response;
        console.log(response);
        if(this.res.status === 200)
        {
          alert('Record updated successfully');  
          window.location.reload();  
         // this.filtered = this.IncentiveAcceptInfo.filter(t=>t.INM_ID == this.selected);     
          console.log(this.res);  
          // this.filtered[index].AcceptType = 'Accepted'           
        }  
        else{
          alert('Please check the details');
        }
   });
  }
}

}

