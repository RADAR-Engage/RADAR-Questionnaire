import {Component, OnDestroy, OnInit} from '@angular/core'
import { NavController } from 'ionic-angular'
import {StorageService} from "../../../core/services/storage/storage.service";
import {LogService} from "../../../core/services/misc/log.service";
import {UsageService} from "../../../core/services/usage/usage.service";
import {ProgressReportService} from "../services/progress-report.service";
import {ProgressReportConfigService} from "../services/progress-report-config.service";

@Component({
  selector: 'page-progress-report',
  templateUrl: 'progress-report-page.component.html'
})
export class ProgressReportPageComponent implements OnInit, OnDestroy{

  chartTasks: any
  progressReportDescription: string
  loading = true

  constructor(public navCtrl: NavController,
              private storageService: StorageService,
              private progressService: ProgressReportService,
              private progressConfigService: ProgressReportConfigService,
              private logger: LogService,
              private usage: UsageService,
  ) {}

  ngOnInit(){
    console.log(this.constructor.name)
    this.usage.setPage(this.constructor.name)
    Promise.all([
      this.progressConfigService.getProgressReportDescription(),
      this.progressService.getChartTasks()
    ]).then(([description, data]) => {
      console.log(data)
      this.progressReportDescription = description.replace("\\n", "\n")
      this.chartTasks = data
      this.loading = false
    }).catch(error => {
      // better to show empty page with error message or alert or dialog and let user to navigate to home page
      throw this.logger.error('Failed to fetch Firebase config', error)
    })
  }

  ngOnDestroy() {
    console.log("destroyed")
  }

  ionViewDidLoad() {}

  ionViewDidEnter() {}


}
