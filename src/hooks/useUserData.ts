import {RootState} from "@/stores";
import {shallowEqual, useSelector} from "react-redux"

const useUserData = () => {
  return useSelector((state: RootState) => ({
    userInfo: state.user.userInfo,
  }), shallowEqual)
}
export default useUserData
