import Request from "../index"

/**
 * 获取用户
 */
interface getUserFriendsParamsInterface {
  sort: string
  order: string
  per_page: string
}
export function getUserFriends(params: getUserFriendsParamsInterface) {
  return Request.get({
    url: `/user_friends`,
    data: params
  })
}


/**
 * 添加好友
 */
interface postUserFriendsParamsInterface {
  userId:number
}
export function postUserFriends(params: postUserFriendsParamsInterface) {
  return Request.post({
    url: `/user_friends`,
    data: params
  })
}

/**
 * 删除好友
 * @param id
 */
export function deleteUserFriends(id:number) {
  return Request.delete({
    url: `/user_friends/${id}`})
}
