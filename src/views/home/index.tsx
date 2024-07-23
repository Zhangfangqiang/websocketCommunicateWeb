import "./style.scss"
import {memo, useState} from 'react'
import {withRouter} from "@/hoc"
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';


type MenuItem = Required<MenuProps>['items'][number];

const Index = memo((props: { router: any }) => {

  const [collapsed, setCollapsed] = useState(true);
  const items: MenuItem[] = [
    {
      key: 'sub1',
      label: '好友',
      icon: <MailOutlined/>,
    },
    {
      key: 'sub1',
      label: '群聊',
      icon: <MailOutlined/>,
    },
  ]






  return (
    <div className="zf-home-page">


      <Menu
        inlineCollapsed={collapsed}
        onClick={() => {
          setCollapsed(!collapsed);
        }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
      />


    </div>
  );
});

export default withRouter(Index);
