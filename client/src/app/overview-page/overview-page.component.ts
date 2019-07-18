import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {Observable} from "rxjs";
import {OverviewPage} from "../shared/interfaces";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit, AfterViewInit, OnDestroy {
  tapTarget: MaterialInstance;
  data$: Observable<OverviewPage>;
  yesterday = new Date();

  @ViewChild('tapTarget') tapTargetRef: ElementRef;

  constructor(private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.data$ = this.analyticsService.getOverview();
    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarger(this.tapTargetRef);
  }

  ngOnDestroy(): void {
    this.tapTarget.destroy();
  }

  openInfo() {
    this.tapTarget.open();
  }
}
