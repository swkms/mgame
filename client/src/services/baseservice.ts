import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { RestfulRequestTimeout, UploadFileTimeout } from '@/src/models/systemconfig'

export class MMResult<T> {
  isSuccess!: boolean
  error!: string
  content!: T
}

export default class BaseService {
  client: AxiosInstance

  constructor() {

    let port = location.port
    let ip = location.hostname
    this.client = axios.create({
      timeout: RestfulRequestTimeout,
      baseURL: "http://" + ip + ":" + port
    })
  }

  _geturl(url: string): string {
    if (url[0] == '/') {
      return url
    } else {
      return url[0]
    }
  }

  _getError(axiosError: AxiosError): string {
    let err: any
    if (axiosError.response) {
      if (axiosError.response.data) {
        err = axiosError.response.data
      } else {
        err = axiosError.response.status + ' ' + axiosError.response.statusText
      }
    } else {
      err = '连接服务器超时'
    }
    return err
  }

  async get<T>(url: string, params: any, timeout = 10000): Promise<MMResult<T>> {
    const mmResult = new MMResult<T>()
    const _this = this
    try {
      const token = localStorage.getItem('TOKEN')
      const result = await new Promise<T>((resolve, reject) => {
        this.client
          .get(this._geturl(url), { params: params, headers: { Authorization: token! }, timeout: timeout })
          .then((response: AxiosResponse) => {
            if (response.data == "") {
              response.data = null
            }
            resolve(response.data)
          })
          .catch(function (axiosError: AxiosError) {
            const error = _this._getError(axiosError)
            reject(error)
          })
      })
      mmResult.isSuccess = true
      mmResult.content = result
    } catch (error: any) {
      mmResult.isSuccess = false
      mmResult.error = error
    }
    return mmResult
  }

  async put<T>(url: string, params: any): Promise<MMResult<T>> {
    const mmResult = new MMResult<T>()
    const _this = this
    try {
      const token = localStorage.getItem('TOKEN')
      const result = await new Promise<T>((resolve, reject) => {
        this.client
          .put(this._geturl(url), params, { headers: { Authorization: token! } })
          .then((response: AxiosResponse) => {
            resolve(response.data)
          })
          .catch(function (axiosError: AxiosError) {
            const error = _this._getError(axiosError)
            reject(error)
          })
      })
      mmResult.isSuccess = true
      mmResult.content = result
    } catch (error: any) {
      mmResult.isSuccess = false
      mmResult.error = error
    }
    return mmResult
  }

  async post<T>(url: string, params: any, timeout = 10000, contentType = ''): Promise<MMResult<T>> {
    const mmResult = new MMResult<T>()
    const _this = this
    try {
      const token = localStorage.getItem('TOKEN')
      const headers = {
        Authorization: token!
      }
      if (contentType != '') {
        headers["Content-Type"] = contentType
      }

      const result = await new Promise<T>((resolve, reject) => {
        this.client
          .post(this._geturl(url), params, { headers: headers, timeout: timeout })
          .then((response: AxiosResponse) => {
            resolve(response.data)
          })
          .catch(function (axiosError: AxiosError) {
            const error = _this._getError(axiosError)
            reject(error)
          })
      })
      mmResult.isSuccess = true
      mmResult.content = result
    } catch (error: any) {
      mmResult.isSuccess = false
      mmResult.error = error
    }
    return mmResult
  }

  async upload(url: string, params: any, file: File, progress: any, cancelToken: any): Promise<MMResult<string>> {
    const mmResult = new MMResult<string>()
    const _this = this
    try {
      let formData = new FormData()
      formData.append(file.name, file)
      const token = localStorage.getItem('TOKEN')
      const result = await new Promise<string>((resolve, reject) => {
        axios
          .create({ timeout: 1000*60*30 })
          .post(this._geturl(url), formData, {
            params: params,
            headers: { Authorization: token! },
            onUploadProgress: progress,
            cancelToken: cancelToken,
          })
          .then((response: AxiosResponse) => {
            resolve(response.data)
          })
          .catch(function (axiosError: AxiosError) {
            const error = _this._getError(axiosError)
            reject(error)
          })
      })
      mmResult.isSuccess = true
      mmResult.content = result
    } catch (error: any) {
      mmResult.isSuccess = false
      mmResult.error = error
    }
    return mmResult
  }

  async delete<T>(url: string, params: any, timeout = 10000): Promise<MMResult<T>> {
    const mmResult = new MMResult<T>()
    const _this = this
    try {
      const token = localStorage.getItem('TOKEN')
      const result = await new Promise<T>((resolve, reject) => {
        this.client
          .delete(this._geturl(url), { params: params, headers: { Authorization: token! }, timeout: timeout })
          .then((response: AxiosResponse) => {
            resolve(response.data)
          })
          .catch(function (axiosError: AxiosError) {
            const error = _this._getError(axiosError)
            reject(error)
          })
      })
      mmResult.isSuccess = true
      mmResult.content = result
    } catch (error: any) {
      mmResult.isSuccess = false
      mmResult.error = error
    }
    return mmResult
  }
}
