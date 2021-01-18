
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';
// import { AlertifyService } from '../../_services/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-grid-regions',
  templateUrl: './grid-regions.component.html',
  styleUrls: ['./grid-regions.component.scss']
})
export class GridRegionsComponent implements OnInit {
  SearchText: any;
 regionsArray = [];
  config: any;
  region_id: number;
  id: number;
  region: any = [];

  constructor(
    private regionSrvc: ApiService,
    private router: Router,
    private SpinnerService: NgxSpinnerService
    // private alertify: AlertifyService,
  ) { }

  ngOnInit(): void {
    console.log("hi");
    this.router.navigateByUrl('regions');
    this.regionList();
   
    // pagination
    this.config = {
      itemsPerPage: 10,
      currentPage: 1
    };
  }
  // pagination

  pageChanged(event) {
    this.config.currentPage = event;
  }


  regionList() {
    this.SpinnerService.show();
    const obj = {
      region_id: 0
    };
    this.regionSrvc.showRegionsData(obj).subscribe((res: any) => {
      if (res.status === 200) {
        const roles = res.response;
        console.log(roles);
        if (roles) {
          this.regionsArray = res.response;
          console.log('ra', this.regionsArray);
          this.SpinnerService.hide();

        }
      }
      else {
        // this.alertify.error(res.message);
      }
    });
  }

  Action(value) {
    this.region.push(value);
    console.log('id' + this.region[0].region_iD);
    this.id = this.region[0].region_iD;
    console.log(this.id);
    this.router.navigate(['editregions'], { queryParams: { region_id: this.id } });
  }

}

