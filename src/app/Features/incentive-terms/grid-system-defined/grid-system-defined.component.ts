import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Core/_providers/api-service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid-system-defined',
  templateUrl: './grid-system-defined.component.html',
  styleUrls: ['./grid-system-defined.component.scss']
})
export class GridSystemDefinedComponent implements OnInit {

  incentiveTermsArray = [];
  Id: number;
  ID: number;
  term: any = [];
  SearchText: any;

  constructor(
    private termSrvc: ApiService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.incentiveTermsList();
  }


  incentiveTermsList(){
    const obj = {
      Id: 0
    };
    this.termSrvc.showIncentiveTerms(obj).subscribe((res: any) => {
    if (res.status === 200) {
      const terms = res.response;
      if (terms) {
        this.incentiveTermsArray = res.response;
        console.log(terms);
      }
}
  });
}

  Action(value) {
    this.term.push(value);
    console.log('Id' + this.term[0].Id);
    this.ID = this.term[0].Id;
    console.log(this.ID);
    this.router.navigate(['incentiveTermsEdit'], { queryParams: { Id: this.ID} });
    }


}
