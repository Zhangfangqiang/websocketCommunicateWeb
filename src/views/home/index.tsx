import "./style.scss"
import Friends from "./friends"
import {Flex, Menu} from 'antd';
import {withRouter} from "@/hoc"
import classNames from 'classnames';
import {useAppDispatch} from "@/stores";
import useUserData from "@/hooks/useUserData";
import {memo, useEffect, useState} from 'react'
import {changeSelectMenuKeyAction} from "@/stores/modules/user";
import Chat from "@/views/home/chat";

const Index = memo((props: { router: any }) => {

  const appDispatch = useAppDispatch()
  const {userMenu, selectMenuKey, friendsOrGroups} = useUserData()
  const [collapsed, setCollapsed] = useState(true);


  useEffect(() => {


  }, []);


  return (
      <div className="zf-home-page">
        <Flex>
          <Menu
              className={classNames({
                'zf-menu-expand': !collapsed,
                'zf-menu-recoil': collapsed,
              })}
              inlineCollapsed={collapsed}
              onClick={(e) => {
                appDispatch(changeSelectMenuKeyAction(e.key))

                switch (e.key) {
                  case '10':
                    setCollapsed(!collapsed);
                    break
                  case '11':
                    console.log("退出登录")
                    break
                }
              }}
              defaultSelectedKeys={[selectMenuKey]}
              mode="inline"
              items={userMenu}
              style={{height: "100vh"}}
          />

          {/*好友列表开始*/}
          <Friends></Friends>
          {/*好友列表结束*/}


          {/*聊天窗口开始*/}
          <Chat></Chat>
          {/*聊天窗口结束*/}


        </Flex>

      </div>
  );
});

export default withRouter(Index);
