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

const TEST_PROGRESS_REPORT = false

@Injectable()
export class ProgressReportService {

  constructor(
    private storageService: StorageService,
  ) {}

  getChartTasks(){
    return Promise.all([
      TEST_PROGRESS_REPORT ? getMockTasks() : this.storageService.get(StorageKeys.SCHEDULE_TASKS),
      TEST_PROGRESS_REPORT ? getMockReferenceDate() : this.storageService.get(StorageKeys.REFERENCEDATE),
      TEST_PROGRESS_REPORT ? getMockLoginDate() : this.storageService.get(StorageKeys.LOGINDATE)
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
    moment.updateLocale('en', {
      week: {
        dow: moment(referenceDate).weekday(),
        doy: 7 + moment(referenceDate).weekday() - 1,
      }
    })

    let categorizedTasks = {}
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

    moment.updateLocale('en', {
      week: {
        dow: moment(referenceDate).weekday(),
        doy: 7 + moment(referenceDate).weekday() - 1,
      }
    })

    const weeklyData = {}
    let firstReportAvailableDate = null
    for (const key in tasks) {
      if (tasks.hasOwnProperty(key)) {
        const weekNumber = (Math.round(moment.duration(moment(parseInt(key))
          .diff(referenceDate)).asWeeks()) + 1)
          .toString()
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
    return TEST_PROGRESS_REPORT ? getMockCurrentTime() : moment()
  }
}
