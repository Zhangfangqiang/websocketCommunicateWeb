import {withRouter} from "@/hoc"
import classNames from "classnames";
import {useAppDispatch} from "@/stores";
import {Avatar, Input, List} from 'antd';
import useUserData from "@/hooks/useUserData";
import {memo, useEffect, useState} from 'react'
import {postGetFriendsOrGroup, postMessagesIndex} from "@/services";
import {SearchOutlined, UserOutlined} from "@ant-design/icons";
import {changeChooseUserAction, changeFriendsOrGroupsAction, changeMessageListAction} from "@/stores/modules/user";
import {getContentByType} from "@/utils/common";
import moment from "moment";
import {BASE_URL} from "@/services/axios/config";

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
        if ((selectMenuKey === "2" || selectMenuKey === "3") && chooseUser.uuid.length > 0) {
            console.log({type: `${parseInt(selectMenuKey) - 1}`, to_user_id: chooseUser.uuid})
            postMessagesIndex({type: `${parseInt(selectMenuKey) - 1}`, to_user_id: chooseUser.uuid}).then(res => {
                let data = res.data
                let comments = []

                for (var i = 0; i < data.length; i++) {
                    let contentType = data[i].contentType
                    let content = getContentByType(contentType, data[i].url, data[i].content)

                    let comment = {
                        author: data[i].fromUsername,
                        avatar: BASE_URL + "/file/" + data[i].avatar,
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
