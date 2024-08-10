import Home from "@/views/home"
import Login from "@/views/auth/login"
import Signup from "@/views/auth/signup"
import FindPassword from "@/views/auth/findPassword"
import {RequireAuth} from "@/router/require-auth";

const routes = [
  {
    path: "/",
    element: <RequireAuth><Home/></RequireAuth>
  }, {
    path: "/login",
    element: <RequireAuth><Login/></RequireAuth>
  },
  {
    path: "/signup",
    element: <RequireAuth><Signup/></RequireAuth>
  }, {
    path: "findPassword",
    element: <RequireAuth><FindPassword/></RequireAuth>
  }
]

export default routes
