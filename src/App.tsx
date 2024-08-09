/*引入样式*/
import "./app.scss"

/*react组件*/
import {useRoutes} from 'react-router-dom'
import React, {memo} from 'react'

/* 包里面的组件开始 */
import 'moment/locale/zh-cn';
import routes from './router'
import {useAppDispatch} from "@/stores";



const App = memo(() => {
  const appDispatch = useAppDispatch()


  return (<div className="zf-app">
      {useRoutes(routes)}
    </div>
  )
})

export default App;
