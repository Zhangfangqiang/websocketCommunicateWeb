import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"

/**
 * 高阶组件: 函数
 * @param WrapperComponent
 * @returns {function(*)}
 */
function withRouter(WrapperComponent) {
  return function(props) {
    /**
     * 导航用于跳转
     */
    const navigate = useNavigate()

    /**
     * 动态路由的参数 在路由中配置/detail/:id
     * 在对应的组件中直接 params.id
     */
    const params = useParams()

    /**
     * 查询字符串的参数: /user?name=why&age=18
     * 相当于  window.location
     */
    const location = useLocation()

    /**
     * 下面的代码将 ?name=why&age=18 转换为{name:"wyh",age:"18"}
     * fromEntries
     * 转换键值对的一维对象
     * *************************************************
     * const arr = [
     *   ["0", "a"],
     *   ["1", "b"],
     *   ["2", "c"],
     * ]
     * const obj = Object.fromEntries(arr)
     * console.log(obj) // { 0: "a", 1: "b", 2: "c" }
     *
     * const map = new Map([
     *   ["foo", "bar"],
     *   ["baz", 42],
     * ])
     * const obj = Object.fromEntries(map)
     * console.log(obj) // { foo: "bar", baz: 42 }
     * *************************************************
     */
    const [searchParams] = useSearchParams()
    const query          = Object.fromEntries(searchParams)
    const router         = {navigate, params, location, query}

    return <WrapperComponent {...props} router={router}/>
  }
}

export default withRouter
