import {useDispatch} from "react-redux";
import userReducer from "./modules/user"
import {configureStore} from "@reduxjs/toolkit"
import verifyCodesReducer from "./modules/verifyCodes"


const store = configureStore({
  reducer: {
    user: userReducer,
    verifyCodes: verifyCodesReducer,
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type useAppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<typeof store.dispatch>()

export default store
