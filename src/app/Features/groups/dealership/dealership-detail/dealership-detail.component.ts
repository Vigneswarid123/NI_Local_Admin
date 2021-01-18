import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../Core/_providers/api-service/api.service';
import { AdminServiceService } from '../../../../Core/_providers/admin-service/admin-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dealership-detail',
  templateUrl: './dealership-detail.component.html',
  styleUrls: ['./dealership-detail.component.scss']
})
export class DealershipDetailComponent implements OnInit {
  obj: any = [];
  dealersList:any =[];
  divActive : any = 0;
  ImageFolder="http://niapi.local.com/api/resources/images/";
  dealersDetails: any =[];
  index: string;

  constructor(private authService: ApiService,private router:Router, private Api: AdminServiceService,private _Activatedroute:ActivatedRoute) { 

    //this.gettingDealershipList();

    
  }
  sub:any;
  dealergrpid:any;
  conts: any =[];
  users: any=[];

  ngOnInit(): void {
    this.sub=this._Activatedroute.paramMap.subscribe(params => { 
      console.log('DealerShipGroup',params);
       this.dealergrpid = params.get('dealergrpid'); 
       this.index=params.get('index'); 
   });
   this.gettingDealershipList(this.dealergrpid,this.index);
  }

  Adddealership(){
    this.router.navigate(['AddDealership']);
   }


   //Getting all dealership list
   gettingDealershipList(groupid,index){
    const bd = {
      "dealerid":0,
      "expression":  "dealer_dg_id =" + groupid
    };

    this.authService.dealershipList(bd).subscribe((data:any)=>{
        console.log("Dealser Ship Data :", data);

        if(data.status == 200){
            this.dealersList = JSON.parse(data.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
            console.log("dealersList :", this.dealersList);
            //if(this.divActive == 0){
              
              this.divActive=index;
              this.dealersDetails = this.dealersList[this.divActive];
              console.log("dealersList :", this.dealersList);
           // }
        }
    });
  }
//Getting selected dealership details
dealerDetails(dt,ind){
  this.divActive = ind;
  this.dealersDetails = dt;
  console.log("Details :",dt);
}

}
