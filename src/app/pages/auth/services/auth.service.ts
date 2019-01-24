import 'rxjs/add/operator/toPromise'

import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'

import {
  DefaultEndPoint,
  DefaultManagementPortalURI,
  DefaultMetaTokenURI,
  DefaultRefreshTokenRequestBody,
  DefaultRequestEncodedContentType,
  DefaultRequestJSONContentType,
  DefaultSourceTypeModel,
  DefaultSourceTypeRegistrationBody,
  DefaultSubjectsURI
} from '../../../../assets/data/defaultConfig'
import { ConfigService } from '../../../core/services/config/config.service'
import { StorageService } from '../../../core/services/storage/storage.service'
import { TokenService } from '../../../core/services/token/token.service'
import { StorageKeys } from '../../../shared/enums/storage'
import { setDateTimeToMidnight } from '../../../shared/utilities/time'

@Injectable()
export class AuthService {
  URI_base: string
  URLRegEx = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
  URLValidators = [Validators.required, Validators.pattern(this.URLRegEx)]

  constructor(
    public http: HttpClient,
    public storage: StorageService,
    private token: TokenService,
    private config: ConfigService
  ) {
    this.updateURI()
  }

  authenticate(authObj) {
    return (this.validURL(authObj)
      ? this.URLAuth(authObj)
      : this.nonURLAuth(authObj)
    ).then(refreshToken => {
      return this.registerToken(refreshToken)
        .then(() => this.registerAsSource())
        .then(() => this.registerToken(refreshToken))
    })
  }

  URLAuth(authObj) {
    // NOTE: Meta QR code and new QR code
    return this.getRefreshTokenFromUrl(authObj).then((body: any) => {
      const refreshToken = body['refreshToken']
      if (body['baseUrl']) {
        this.storage.set(StorageKeys.BASE_URI, body['baseUrl'])
        this.updateURI()
      }
      return refreshToken
    })
  }

  nonURLAuth(authObj) {
    // NOTE: Old QR codes: containing refresh token as JSON
    return this.updateURI().then(() => {
      const refreshToken = JSON.parse(authObj)['refreshToken']
      return refreshToken
    })
  }

  enrol() {
    return this.initSubjectInformation().then(() =>
      this.config.fetchConfigState(true)
    )
  }

  updateURI() {
    return this.storage.get(StorageKeys.BASE_URI).then(uri => {
      this.URI_base = (uri ? uri : DefaultEndPoint) + DefaultManagementPortalURI
    })
  }

  registerToken(registrationToken) {
    const refreshBody = DefaultRefreshTokenRequestBody + registrationToken
    return this.token.register(refreshBody)
  }

  getRefreshTokenFromUrl(url) {
    return this.http.get(url).toPromise()
  }

  getURLFromToken(base, token) {
    return base + DefaultMetaTokenURI + token
  }

  getSubjectURI(subject) {
    return this.URI_base + DefaultSubjectsURI + subject
  }

  getSubjectInformation() {
    return Promise.all([
      this.token.getAccessHeaders(DefaultRequestEncodedContentType),
      this.token.getDecodedSubject()
    ]).then(([headers, subject]) =>
      this.http.get(this.getSubjectURI(subject), { headers }).toPromise()
    )
  }

  initSubjectInformation() {
    return this.getSubjectInformation().then(res => {
      const subjectInformation: any = res
      const participantId = subjectInformation.externalId
      const participantLogin = subjectInformation.login
      const projectName = subjectInformation.project.projectName
      const sourceId = this.getSourceId(subjectInformation)
      const createdDate = new Date(subjectInformation.createdDate).getTime()
      const createdDateMidnight = setDateTimeToMidnight(
        new Date(subjectInformation.createdDate)
      ).getTime()

      return this.storage.init(
        participantId,
        participantLogin,
        projectName,
        sourceId,
        createdDate,
        createdDateMidnight
      )
    })
  }

  getSourceId(response) {
    const sources = response.sources
    for (let i = 0; i < sources.length; i++) {
      if (sources[i].sourceTypeModel === DefaultSourceTypeModel) {
        return sources[i].sourceId
      }
    }
    return 'Device not available'
  }

  registerAsSource() {
    return Promise.all([
      this.token.getAccessHeaders(DefaultRequestJSONContentType),
      this.token.getDecodedSubject()
    ]).then(([headers, subject]) =>
      this.http
        .post(
          this.getSubjectURI(subject) + '/sources',
          DefaultSourceTypeRegistrationBody,
          {
            headers
          }
        )
        .toPromise()
    )
  }

  validURL(str) {
    return !new FormControl(str, Validators.pattern(this.URLRegEx)).errors
  }
}
