import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
import { AdminServiceService } from 'src/app/_services/admin-service.service';

@Component({
  selector: 'app-dealership-detail',
  templateUrl: './dealership-detail.component.html',
  styleUrls: ['./dealership-detail.component.scss']
})
export class DealershipDetailComponent implements OnInit {
  obj: any = [];
  dealersList:any =[];
  divActive : any = 0;
  
  dealersDetails: any =[];

  constructor(private authService: ApiService,private router:Router, private Api: AdminServiceService) { 

    this.gettingDealershipList();

    
  }

  ngOnInit(): void {
  }

  Adddealership(){
    this.router.navigate(['AddDealership']);
   }


   //Getting all dealership list
   gettingDealershipList(){
    const bd = {
       //"dealerid":0
      "dealerid":0,
      "expression": "dealer_status = 'Y'"
    }  ;
    
  //   this.authService.dealershipList(bd).subscribe((resp: any) => {
  //     console.log('Get groups Resp', resp);
  //     if (resp.status == 200) {
  //       this.dealersDetails = JSON.parse(resp.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);
  //       console.log('DealerGroups', this.dealersDetails);
  //     }
  //   });
  // }

    this.authService.dealershipList(bd).subscribe((data:any)=>{
        console.log("Dealser Ship Data :", data);

        if(data.status == 200){
            this.dealersList = JSON.parse(data.response[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);

            if(this.divActive == 0){
              this.dealersDetails = this.dealersList[this.divActive];
            }
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
