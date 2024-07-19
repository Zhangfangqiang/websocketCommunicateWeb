/*官方组件开始*/
import React from 'react';
import {Provider} from "react-redux";
import ReactDOM from 'react-dom/client';
import {HashRouter} from "react-router-dom"

/*自定义组件*/
import "normalize.css"                            //兼容平板和电脑端的方案
import 'dayjs/locale/zh-cn';                      //中文国际化
import App from './App';                          //根组件
import store from '@/stores'                      //store数据仓储
import zhCN from 'antd/locale/zh_CN';             //国际化中文
import {ConfigProvider} from "antd";


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <HashRouter>
      <ConfigProvider locale={zhCN} theme={{"token": {"colorPrimary": "green", "colorInfo": "green"}}}>
        <App/>
      </ConfigProvider>
    </HashRouter>
  </Provider>
);

