import {Component, Input, OnInit} from '@angular/core'
import * as moment from 'moment'
import {ChartOptions} from "../../models/chart";
import {lineColors, markerStroke} from "./chart-styles";
import {getMockCurrentTime} from "./mock-tasks";

export const enum markerColors {
  NOT_COMPLETED = "#D87476",
  COMPLETED = "#9CB229",
  PARTIALLY_COMPLETED = "#C8C9C8"
}

@Component({
  selector: 'progress-report-chart',
  templateUrl: 'progress-report-chart.component.html',
})
export class ProgressReportChartComponent implements OnInit {
  @Input()
  tasksData: any

  loading = true
  chartData: any

  referenceDate: number

  public chartOptions: Partial<ChartOptions>;

  constructor() {}

  ngOnInit() {
    const {tasks, referenceDate} = this.tasksData
    this.referenceDate = referenceDate
    this.chartData = this.convertTasksToChartData(tasks)
    console.log(this.referenceDate)
    console.log(this.chartData)
    this.initCharts()
  }

  initCharts(){
    this.chartOptions = {
      series: this.chartData,
      chart: {
        id: "chart",
        type: "area",
        height: 230,
        width: this.calculateWidth(),
        toolbar: {
          show: false,
        },
        foreColor: '#000',
        fontFamily: 'Montserrat, sans-serif',
      },
      colors: lineColors,
      stroke: {
        curve: "straight"
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: 1
      },
      markers: {...markerStroke, strokeOpacity: 1},
      xaxis: {
        type: 'category',
        labels: {
          show: true,
          rotate: -45,
          // formatter: (val) => {
          //   return this.getWeekNumberOfProtocol(val)
          // }
        },
        title: {
          text: "Week",
        },
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 2,
        labels: {
          show: true,
          rotate: 0,
          minWidth: 40,
          formatter: function(val) {
            if(val>50){return 'Full'}
            if(val>1){return 'Half'}
            return '';
          },
        },
        title: {
          text: "Task Completion",
        },
      },
      tooltip: {
        enabled: false,
      },
    }
  }

  calculateWidth(){
    if(!this.chartData[0]) return "100%"
    const numberOfItems = this.chartData[0].data.length // Math.floor(range/intervals["week"])
    if(numberOfItems<13){
      return "100%"
    }
    return numberOfItems * 30
  }

  getWeekNumberOfProtocol(val){
    return (Math.round(moment.duration(moment(parseInt(val)).diff(moment(this.referenceDate))).asWeeks()) + 1)
      .toString()
  }



  // getXLabel(item){
  //   return moment(parseInt(item)).valueOf()
  // }





  getReportStartDate() {
    return moment(this.referenceDate).add(1, "week").format("YYYY/MM/DD HH:mm")
  }

  convertTasksToChartData(tasks){
    const output = []
    const data1 = []
    for (const key in tasks) {
      if(tasks.hasOwnProperty(key)){
        let y = null
        if(tasks[key].total > 0 && tasks[key].total == tasks[key].availableTotal){
          y = 100 * tasks[key].completed / tasks[key].total
          console.log(y)
          if(y != 0 && y != 100){
            y = 50
          }
          console.log(y)
        }
        let fillColor = markerColors.PARTIALLY_COMPLETED
        if(y == 0){
          fillColor = markerColors.NOT_COMPLETED
        }else if(y == 100){
          fillColor =  markerColors.COMPLETED
        }
        data1.push({
          x: key,
          y: y,
          fillColor: fillColor
        })
      }
    }
    output.push({name: 'result', data: data1})
    console.log(output)
    return output


    // if want to show null between weeks and at the beginning
    /*
        const weeks = [];
        for(let i=0;i<30; i++){
          weeks.push(moment(this.referenceDate).add(i, 'week').valueOf())
        }
        console.log(weeks)
    */
    // end if

    console.log(tasks)
    const result = []
    for (const task in tasks) {
      if (tasks.hasOwnProperty(task)) {
        const data = []


        // if want to show null between weeks and at the beginning
        /*
                weeks.forEach(week => {
                  if(tasks[task][week]){
                    data.push({
                      x: this.getXLabel(week), //"W" + moment(item).week(),
                      y: this.getPercentage(tasks[task][week]),
                      fillColor: this.getColorFill(tasks[task][week])
                    })
                  }else{
                    data.push({
                      x: this.getXLabel(week), //"W" + moment(item).week(),
                      y: null,//this.getPercentage(tasks[task][item]),
                      //fillColor: this.getColorFill(tasks[task][item])
                    })
                  }
                })
        */
        // end if

        // if don't want to show null between weeks and at the beginning

        for (const item in tasks[task]) {
          // console.log(item)
          if(tasks[task].hasOwnProperty(item)) {
            console.log(true)
            data.push({
              x: item,//this.getXLabel(item), //"W" + moment(item).week(),
              y: this.getPercentage(tasks[task][item]),
              fillColor: this.getColorFill(tasks[task][item])
            })
          }
        }

        // end if
        result.push({name: task, data: data})
      }
    }
    return result
  }

  getColorFill(item){
    // if(!item) return null
    const completedPercentage = Math.floor(100 * item.completed / item.total)
    if(completedPercentage == 0){
      return markerColors.NOT_COMPLETED
    }else if(completedPercentage == 100){
      return markerColors.COMPLETED
    }
    return markerColors.PARTIALLY_COMPLETED
  }

  getXLabel(item){
    return moment(parseInt(item)).valueOf()
  }

  getPercentage(item){
    // if(!item) return null
    const completedPercentage = Math.floor(100 * item.completed / item.total)
    if(completedPercentage < 100 && completedPercentage > 0) return 50
    return completedPercentage
  }

  isFirstWeekPassed(){
    return true
    return getMockCurrentTime() >= moment(this.referenceDate).add(1,'week')
    // return moment() >= moment(this.referenceDate).add(1,'week')
  }

  isChartEmpty(){
    return false
    if(!this.chartData) return false
    return this.chartData.length == 0
  }
}
