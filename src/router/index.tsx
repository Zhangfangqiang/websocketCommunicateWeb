import Home from "@/views/home"
import Login from "@/views/auth/login"
import Signup from "@/views/auth/signup"

const routes = [
  {
    path: "/",
    element: <Home/>
  }, {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/signup",
    element: <Signup/>
  }
]

export default routes
