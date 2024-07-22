
/*自定义组件*/

import {Navigate, useLocation} from "react-router-dom";
import {useState} from "react";
import useUserData from "@/hooks/useUserData";

/**
 * 判断用户是否登陆鉴权中间件
 * @param children
 * @returns {JSX.Element|*}
 * @constructor
 */
export function RequireAuth({children}: { children: any }) {

  let location = useLocation();

   let prohibitPaths = ['/signup','/login']
  const {userInfo}= useUserData()


  //如果是登录后禁止的页面
  if (prohibitPaths.includes( location.pathname) && userInfo) {
    return <Navigate to="/" state={{from: location}} replace/>;
  }

  return children;
}

