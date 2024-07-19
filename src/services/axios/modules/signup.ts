import Request from "../index"


/**
 * 判断手机是否已注册
 */
interface PostSignupPhoneExistParamsInterface {
  phone: string;
}

export function postSignupPhoneExist(params: PostSignupPhoneExistParamsInterface) {
  console.log('postSignupPhoneExist:params', params)
  return Request.post({
    url: `/auth/signup/phone/exist`,
    data: params
  })
}


/**
 * 判断邮箱是否注册
 */
interface PostSignupEmailExistParamsInterface{
  email: string;
}
export function postSignupEmailExist (params:PostSignupEmailExistParamsInterface){
  console.log('postSignupEmailExist:params', params)
  return Request.post({
    url: `/auth/signup/email/exist`,
    data: params
  })
}

/**
 * 手机号注册
 */
interface postSignupUsingPhoneParamsInterface {
  name: string;
  password: string;
  password_confirm: string;
  verify_code: string;
  phone: string;
}
export function postSignupUsingPhone(params:postSignupUsingPhoneParamsInterface){
  console.log('postSignupUsingPhone:params', params)
  return Request.post({
    url: `/auth/signup/using-phone`,
    data: params
  })
}

/**
 * 邮箱注册
 */
interface postSignupUsingEmailParamsInterface {
  name: string;
  password: string;
  password_confirm: string;
  verify_code: string;
  email: string;
}
export function postSignupUsingEmail(params:postSignupUsingEmailParamsInterface){
  console.log('postSignupUsingEmail:params', params)
  return Request.post({
    url: `/auth/signup/using-email`,
    data: params
  })
}
