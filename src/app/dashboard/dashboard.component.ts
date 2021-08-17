import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    public dashboardService: DashboardService
  ) {
  }

  ngOnInit() {
    this.dashboardService.updateQuestions();
  }

}
