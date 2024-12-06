import moment from "moment";
import {withRouter} from "@/hoc"
import classNames from "classnames";
import {useAppDispatch} from "@/stores";
import useUserData from "@/hooks/useUserData";
import {memo, useEffect, useState} from 'react'
import {getContentByType} from "@/utils/common";
import {ClockCircleOutlined, SearchOutlined, UserAddOutlined, UserOutlined} from "@ant-design/icons";
import {Avatar, Badge, Button, Input, List, message, Modal, Popconfirm, Skeleton, Space} from 'antd';
import {
  deleteExitGroup,
  deleteUserFriends, postAddGroup,
  postGetFriendsOrGroup,
  postMessagesIndex,
  postSearchForUsersOrGroups, postUserFriends
} from "@/services";
import {
  changeChooseUserAction,
  changeFriendsOrGroupsAction,
  changeMessageListAction,
  changeSearchForUsersOrGroupsDataAction
} from "@/stores/modules/user";
import InfiniteScroll from "react-infinite-scroll-component";

const Index = memo((props: { router: any }) => {
  const {friendsOrGroups, chooseUser, selectMenuKey, searchForUsersOrGroupsData} = useUserData()
  const [userSearchName, setUserSearchName] = useState("")
  const appDispatch = useAppDispatch()
  const [modalPoP, setModalPoP] = useState(false)


  useEffect(() => {
    postGetFriendsOrGroup({type: "1"}).then(res => {
      appDispatch(changeFriendsOrGroupsAction(res.data))
    })
  }, []);

  useEffect(() => {
    if (selectMenuKey === "2" || selectMenuKey === "3") {
      postGetFriendsOrGroup({type: `${parseInt(selectMenuKey) - 1}`}).then(res => {
        appDispatch(changeFriendsOrGroupsAction(res.data))
      })
    }
    setUserSearchName("")
  }, [selectMenuKey]);

  useEffect(() => {
    if ((selectMenuKey === "2" || selectMenuKey === "3") && chooseUser.uuid.length > 0) {

      postMessagesIndex({type: `${parseInt(selectMenuKey) - 1}`, to_user_id: chooseUser.uuid}).then(res => {
        let data = res.data
        let comments = []

        for (var i = 0; i < data.length; i++) {
          let contentType = data[i].contentType
          let content = getContentByType(contentType, data[i].url, data[i].content)

          let comment = {
            author: data[i].fromUsername,
            avatar: data[i].avatar,
            content: <p>{content}</p>,
            datetime: moment(data[i].createAt).fromNow(),
          }
          comments.push(comment)
        }

        appDispatch(changeMessageListAction(comments))
      })
    }
  }, [chooseUser]);


  return (
    <div className="zf-friends">
      <Space.Compact style={{width: '100%',marginTop:10}}>
        <Input
          onChange={(e) => {
            setUserSearchName(e.target.value);
          }}
          value={userSearchName}
          placeholder={selectMenuKey === "2" ? "搜索好友" : "搜索群"}
          prefix={<UserOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}
          suffix={<SearchOutlined style={{color: 'rgba(0,0,0,.45)'}}/>}
        />
        <Button onClick={() => {
          if (selectMenuKey === "2" || selectMenuKey === "3") {

            if(userSearchName.length === 0){
              message.error("请输入搜索条件")
              return
            }

            postSearchForUsersOrGroups({type: `${parseInt(selectMenuKey) - 1}`, name: userSearchName}).then(res => {
              appDispatch(changeSearchForUsersOrGroupsDataAction(res.data))
              setModalPoP(true)
            })
          }
        }}><UserAddOutlined/></Button>
      </Space.Compact>

      <InfiniteScroll
        style={{height:"calc(100vh - 50px)"}}
        dataLength={userSearchName != "" ? friendsOrGroups.filter(item => item.name.toLowerCase().includes(userSearchName.toLowerCase())).length : friendsOrGroups.length} // 当前列表长度
        hasMore={false} // 是否还有更多数据
        loader={<Skeleton avatar paragraph={{rows: 1}} active/>} // 加载时的 loading 组件
        next={() => {
          console.log("反方向加载之前的历史数据")
        }}>
      <List
        dataSource={userSearchName != "" ? friendsOrGroups.filter(item => item.name.toLowerCase().includes(userSearchName.toLowerCase())) : friendsOrGroups}
        renderItem={(item, key) => (
          <List.Item key={item.id}
                     className={
                       classNames({
                         'zf-select-user': item.uuid === chooseUser.uuid,
                       })
                     }
                     actions={[
                       <Popconfirm
                         placement="bottom"
                         title="确定删除"
                         okText="确定"
                         cancelText="取消"
                         onConfirm={() => {
                           if (selectMenuKey === "2") {
                             deleteUserFriends(item.id).then(() => {
                               message.success("操作成功")
                               let data = friendsOrGroups.filter((i) => {
                                 if (i.id !== item.id) {
                                   return i
                                 }
                               })
                               appDispatch(changeFriendsOrGroupsAction(data))
                             })
                           } else {
                             deleteExitGroup(item.id).then(() => {
                               message.success("操作成功")
                               let data = friendsOrGroups.filter((i) => {
                                 if (i.id !== item.id) {
                                   return i
                                 }
                               })
                               appDispatch(changeFriendsOrGroupsAction(data))
                             })
                           }
                         }}
                       >
                         <Button type="text" size={"small"}>删除</Button>
                       </Popconfirm>,

                       <div style={{minWidth:30}}>
                         <Badge status="success" count={item.unMessage === 0 ? '' : item.unMessage}/>
                       </div>
                     ]}

                     onClick={() => {
                       /*选择用户列表的信息*/
                       appDispatch(changeChooseUserAction(item))

                       /*未读消息清空*/
                       const updatedFriendsOrGroups = [...friendsOrGroups];
                       updatedFriendsOrGroups[key] = {...updatedFriendsOrGroups[key], unMessage: 0};
                       appDispatch(changeFriendsOrGroupsAction(updatedFriendsOrGroups));
                     }}>
            <List.Item.Meta
              avatar={<Avatar src={item.avatar}/>}
              title={item.name}
              description={item.introduction}/>
          </List.Item>
        )}
      />
      </InfiniteScroll>

      {/*添加好友弹框开始*/}
      <Modal title={selectMenuKey === "2" ? "添加好友" : "添加群"} open={modalPoP} onCancel={() => {
        setModalPoP(false)
      }} footer={null} width={500}>
        <div style={{height: 500, overflowY: "auto"}}>
          <List
            dataSource={searchForUsersOrGroupsData}
            renderItem={(item) => (
              <List.Item
                actions={[<Button type="link" onClick={() => {
                  if (selectMenuKey === "2") {
                    postUserFriends({userId: item.id.toString()}).then((res) => {
                      message.success("操作成功")
                      appDispatch(changeFriendsOrGroupsAction([
                        ...friendsOrGroups,
                        {
                          id: res?.data?.id,
                          avatar: res?.data?.friend?.avatar,
                          uuid: res?.data?.friend?.uuid,
                          name: res?.data?.friend?.name,
                          introduction: res?.data?.friend?.introduction,
                        }
                      ]))
                    })
                  } else {
                    postAddGroup({group_id: item.id.toString()}).then((res) => {
                      message.success("操作成功")
                      appDispatch(changeFriendsOrGroupsAction([
                        ...friendsOrGroups,
                        {
                          id: res?.data?.id,
                          avatar: res?.data?.group?.avatar,
                          uuid: res?.data?.group?.uuid,
                          name: res?.data?.group?.name,
                          introduction: res?.data?.group?.introduction,
                        }
                      ]))
                    })
                  }
                }}> 添加</Button>]}>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar}/>}
                  title={<a href="https://ant.design">{item.name}</a>}
                  description={item.introduction}
                />
              </List.Item>
            )}
          />
        </div>
      </Modal>
      {/*添加好友弹框结束*/}
    </div>
  );
});

export default withRouter(Index);
