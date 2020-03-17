import { Injectable } from '@angular/core'

import { DefaultNotificationType } from '../../../../assets/data/defaultConfig'
import { ConfigKeys } from '../../../shared/enums/config'
import { NotificationMessagingType } from '../../../shared/models/notification-handler'
import { RemoteConfigService } from '../config/remote-config.service'
import { FcmNotificationService } from './fcm-notification.service'
import { FcmXmppNotificationService } from './fcm-xmpp-notification.service'
import { LocalNotificationService } from './local-notification.service'

@Injectable()
export class NotificationWrapperService {
  notificationService:
    | FcmNotificationService
    | FcmXmppNotificationService
    | LocalNotificationService
  constructor(
    public fcmNotificationService: FcmNotificationService,
    public fcmXmppNotificationService: FcmXmppNotificationService,
    public localNotificationService: LocalNotificationService,
    private remoteConfig: RemoteConfigService
  ) {
    this.remoteConfig
      .read()
      .then(config =>
        config.getOrDefault(
          ConfigKeys.NOTIFICATION_MESSAGING_TYPE,
          DefaultNotificationType
        )
      )
      .then(type => {
        if (type == NotificationMessagingType.LOCAL.toString())
          this.notificationService = fcmXmppNotificationService
        if (type == NotificationMessagingType.FCM_XMPP)
          this.notificationService = localNotificationService
        if (type == NotificationMessagingType.FCM)
          this.notificationService = fcmNotificationService
      })
  }

  init() {
    return this.notificationService.init()
  }

  cancelAllNotifications(user?): Promise<any> {
    return this.notificationService.cancelAllNotifications(user)
  }

  permissionCheck(): Promise<any> {
    return this.notificationService.permissionCheck()
  }

  publish(limit: number, type?): Promise<any> {
    return this.notificationService.publish(limit, type)
  }

  setLastNotificationUpdate(): Promise<any> {
    return this.notificationService.setLastNotificationUpdate()
  }

  getLastNotificationUpdate(): Promise<any> {
    return this.notificationService.getLastNotificationUpdate()
  }
}
