import * as moment from 'moment'

const currentTime = "2021-03-23 00:00"

const referenceDate = "2021-03-23 00:00"

const mockTasks = [
  {
    name: 'PHQ8',
    completionWindow: 86400000,
    repeatedQuestionnaires: [
      {date: "2021-03-23 09:30", completed: false},
      {date: "2021-03-30 09:30", completed: false},
      {date: "2021-04-06 09:30", completed: false},
      {date: "2021-04-13 09:30", completed: false},
      {date: "2021-04-20 09:30", completed: false},
      {date: "2021-04-27 09:30", completed: false},
      {date: "2021-05-04 09:30", completed: false},
      {date: "2021-05-11 09:30", completed: false},
      {date: "2021-05-18 09:30", completed: false},
      {date: "2021-05-25 09:30", completed: false},
      {date: "2021-06-01 09:30", completed: false},
      {date: "2021-06-08 09:30", completed: false},
    ]
  },
  {
    name: 'RSES',
    completionWindow: 86400000,
    repeatedQuestionnaires: [
      {date: "2021-03-23 10:00", completed: true},
      {date: "2021-03-30 10:00", completed: false},
      {date: "2021-04-06 10:00", completed: false},
      {date: "2021-04-13 10:00", completed: false},
      {date: "2021-04-20 10:00", completed: false},
      {date: "2021-04-27 10:00", completed: false},
      {date: "2021-05-04 10:00", completed: false},
      {date: "2021-05-11 10:00", completed: false},
      {date: "2021-05-18 10:00", completed: false},
      {date: "2021-05-25 10:00", completed: false},
      {date: "2021-06-01 10:00", completed: false},
      {date: "2021-06-08 10:00", completed: false},
    ]
  },
  {
    name: 'AUDIO',
    completionWindow: 86400000,
    repeatedQuestionnaires: [
      {date: "2021-03-23 05:45", completed: true},
      {date: "2021-03-30 05:45", completed: false},
      {date: "2021-04-06 05:45", completed: false},
      {date: "2021-04-13 05:45", completed: false},
      {date: "2021-04-20 05:45", completed: false},
      {date: "2021-04-27 05:45", completed: false},
      {date: "2021-05-04 05:45", completed: false},
      {date: "2021-05-11 05:45", completed: false},
      {date: "2021-05-18 05:45", completed: false},
      {date: "2021-05-25 05:45", completed: false},
      {date: "2021-06-01 05:45", completed: false},
      {date: "2021-06-08 05:45", completed: false},
    ]
  }
]


const createTasksFromMockTasks = (()=>{
  const result = []
  mockTasks.forEach(task => {
    task.repeatedQuestionnaires.forEach(questionnaire => {
      result.push({
        completed: questionnaire.completed,
        completionWindow: task.completionWindow,
        name: task.name,
        timestamp: moment(questionnaire.date).valueOf()
      })
    })
  })
  return result
})

export const getMockReferenceDate = (() => {
  return new Promise((resolve , reject) => {
    resolve(moment(referenceDate).valueOf())
  });
})

export const getMockTasks = (() => {
  return new Promise((resolve , reject) => {
    resolve(createTasksFromMockTasks())
  });
})

export const getMockCurrentTime = (() => {
  return moment(currentTime)
})


