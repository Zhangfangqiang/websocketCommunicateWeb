import {RootState} from "@/stores";
import {shallowEqual, useSelector} from "react-redux"

const useUserData = () => {
  return useSelector((state: RootState) => ({
    peer: state.user.peer,
    media: state.user.media,
    socket: state.user.socket,
    userInfo: state.user.userInfo,
    callName: state.user.callName,
    chooseUser: state.user.chooseUser,
    onlineType: state.user.onlineType,
    messageList: state.user.messageList,
    fromUserUuid: state.user.fromUserUuid,
    selectMenuKey: state.user.selectMenuKey,
    videoCallModal : state.user.videoCallModal,
    friendsOrGroups: state.user.friendsOrGroups,
    searchForUsersOrGroupsData: state.user.searchForUsersOrGroupsData
  }), shallowEqual)
}
export default useUserData
