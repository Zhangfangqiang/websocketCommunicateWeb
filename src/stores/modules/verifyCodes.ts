import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {postVerifyCodesCaptcha} from "@/services";


export interface initialStateInterface {
  verifyCodesCaptcha: {
    "captcha_id": string,
    "captcha_image": string
  }
}


const initialState: initialStateInterface = {
  verifyCodesCaptcha: {
    captcha_id: "",
    captcha_image: ""
  }
}

/**
 * 修改内容的东西
 */
const ActivationCodeSlice = createSlice({
  name: "verifyCodes",
  initialState,
  reducers: {
    changeVerifyCodesCaptchaAction(state, {payload}) {
      state.verifyCodesCaptcha = payload
    },
  },
})

export const {
  changeVerifyCodesCaptchaAction
} = ActivationCodeSlice.actions

export default ActivationCodeSlice.reducer
