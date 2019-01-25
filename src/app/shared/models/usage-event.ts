export interface UsageEventValueExport {
  time: number
  eventType: UsageEventType
}

export enum UsageEventType {
  APP_OPEN_NOTIFICATION = 'APP_OPEN_NOTIFICATION',
  APP_OPEN_DIRECTLY = 'APP_OPEN_DIRECTLY',
  QUESTIONNAIRE_STARTED = 'QUESTIONNAIRE_STARTED',
  QUESTIONNAIRE_COMPLETED = 'QUESTIONNAIRE_COMPLETED',
  QUESTIONNARE_CLOSED = 'QUESTIONNAIRE_CLOSED'
}
