import {createSlice} from '@reduxjs/toolkit'
import {postVerifyCodesCaptcha} from "@/services";

interface userInfoInterface {
  data: {
    id: number;
    uuid: string;
    city: string;
    introduction: string;
    avatar: string;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
  };
  token: string;
}

export interface initialStateInterface {
  userInfo: userInfoInterface | null
}


const initialState: initialStateInterface = {
  userInfo: null
}

/**
 * 修改内容的东西
 */
const ActivationCodeSlice = createSlice({
  name: "verifyCodes",
  initialState,
  reducers: {
    changeUserInfoAction(state, {payload}) {
      state.userInfo = payload
    },
  },
})

export const {
  changeUserInfoAction
} = ActivationCodeSlice.actions

export default ActivationCodeSlice.reducer
