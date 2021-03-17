import {DefaultProgressConfig} from "../../../../assets/data/defaultConfig";
import {ConfigKeys} from "../../../shared/enums/config";
import {Injectable} from "@angular/core";
import {LogService} from "../../../core/services/misc/log.service";
import {RemoteConfigService} from "../../../core/services/config/remote-config.service";

@Injectable()
export class ProgressReportConfigService {

  constructor(
    private logger: LogService,
    private remoteConfig: RemoteConfigService,
  ) {}

  getProgressAllConfig() {
    return this.readRemoteConfig()
      .then(cfg =>
        Promise.all([
          ProgressReportConfigService.getProgressReportDescriptionOrDefault(cfg),
          ProgressReportConfigService.getProgressReportEnabledOrDefault(cfg)
        ])
      )
      .then(([description, enabled]) => {
        return {description, enabled}
      })
  }

  getProgressReportEnabled() {
    return this.readRemoteConfig()
      .then(cfg => ProgressReportConfigService.getProgressReportEnabledOrDefault(cfg))
  }

  getProgressReportDescription() {
    return this.readRemoteConfig()
      .then(cfg => ProgressReportConfigService.getProgressReportDescriptionOrDefault(cfg))
  }

  readRemoteConfig() {
    return this.remoteConfig.read().catch(e => {
      throw this.logger.error('Failed to fetch Firebase config', e)
    })
  }

  private static getProgressReportDescriptionOrDefault(config) {
    return config.getOrDefault(ConfigKeys.PROGRESS_REPORT_DESCRIPTION, DefaultProgressConfig.description)
  }

  private static getProgressReportEnabledOrDefault(config) {
    return config.getOrDefault(ConfigKeys.PROGRESS_REPORT_ENABLED, DefaultProgressConfig.enabled)
      .then(enabled => enabled === 'true')
  }
}
