##Chart Styles
`progress-report/components/progress-report-chart/chart-styles.ts`

##Test
For testing with mock data change these files:

1) `progress-report/services/progress-report.service.ts` 

```ts
const TEST_PROGRESS_REPORT = true // #line 12
```

2) `progress-report/components/progress-report-chart/mock-tasks.ts`

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
PROGRESS_REPORT_WAITING: {
  ...
  en: 'The first report will be available on',
  ...
},
PROGRESS_REPORT_WAITING_TODAY: {
  ...
  en: 'The first report will be available today at',
  ...
},
PROGRESS_REPORT_WAITING_TOMORROW: {
  ...
  en: 'The first report will be available tomorrow at',
  ...
}
```
