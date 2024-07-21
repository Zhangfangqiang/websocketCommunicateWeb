import Request from "../index"

/**
 * 获取图片验证码
 */
export function postVerifyCodesCaptcha() {
  console.log('postVerifyCodesCaptcha')
  return Request.post({
    url: `/auth/verify-codes/captcha`,
  })
}

/**
 * 获取手机验证码
 */
interface PostVerifyCodesPhoneParamsInterface {
  phone: string;
  captcha_id: string;
  captcha_answer: string;
}
export function postVerifyCodesPhone(params: PostVerifyCodesPhoneParamsInterface) {
  console.log('postVerifyCodesPhone:params', params)
  return Request.post({
    url: `/auth/verify-codes/phone`,
    data: params
  })
}

/**
 * 获取邮箱验证码
 */
export interface PostVerifyCodesEmailParamsInterface {
  email: string;
  captcha_id: string;
  captcha_answer: string;
}
export function postVerifyCodesEmail(params: PostVerifyCodesEmailParamsInterface) {
  console.log('postVerifyCodesEmail:params', params)
  return Request.post({
    url: `/auth/verify-codes/email`,
    data: params
  })
}
