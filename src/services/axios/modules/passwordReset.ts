import Request from "../index"

/**
 * 通过手机号重置密码
 */
interface PostPasswordResetUsingPhoneParamsInterface {
  phone: string;
  verify_code: string;
  password: string;
}
export function PostPasswordResetUsingPhone(params:PostPasswordResetUsingPhoneParamsInterface){
  console.log('PostPasswordResetUsingPhone:params', params)
  return Request.post({
    url: `/auth/password-reset/using-phone`,
    data: params
  })
}

/**
 * 通过邮箱重置密码
 */
interface PostPasswordResetUsingEmailParamsInterface {
  email: string;
  verify_code: string;
  password: string;
}
export function PostPasswordResetUsingEmail(params:PostPasswordResetUsingEmailParamsInterface){
  console.log('PostPasswordResetUsingEmail:params', params)
  return Request.post({
    url: `/auth/password-reset/using-email`,
    data: params
  })
}
