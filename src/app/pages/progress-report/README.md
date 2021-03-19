##Styles
`progress-report/components/progress-report-chart/chart-styles.ts`
```ts
export const enum markerColors {
  NOT_COMPLETED = "#D87476",
  COMPLETED = "#9CB229",
  PARTIALLY_COMPLETED = "#C8C9C8"
}

export const markerStroke = {
  size: 6,
  strokeColors: '#ffffff',
  strokeWidth: 2,
}

export const lineColors = ["#3c6f82"]
```

##Test
`progress-report/services/progress-report.service.ts`

```ts
getChartTasks(){
    return Promise.all([
      //this.storageService.get(StorageKeys.SCHEDULE_TASKS),
      //this.storageService.get(StorageKeys.REFERENCEDATE)
      getMockTasks(),
      getMockReferenceDate(),
    ]).then(([tasks, referenceDate]) => {
        ...
    })
  }

  private filterTasksByReferenceDate(tasks, referenceDate){
    ...

    //const date = moment()
    const date = getMockCurrentTime()

    ...
  }
```
##Translations
`assets/data/localisations.ts`
```ts
PROGRESS_REPORT_TITLE: {
    ...
    en: 'Progress Report',
    ...
  },
  PROGRESS_REPORT_NO_RESULT: {
    ...
    en: 'No result!',
    ...
  },
  PROGRESS_REPORT_IN_FIRST_WEEK: {
    ...
    en: 'The first report will be available after the end of first week on',
    ...
  }
```
