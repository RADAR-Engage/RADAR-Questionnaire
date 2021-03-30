import {Injectable} from "@angular/core"
import * as moment from 'moment'
import {StorageService} from "../../../core/services/storage/storage.service"
import {StorageKeys} from "../../../shared/enums/storage";
import {
  getMockCurrentTime,
  getMockLoginDate,
  getMockReferenceDate,
  getMockTasks
} from "../components/progress-report-chart/mock-tasks";
import {LocalizationService} from "../../../core/services/misc/localization.service";
import {DefaultProgressConfig} from "../../../../assets/data/defaultConfig";

@Injectable()
export class ProgressReportService {
  testMode: boolean = false

  constructor(
    private storageService: StorageService,
    private localizationService: LocalizationService
  ) {
    this.testMode = !!DefaultProgressConfig.test_mode
  }

  getChartTasks(){
    return Promise.all([
      this.testMode ? getMockTasks() : this.storageService.get(StorageKeys.SCHEDULE_TASKS),
      this.testMode ? getMockReferenceDate() : this.storageService.get(StorageKeys.REFERENCEDATE),
      this.testMode ? getMockLoginDate() : this.storageService.get(StorageKeys.LOGINDATE)
    ]).then(([tasks, referenceDate, loginDate]) => {
      const {weeklyData, firstReportAvailableDate} =
        this.categorizeAndCalculateCompletionPerWeek(tasks, loginDate, referenceDate)
      return {
        weeklyData,
        referenceDate,
        firstReportAvailableDate
      }
    })
  }

  private categorizeAndCalculateCompletionPerWeek(tasks, loginDate, referenceDate){
    const sortedTasks = this.sortByTimestampDescendant(tasks)
    if(sortedTasks.length < 1 ){
      return
    }
    const categorizedTasks = this.categorizePerWeek(sortedTasks, referenceDate)
    return this.calculateCompletionPerWeek(categorizedTasks, loginDate, referenceDate)
  }

  private categorizePerWeek(tasks, referenceDate) {
    let categorizedTasks = {}

    this.changeStartOfWeek(referenceDate)

    const protocolStartDate = moment(referenceDate)
    const lastTask = tasks[tasks.length - 1]
    const protocolEndDate = moment(lastTask.timestamp)
    const weekDate = protocolStartDate

    while (weekDate < protocolEndDate) {
      categorizedTasks = {
        ...categorizedTasks,
        [weekDate.valueOf()]: []
      }
      weekDate.add(1, 'week')
    }

    tasks.map(task => {
      const taskWeekDate = moment(task.timestamp).startOf('week').valueOf()
      categorizedTasks[taskWeekDate].push(task)
    })

    return categorizedTasks
  }

  private calculateCompletionPerWeek(tasks, loginDate, referenceDate) {
    const weeklyData = {}
    let firstReportAvailableDate = null

    this.changeStartOfWeek(referenceDate)

    for (const key in tasks) {
      if (tasks.hasOwnProperty(key)) {
        const weekNumber = this.getWeekNumber(key, referenceDate)
        let numberOfPassedTasks = 0
        let numberOfCompletedTasks = 0
        let lastTaskOfWeekAvailableAt = null
        tasks[key].map(task => {
          if(task.timestamp < moment(loginDate).startOf('week').valueOf()) return
          lastTaskOfWeekAvailableAt = task.timestamp + task.completionWindow
          if (task.completed == true) {
            numberOfPassedTasks++
            numberOfCompletedTasks++
          } else if (task.timestamp + task.completionWindow < this.getCurrentDate()) {
            numberOfPassedTasks++
          }
        })
        if (!firstReportAvailableDate) {
          firstReportAvailableDate = (tasks[key].length > 0 && tasks[key].length == numberOfPassedTasks) ? 1 :
            lastTaskOfWeekAvailableAt
        }

        weeklyData[weekNumber] = {
          total: tasks[key].length,
          numberOfPassedTasks: numberOfPassedTasks,
          numberOfCompletedTasks: numberOfCompletedTasks,
        }
      }
    }
    return {weeklyData, firstReportAvailableDate}
  }

  protected sortByTimestampDescendant(tasks) {
    return tasks.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
  }

  getCurrentDate(){
    return this.testMode ? getMockCurrentTime() : moment()
  }

  getWeekNumber(date, referenceDate){
    return (Math.round(moment.duration(moment(parseInt(date)).diff(referenceDate)).asWeeks()) + 1).toString()
  }

  changeStartOfWeek(referenceDate){
    moment.updateLocale(this.localizationService.getLanguage().value, {
      week: {
        dow: moment(referenceDate).weekday(),
        doy: 7 + moment(referenceDate).weekday() - 1,
      }
    })
  }
}
