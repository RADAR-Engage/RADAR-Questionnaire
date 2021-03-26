import {Injectable} from "@angular/core"
import {StorageService} from "../../../core/services/storage/storage.service"
import * as moment from 'moment'
import {StorageKeys} from "../../../shared/enums/storage";
import {
  getMockCurrentTime,
  getMockLoginDate,
  getMockReferenceDate,
  getMockTasks
} from "../components/progress-report-chart/mock-tasks";

const TEST_PROGRESS_REPORT = true

@Injectable()
export class ProgressReportService {
  firstReportAvailableDate
  referenceDate
  loginDate
  currentDate

  constructor(
    private storageService: StorageService,
  ) {}

  getChartTasks(){
    this.currentDate = TEST_PROGRESS_REPORT ? getMockCurrentTime() : moment()
    return Promise.all([
      TEST_PROGRESS_REPORT ? getMockTasks() : this.storageService.get(StorageKeys.SCHEDULE_TASKS),
      TEST_PROGRESS_REPORT ? getMockReferenceDate() : this.storageService.get(StorageKeys.REFERENCEDATE),
      TEST_PROGRESS_REPORT ? getMockLoginDate() : this.storageService.get(StorageKeys.LOGINDATE)
    ]).then(([tasks, referenceDate, loginDate]) => {
      this.referenceDate = referenceDate
      this.loginDate = loginDate
      return {
        weeklyData: this.categorizeAndCalculateCompletionPerWeek(tasks),
        referenceDate: referenceDate,
        firstReportAvailableDate: this.firstReportAvailableDate
      }
    })
  }

  private categorizeAndCalculateCompletionPerWeek(tasks){
    this.changeLocalStartDayOfWeekToReferenceDate()
    const sortedTasks = this.sortByTimestampDescendant(tasks)

    if(sortedTasks.length < 1 ){
      return
    }

    const categorizedTasks = this.categorizePerWeek(sortedTasks)

    return this.calculateCompletionPerWeek(categorizedTasks)
  }

  private categorizePerWeek(tasks) {
    let categorizedTasks = {}
    const protocolStartDate = moment(this.referenceDate)
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

  private calculateCompletionPerWeek(tasks) {
    const result = {}
    for (const key in tasks) {
      if (tasks.hasOwnProperty(key)) {
        const weekNumber = (Math.round(moment.duration(moment(parseInt(key))
          .diff(moment(this.referenceDate))).asWeeks()) + 1)
          .toString()
        let numberOfPassedTasks = 0
        let numberOfCompletedTasks = 0
        let lastTaskOfWeekAvailableAt
        tasks[key].map(task => {
          if(task.timestamp < moment(this.loginDate).startOf('week').valueOf()) return
          lastTaskOfWeekAvailableAt = task.timestamp + task.completionWindow
          if (task.completed == true) {
            numberOfPassedTasks++
            numberOfCompletedTasks++
          } else if (task.timestamp + task.completionWindow < this.currentDate) {
            numberOfPassedTasks++
          }
        })
        if (!this.firstReportAvailableDate) {
          this.firstReportAvailableDate = (tasks[key].length > 0 && tasks[key].length == numberOfPassedTasks) ? 1 :
            lastTaskOfWeekAvailableAt
        }

        result[weekNumber] = {
          total: tasks[key].length,
          numberOfPassedTasks: numberOfPassedTasks,
          numberOfCompletedTasks: numberOfCompletedTasks,
        }
      }
    }
    return result
  }

  private changeLocalStartDayOfWeekToReferenceDate() {
    moment.updateLocale('en', {
      week: {
        dow: moment(this.referenceDate).weekday(),
        doy: 7 + moment(this.referenceDate).weekday() - 1,
      }
    });
  }

  protected sortByTimestampDescendant(tasks) {
    return tasks.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
  }
}
