import Request from "../index"
import qs from 'qs';

/**
 * 获取当前jwt 的用户信息
 */
export function getUser() {
  return Request.get({
    url: `/user`
  })
}

/**
 * 获取用户列表
 * @param params
 */
interface getUsersParamsInterface {
  sort: string
  order: string
  per_page: string
  name: string        //搜索用户名
}
export function getUsers(params?: getUsersParamsInterface) {
  // 使用 qs.stringify 将参数转换为查询字符串
  const queryString = qs.stringify(params);
  return Request.get({
    url: `/users?${queryString}`
  })
}

/**
 * 修改用户
 * @param params
 */
interface PutUsersParamsInterface {
  name: string;           // 用户名
  introduction: string;  // 个人描述
  city: string;          // 所在城市
}
export function putUsers(params: PutUsersParamsInterface) {
  return Request.put({
    url: `/users`,
    data: params
  })
}

/**
 * 修改邮箱
 * @param params
 */
interface PutUsersEmailParamsInterface {
  email: string;        // 电子邮箱地址
  verify_code: string; // 验证码
}
export function putUsersEmail(params: PutUsersEmailParamsInterface) {
  return Request.put({
    url: `/users/email`,
    data: params
  })
}

/**
 * 修改手机号
 * @param params
 */
interface PutUsersPhoneParamsInterface {
  phone: string;        // 手机号码
  verify_code: string; // 验证码
}
export function putUsersPhone(params: PutUsersPhoneParamsInterface) {
  return Request.put({
    url: `/users/phone`,
    data: params
  })
}

/**
 * 修改密码
 * @param params
 */
interface PutUsersPasswordParamsInterface {
  password: string;            // 当前密码
  new_password: string;        // 新密码
  new_password_confirm: string; // 确认新密码
}
export function putUsersPassword(params: PutUsersPasswordParamsInterface) {
  return Request.put({
    url: `/users/password`,
    data: params
  })
}

/**
 * 修改头像
 * @param params
 */
interface PutUsersAvatarParamsInterface {
  avatar: File;
}
export function putUsersAvatar(params: PutUsersAvatarParamsInterface) {
  return Request.put({
    headers: {
      'Content-Type': 'multipart/form-data', // 设置为 multipart/form-data
    },
    url: `/users/avatar`,
    data: params
  })
}



interface PostGetFriendsOrGroupParamsInterface{
  type:string
}
export function postGetFriendsOrGroup (params: PostGetFriendsOrGroupParamsInterface) {
  return Request.post({
    url: `/users/getFriendsOrGroup`,
    data: params
  })
}

/**
 * 查询聊天记录
 */
interface postMessagesIndexInterface {
  "type": string,
  "to_user_id": string
}
export function postMessagesIndex(params: postMessagesIndexInterface) {
  return Request.post({
    url: `/messages/index`,
    data: params
  })
}
