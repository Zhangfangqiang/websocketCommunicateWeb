import {BASE_URL, TIMEOUT} from "./config"
import axios, {AxiosRequestConfig} from "axios"
import ls from "@/utils/localStorage"
import {message} from "antd";



class Request {

  public instance;

  constructor(baseURL: string, timeout: number) {
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Authorization': `Bearer ${ls.getItem("userInfo")?.token}`,
        'Content-Type': 'application/json', // 设置默认请求头为 text/plain
      },
    })

    this.instance.interceptors.response.use((res) => {
      return res.data
    }, err => {
      // 你可以根据不同的状态码处理错误
      if (err.response) {
        switch (err.response.status) {
          case 400:
            console.log('Bad Request:', err.response.data);
            break;
          case 401:
            message.error(err.response.data.message)
            break;
          case 403:
            console.log('Forbidden:', err.response.data);
            break;
          case 404:
            message.error(err.response.data.message)
            console.log('Not Found:', err.response.data);
            break;
          case 422:
            message.error(err.response.data.errors[Object.keys(err.response.data.errors)[0]])
            console.log(err.response.data)
            break;
          case 500:
            console.log('Internal Server Error:', err.response.data);
            break;
          default:
            console.log('An error occurred:', err.response.data);
        }
      } else {
        // 网络错误或其他未知错误
        console.log('Network or unknown error:', err.message);
      }

      return Promise.reject(err);
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

export default new Request(BASE_URL+"/v1", TIMEOUT)
