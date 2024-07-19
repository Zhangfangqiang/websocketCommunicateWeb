import Request from "../index"

/**
 * 使用手机号,加短信验证码的方式登录
 */
export interface PostLoginUsingPhoneParamsInterface {
  phone: string;
  verify_code: string;
}
export function postLoginUsingPhone(params:PostLoginUsingPhoneParamsInterface){
  console.log('postLoginUsingPhone:params', params)
  return Request.post({
    url: `/auth/login/using-phone`,
    data: params
  })
}

/**
 * 使用账号密码登录 , 账号可以为手机号, 邮箱
 */
export interface PostLoginUsingPasswordParamsInterface {
  captcha_id: string;
  captcha_answer: string;
  login_id: string;
  password: string;
}
export function postLoginUsingPassword(params:PostLoginUsingPasswordParamsInterface){
  console.log('postLoginUsingPassword:params', params)
  return Request.post({
    url: `/auth/login/using-password`,
    data: params
  })
}

/**
 * 刷新Token
 * @param params
 */
export function postLoginRefreshToken(){
  console.log('postLoginRefreshToken')
  return Request.post({
    url: `/auth/login/refresh-token`
  })
}
