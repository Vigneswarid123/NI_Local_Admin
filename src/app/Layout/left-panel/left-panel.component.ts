import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {
  isDealerNavIsActive: boolean = true;
  isSettingNavIsActive: boolean = false;
  isBrandSubNavIsActive: boolean = false;
  isMoedelSubNavIsActive: boolean = false;
  isRoleSubNavIsActive: boolean = false;
  isStyleSubNavIsActive: boolean = false;
  isdealershipIsActive:boolean=false;
  isDealershipIsOpen:boolean=false;
  isOEMGroupSubNavIsActive: boolean = false;
  isInventoryIsActive: boolean = false;
  isAdminUsersIsActive: boolean = false;
  isAdminModulesIsActive: boolean = false;
  isRegionsIsActive: boolean = false;
  isOEMBrandSubNavIsActive: boolean = false;
  isdealerUsersIsActive: boolean = false;
  isincentiveTermsIsActive: boolean = false;

  constructor(private router:Router) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        if (event.url.includes('Brands')) {
          this.resetallActiveNav();
          this.isSettingNavIsActive = true;
          this.isBrandSubNavIsActive = true;
        }
        else if (event.url.includes('Models')) {
          this.resetallActiveNav();
          this.isSettingNavIsActive = true;
          this.isMoedelSubNavIsActive = true;
        }
        else if (event.url.includes('Roles')) {
          this.resetallActiveNav();
          this.isSettingNavIsActive = true;
          this.isRoleSubNavIsActive = true;
        }
        else if (event.url.includes('Styles')) {
          this.resetallActiveNav();
          this.isSettingNavIsActive = true;
          this.isStyleSubNavIsActive = true;
        }
        // else if (event.url.includes('Styles')) {
        //   this.resetallActiveNav();
        //   this.isSettingNavIsActive = true;
        //   this.isStyleSubNavIsActive = true;
        // }
        else if(event.url.includes('OEMGroups')){
          this.resetallActiveNav();
          this.isSettingNavIsActive = true;
          this.isOEMGroupSubNavIsActive = true;
        }
        else if(event.url.includes('inventory')){
          this.resetallActiveNav();
          this.isSettingNavIsActive = true;
          this.isInventoryIsActive = true;
        }
        else if(event.url.includes('users')){
          this.resetallActiveNav();
          this.isSettingNavIsActive = true;
          this.isAdminUsersIsActive = true;
        }
        else if(event.url.includes('regions')){
          this.resetallActiveNav();
          this.isSettingNavIsActive = true;
          this.isRegionsIsActive = true;
        }
        else if(event.url.includes('adminmodules')){
          this.resetallActiveNav();
          this.isSettingNavIsActive = true;
          this.isAdminModulesIsActive = true;
        }
        else if (event.url.includes('AddGroupComponent')) {
          this.resetallActiveNav();
          this.isdealershipIsActive=true;
          this.isDealerNavIsActive = true;
          this. isDealershipIsOpen=true;
        }
        else if(event.url.includes('oembrands')){
          this.resetallActiveNav();
          this.isSettingNavIsActive = true;
          this.isOEMBrandSubNavIsActive = true;
        }
        else if(event.url.includes('dealerusers')){
          this.resetallActiveNav();
          this.isSettingNavIsActive = true;
          this.isdealerUsersIsActive = true;
        }
        else if(event.url.includes('incentiveTerms')){
          this.resetallActiveNav();
          this.isSettingNavIsActive = true;
          this.isincentiveTermsIsActive = true;
        }
      }
    })
  }

  ngOnInit() {
  }
  resetallActiveNav(): void {
    this.isDealerNavIsActive = false;
    this.isSettingNavIsActive = false;
    this.isBrandSubNavIsActive = false;
    this.isMoedelSubNavIsActive = false;
    this.isRoleSubNavIsActive=false;
    this.isStyleSubNavIsActive=false;
    this.isdealershipIsActive=false;
    this. isDealershipIsOpen=false;
    this.isOEMGroupSubNavIsActive = false;
    this.isInventoryIsActive = false;
    this.isAdminUsersIsActive = false;
    this.isAdminModulesIsActive = false;
    this.isRegionsIsActive = false;

    this.isOEMBrandSubNavIsActive = false;
    this.isdealerUsersIsActive = false;
    this.isincentiveTermsIsActive = false;
  }
}