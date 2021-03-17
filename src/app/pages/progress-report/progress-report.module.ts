import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { IonicModule } from 'ionic-angular'

import { PipesModule } from '../../shared/pipes/pipes.module'
import { NgApexchartsModule } from "ng-apexcharts";
import {ProgressReportPageComponent} from "./containers/progress-report-page.component";
import {ProgressReportChartComponent} from "./components/progress-report-chart/progress-report-chart.component";
import {ProgressReportConfigService} from "./services/progress-report-config.service";
import {ProgressReportService} from "./services/progress-report.service";

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    NgApexchartsModule,
    IonicModule.forRoot(ProgressReportPageComponent)
  ],
  declarations: [ProgressReportPageComponent, ProgressReportChartComponent],
  providers: [ProgressReportConfigService, ProgressReportService],
  entryComponents: [ProgressReportPageComponent]
})
export class ProgressReportModule {}
