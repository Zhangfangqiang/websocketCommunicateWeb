import {RootState} from "@/stores";
import {shallowEqual, useSelector} from "react-redux"

const useUserData = () => {
  return useSelector((state: RootState) => ({
    peer: state.user.peer,
    media: state.user.media,
    userInfo: state.user.userInfo,
    chooseUser: state.user.chooseUser,
    onlineType: state.user.onlineType,
    messageList: state.user.messageList,
    fromUserUuid: state.user.fromUserUuid,
    selectMenuKey: state.user.selectMenuKey,
    friendsOrGroups: state.user.friendsOrGroups,
    searchForUsersOrGroupsData: state.user.searchForUsersOrGroupsData
  }), shallowEqual)
}
export default useUserData
