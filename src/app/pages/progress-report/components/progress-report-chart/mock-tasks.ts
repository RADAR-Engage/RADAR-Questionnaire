import * as moment from 'moment'

const currentTime = "2021-03-14 00:00"

const referenceDate = "2021-03-13 00:00"

const mockTasks = [
  {
    name: 'PHQ8',
    completionWindow: 86400000,
    repeatedQuestionnaires: [
      {date: "2021-03-13 09:30", completed: true},
      {date: "2021-03-20 09:30", completed: false},
      {date: "2021-03-27 09:30", completed: false},
      {date: "2021-04-03 09:30", completed: false},
      {date: "2021-04-10 09:30", completed: false},
      {date: "2021-04-17 09:30", completed: false},
      {date: "2021-04-24 09:30", completed: false},
      {date: "2021-05-01 09:30", completed: false},
      {date: "2021-05-08 09:30", completed: false},
      {date: "2021-05-15 09:30", completed: false},
      {date: "2021-05-22 09:30", completed: false},
      {date: "2021-05-29 09:30", completed: false},
    ]
  },
  {
    name: 'RSES',
    completionWindow: 86400000,
    repeatedQuestionnaires: [
      {date: "2021-03-13 10:00", completed: true},
      {date: "2021-03-20 10:00", completed: false},
      {date: "2021-03-27 10:00", completed: false},
      {date: "2021-04-03 10:00", completed: false},
      {date: "2021-04-10 10:00", completed: false},
      {date: "2021-04-17 10:00", completed: false},
      {date: "2021-04-24 10:00", completed: false},
      {date: "2021-05-01 10:00", completed: false},
      {date: "2021-05-08 10:00", completed: false},
      {date: "2021-05-15 10:00", completed: false},
      {date: "2021-05-22 10:00", completed: false},
      {date: "2021-05-29 10:00", completed: false},
    ]
  },
  {
    name: 'AUDIO',
    completionWindow: 86400000,
    repeatedQuestionnaires: [
      {date: "2021-03-13 05:45", completed: true},
      {date: "2021-03-20 05:45", completed: false},
      {date: "2021-03-27 05:45", completed: false},
      {date: "2021-04-03 05:45", completed: false},
      {date: "2021-04-10 05:45", completed: false},
      {date: "2021-04-17 05:45", completed: false},
      {date: "2021-04-24 05:45", completed: false},
      {date: "2021-05-01 05:45", completed: false},
      {date: "2021-05-08 05:45", completed: false},
      {date: "2021-05-15 05:45", completed: false},
      {date: "2021-05-22 05:45", completed: false},
      {date: "2021-05-29 05:45", completed: false},
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


