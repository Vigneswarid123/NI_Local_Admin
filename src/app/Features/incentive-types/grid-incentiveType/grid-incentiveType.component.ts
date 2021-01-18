import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid-incentiveType',
  templateUrl: './grid-incentiveType.component.html',
  styleUrls: ['./grid-incentiveType.component.scss']
})
export class GridIncentiveTypeComponent implements OnInit {

  incentiveTypesArray = [];
  incentivetype_id: number;
  ID: number;
  term: any = [];
  SearchText: any;

  constructor(
    private termSrvc: ApiService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.incentiveTypesList();
  }


  incentiveTypesList(){
    const obj = {
      incentivetype_id: "0",
      expression: ""
    };
    this.termSrvc.showIncentiveTypes(obj).subscribe((res: any) => {
    if (res.status === 200) {
      const terms = res.response;
      if (terms) {
        this.incentiveTypesArray = res.response;
        console.log(terms);
      }
}
  });
}

  Action(value) {
    this.term.push(value);
    console.log('Id' + this.term[0].incentivetype_id);
    this.ID = this.term[0].incentivetype_id;
    console.log(this.ID);
    this.router.navigate(['incentiveTypesEdit'], { queryParams: { incentivetype_id: this.ID} });
    }

}

