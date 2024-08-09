import "./style.scss"
import Friends from "./friends"
import {Avatar, Flex, Menu} from 'antd';
import {withRouter} from "@/hoc"
import {memo, useState} from 'react'
import classNames from 'classnames';
import Chat from "@/views/home/chat";
import ls from "@/utils/localStorage"
import {useAppDispatch} from "@/stores";
import useUserData from "@/hooks/useUserData";
import {changeSelectMenuKeyAction, changeUserInfoAction} from "@/stores/modules/user";
import {BarsOutlined, PoweroffOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";

const Index = memo((props: { router: any }) => {
  const appDispatch = useAppDispatch()
  const {selectMenuKey} = useUserData()
  const [collapsed, setCollapsed] = useState(true);

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
                ls.setItem("userInfo", JSON.stringify(""))
                appDispatch(changeUserInfoAction(null))
                break
            }
          }}
          defaultSelectedKeys={[selectMenuKey]}
          mode="inline"
          items={[
            {
              key: '1',
              label: '用户名称',
              icon: <Avatar size={20}>张</Avatar>,
            },
            {
              key: '2',
              label: '好友',
              icon: <UserOutlined/>,
            },
            {
              key: '3',
              label: '群聊',
              icon: <TeamOutlined/>,
            },
            {
              key: '10',
              label: '展开',
              icon: <BarsOutlined/>,
            },
            {
              key: '11',
              label: '退出',
              icon: <PoweroffOutlined/>,
            }
          ]}
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
