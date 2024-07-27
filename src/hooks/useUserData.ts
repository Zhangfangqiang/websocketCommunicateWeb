import {RootState} from "@/stores";
import {shallowEqual, useSelector} from "react-redux"

const useUserData = () => {
  return useSelector((state: RootState) => ({
    friendsOrGroups: state.user.friendsOrGroups,
    userInfo: state.user.userInfo,
    userMenu: state.user.userMenu,
    selectMenuKey: state.user.selectMenuKey,
    chooseUser: state.user.chooseUser,
    messageList: state.user.messageList,
    media: state.user.media,
    fromUserUuid: state.user.fromUserUuid,


    peer: state.user.peer,

    onlineType: state.user.onlineType
  }), shallowEqual)
}
export default useUserData
