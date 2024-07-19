import {useDispatch} from "react-redux";
import homeReducer from "./modules/home"
import {configureStore} from "@reduxjs/toolkit"


const store = configureStore({
  reducer: {
    home: homeReducer,
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type useAppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<typeof store.dispatch>()

export default store
