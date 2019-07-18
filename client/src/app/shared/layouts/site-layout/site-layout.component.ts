import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MaterialService} from "../../classes/material.service";

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements  AfterViewInit {

  @ViewChild('floating') floatButtons: ElementRef;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngAfterViewInit(): void {
    MaterialService.initializeFloatingButton(this.floatButtons);

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
