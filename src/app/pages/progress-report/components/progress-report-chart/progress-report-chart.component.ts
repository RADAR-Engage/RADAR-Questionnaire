import { Component, Input, OnInit } from '@angular/core'
import * as moment from 'moment'
import { ChartOptions } from '../../models/chart'
import { chart, lineColors, marker, markerColors } from './chart-styles'
import { ProgressReportService } from '../../services/progress-report.service'
import { LocKeys } from '../../../../shared/enums/localisations'
import { LocalizationService } from '../../../../core/services/misc/localization.service'

@Component({
  selector: 'progress-report-chart',
  templateUrl: 'progress-report-chart.component.html'
})
export class ProgressReportChartComponent implements OnInit {
  @Input()
  data: any

  chartData: any
  referenceDate: number
  firstReportAvailableDate: string
  showWaitingForFirstReport: boolean
  showNoResult: boolean = false
  xAxisTitle: string = chart.xAxisTitle

  public chartOptions: Partial<ChartOptions>

  constructor(
    private localization: LocalizationService,
    private progressReport: ProgressReportService
  ) {}

  ngOnInit() {
    const { weeklyData, referenceDate, firstReportAvailableDate } = this.data
    this.showNoResult = !weeklyData
    this.firstReportAvailableDate = this.getFirstReportAvailableText(
      firstReportAvailableDate
    )
    this.showWaitingForFirstReport =
      firstReportAvailableDate > this.progressReport.getCurrentDate().valueOf()
    this.referenceDate = referenceDate
    this.chartData = this.convertWeeklyDataToChartData(weeklyData)
    this.initCharts()
  }

  private convertWeeklyDataToChartData(weeklyData) {
    const output = []
    const data = []
    for (const key in weeklyData) {
      if (weeklyData.hasOwnProperty(key)) {
        const completionPercentage = this.calculateAndRoundCompletionPercentage(
          weeklyData[key]
        )
        data.push({
          x: key,
          y: completionPercentage,
          fillColor: markerColors[completionPercentage]
        })
      }
    }
    output.push({ data: data })
    return output
  }

  protected calculateAndRoundCompletionPercentage(item) {
    let result = null
    if (item.total > 0 && item.total == item.numberOfPassedTasks) {
      result = (100 * item.numberOfCompletedTasks) / item.total
      if (result != 0 && result != 100) {
        result = 50
      }
    }
    return result
  }

  private calculateWidth() {
    if (!this.chartData[0]) {
      return '100%'
    }
    const numberOfItems = this.chartData[0].data.length
    return numberOfItems > chart.xAxisMaxNumberOfItem
      ? (numberOfItems * 100) / chart.xAxisMaxNumberOfItem + '%'
      : '100%'
  }

  private getFirstReportAvailableText(date: number) {
    let result =
      this.localization.translateKey(LocKeys.PROGRESS_REPORT_WAITING) +
      ' ' +
      moment(date).format('MMM DD, YYYY HH:mm')
    const diff = this.progressReport
      .getCurrentDate()
      .startOf('day')
      .diff(moment(date).startOf('day'), 'days')
    if (diff == 0) {
      result =
        this.localization.translateKey(LocKeys.PROGRESS_REPORT_WAITING_TODAY) +
        ' ' +
        moment(date).format('HH:mm')
    } else if (diff == -1) {
      result =
        this.localization.translateKey(
          LocKeys.PROGRESS_REPORT_WAITING_TOMORROW
        ) +
        ' ' +
        moment(date).format('HH:mm')
    }
    return result
  }

  private initCharts() {
    this.chartOptions = {
      series: this.chartData,
      chart: {
        id: 'report-chart',
        type: 'area',
        height: chart.height,
        width: this.calculateWidth(),
        toolbar: {
          show: false
        },
        foreColor: chart.foreColor,
        fontFamily: chart.fontFamily
      },
      colors: lineColors,
      stroke: {
        curve: 'straight'
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: 1
      },
      markers: { ...marker, strokeOpacity: 1 },
      xaxis: {
        type: 'category',
        labels: {
          show: true,
          rotate: -45
        }
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 2,
        labels: {
          show: true,
          rotate: 0,
          minWidth: 40,
          formatter: function (val) {
            return val == 100 ? 'Full' : val == 50 ? 'Half' : ''
          }
        },
        title: {
          text: chart.yAxisTitle
        }
      },
      tooltip: {
        enabled: false
      }
    }
  }
}
