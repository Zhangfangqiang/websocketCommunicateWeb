import {RootState} from "@/stores";
import {shallowEqual, useSelector} from "react-redux"

const useVerifyCodesData = () => {
  return useSelector((state: RootState) => ({
    verifyCodesCaptcha: state.verifyCodes.verifyCodesCaptcha,
  }), shallowEqual)
}
export default useVerifyCodesData
