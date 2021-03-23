import {Injectable} from "@angular/core"
import {StorageService} from "../../../core/services/storage/storage.service"
import * as moment from 'moment'
import {StorageKeys} from "../../../shared/enums/storage";
import {getMockCurrentTime, getMockReferenceDate, getMockTasks} from "../components/progress-report-chart/mock-tasks";

@Injectable()
export class ProgressReportService {

  constructor(
    private storageService: StorageService,
  ) {}

  getChartTasks(){
    return Promise.all([
      // this.storageService.get(StorageKeys.SCHEDULE_TASKS),
      // this.storageService.get(StorageKeys.REFERENCEDATE)
      getMockTasks(),
      getMockReferenceDate(),
    ]).then(([tasks, referenceDate]) => {
      console.log(tasks)
      console.log(moment(referenceDate).format("YYYY-MM-DD HH:mm"))
      return {
        tasks: this.filterTasksByReferenceDate(tasks, referenceDate),
        referenceDate: referenceDate
      }
    })
  }

  private filterTasksByReferenceDate(tasks, referenceDate){
    moment.updateLocale('en', {
      week: {
        dow: moment(referenceDate).weekday(),
        doy: 7 + moment(referenceDate).weekday() - 1,
      }
    });

    // const date = moment()
    const date = getMockCurrentTime()

    const startOfWeek = date.startOf("week")

    const result = {}

    tasks.map(task => {
      if((task.timestamp + task.completionWindow) < startOfWeek) {
      // if((task.timestamp) < startOfWeek) {
        const taskName = "merged"
        const taskByName = result[taskName]
        const intervalRef = moment(task.timestamp).startOf("week").valueOf()
        if(taskByName){
          const taskByNameAndInterval = taskByName[intervalRef]
          if(taskByNameAndInterval){
            taskByName[intervalRef] = {
              completed: task.completed? taskByNameAndInterval.completed + 1 : taskByNameAndInterval.completed,
              total: taskByNameAndInterval.total+1
            }
          }else{
            taskByName[intervalRef] = {completed: task.completed? 1 : 0, total: 1}
          }
          result[taskName] = taskByName
        }else{
          result[taskName] = {[(intervalRef as any)]: {completed: task.completed? 1 : 0, total: 1}}
        }
      }
    })
    return result
  }
}
