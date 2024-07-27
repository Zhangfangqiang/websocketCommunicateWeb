import {withRouter} from "@/hoc"
import classNames from "classnames";
import {useAppDispatch} from "@/stores";
import {Avatar, Input, List} from 'antd';
import useUserData from "@/hooks/useUserData";
import {memo, useEffect, useState} from 'react'
import {postGetFriendsOrGroup} from "@/services";
import {SearchOutlined, UserOutlined} from "@ant-design/icons";
import {changeChooseUserAction, changeFriendsOrGroupsAction} from "@/stores/modules/user";

const Index = memo((props: { router: any }) => {
    const {friendsOrGroups, chooseUser, selectMenuKey} = useUserData()
    const [userSearchName, setUserSearchName] = useState("")
    const appDispatch = useAppDispatch()


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
    }, [selectMenuKey]);

    useEffect(() => {

        console.log(chooseUser)

    }, [chooseUser]);

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
                dataSource={userSearchName != "" ? friendsOrGroups.filter(item => item.name.toLowerCase().includes(userSearchName.toLowerCase())) : friendsOrGroups}
                renderItem={(item) => (
                    <List.Item key={item.id}
                               className={
                                   classNames({
                                       'zf-select-user': item.uuid === chooseUser.uuid,
                                   })
                               }
                               onClick={() => {
                                   /*选择用户列表的信息*/
                                   appDispatch(changeChooseUserAction(item))
                               }}>
                        <List.Item.Meta

                            avatar={<Avatar src={item.avatar}/>}
                            title={item.name}
                            description={item.introduction}/>
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
