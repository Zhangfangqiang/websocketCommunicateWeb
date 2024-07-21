import axios, {AxiosRequestConfig} from "axios"
import {BASE_URL, TIMEOUT} from "./config"

class Request {

  public instance;

  constructor(baseURL: string, timeout: number) {
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json', // 设置默认请求头为 text/plain
      },
    })
    this.instance.interceptors.response.use((res) => {
      return res.data
    }, err => {
      return Promise.reject(err)
    })
  }


  request(config: AxiosRequestConfig) {
    return this.instance.request(config)
  }

  get(config: AxiosRequestConfig) {
    return this.request({...config, method: "get"})
  }

  post(config: AxiosRequestConfig) {
    return this.request({...config, method: "post"})
  }

  put(config: AxiosRequestConfig) {
    return this.request({...config, method: "put"})
  }

  delete(config: AxiosRequestConfig) {
    return this.request({...config, method: "delete"})
  }
}

export default new Request(BASE_URL, TIMEOUT)
