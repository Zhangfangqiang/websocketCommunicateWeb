import {withRouter} from "@/hoc"
import {useAppDispatch} from "@/stores";
import {Avatar, Input, List} from 'antd';
import {getUserFriends} from "@/services";
import useUserData from "@/hooks/useUserData";
import {memo, useEffect, useState} from 'react'
import {changeFriendsAction} from "@/stores/modules/user";
import {SearchOutlined, UserOutlined} from "@ant-design/icons";

const Index = memo((props: { router: any }) => {
  const {friends} = useUserData()
  const [userSearchName , setUserSearchName] = useState("")
  const appDispatch = useAppDispatch()


  useEffect(() => {
    getUserFriends().then(res => {
      appDispatch(changeFriendsAction(res.data))
    })
  }, []);


  return (
    <div className="zf-friends">
      <Input
        onChange={(e) => {
          setUserSearchName(e.target.value);
        }}
        placeholder="搜索好友"
        prefix={<UserOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}
        suffix={
          <SearchOutlined style={{color: 'rgba(0,0,0,.45)'}}/>
        }
      />

      <List
        dataSource={userSearchName != "" ? friends.filter(item => item.friend.name.toLowerCase().includes(userSearchName.toLowerCase())) : friends}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={<Avatar src={item.friend.avatar}/>}
              title={item.friend.name}
              description={item.friend.introduction}/>
            <div style={{marginLeft: 20}}>
              <span>在线</span>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
});

export default withRouter(Index);
