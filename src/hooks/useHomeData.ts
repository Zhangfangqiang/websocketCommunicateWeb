import {RootState} from "@/stores";
import {shallowEqual, useSelector} from "react-redux"

const useHomeData = () => {
  return useSelector((state: RootState) => ({

  }), shallowEqual)
}
export default useHomeData
