
/*自定义组件*/

/**
 * 判断用户是否登陆鉴权中间件
 * @param children
 * @returns {JSX.Element|*}
 * @constructor
 */
export function RequireAuth({children}: { children: any }) {
  return children;
}

