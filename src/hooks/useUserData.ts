import {RootState} from "@/stores";
import {shallowEqual, useSelector} from "react-redux"

const useUserData = () => {
  return useSelector((state: RootState) => ({
    friends: state.user.friends,
    userInfo: state.user.userInfo,
    userMenu: state.user.userMenu,
    selectMenuKey: state.user.selectMenuKey,
    chooseUser: state.user.chooseUser,
    messageList: state.user.messageList,


    onlineType: state.user.onlineType
  }), shallowEqual)
}
export default useUserData
