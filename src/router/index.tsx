import Home from "@/views/home"
import Login from "@/views/auth/login"
import Signup from "@/views/auth/signup"
import {RequireAuth} from "@/router/require-auth";

const routes = [
  {
    path: "/",
    element: <Home/>
  }, {
    path: "/login",
    element: <RequireAuth><Login/></RequireAuth>
  },
  {
    path: "/signup",
    element: <RequireAuth><Signup/></RequireAuth>
  }
]

export default routes
