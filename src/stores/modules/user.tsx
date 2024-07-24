import {ReactNode} from "react";
import {createSlice} from '@reduxjs/toolkit'
import {BarsOutlined, PoweroffOutlined, TeamOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar} from "antd";
import ls from "@/utils/localStorage"


interface userInfoInterface {
  data?: {
    id: number;
    uuid: string;
    city: string;
    introduction: string;
    avatar: string;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
  };
  token: string;
}

export interface initialStateInterface {
  userInfo: userInfoInterface | null
  userMenu: {
    key: string,
    label: string,
    icon: ReactNode,
  }[]
  selectMenuKey: string
  friends: {
    "id": number,
    "userId": number,
    "friendId": number,
    "user": {
      "id": number,
      "uuid": string,
      "city": string,
      "introduction": string,
      "avatar": string,
      "name": string,
      "created_at": string,
      "updated_at": string,
      "deleted_at": string
    },
    "friend": {
      "id": number,
      "uuid": string,
      "city": string,
      "introduction": string,
      "avatar": string,
      "name": string,
      "created_at": string,
      "updated_at": string,
      "deleted_at": string
    },
    "created_at": string,
    "updated_at": string,
    "deleted_at": string
  }[] | []


  chooseUser:any,
  messageList:any[],
  socket:any,
  onlineType: number, // 在线视频或者音频： 1视频，2音频
  currentScreen: {
    height: number,
    width: number
  },
  callName: string,
  fromUserUuid: string,
}


const initialState: initialStateInterface = {
  userInfo: ls.getItem("userInfo"),
  userMenu: [
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
  ],
  selectMenuKey: '2',
  friends: [],



  chooseUser:{},
  messageList:[],

  socket:{},
  onlineType:1,
  currentScreen: {
    height: 540,
    width: 400
  },
  callName: '',
  fromUserUuid: '',
}

/**
 * 修改内容的东西
 */
const ActivationCodeSlice = createSlice({
  name: "verifyCodes",
  initialState,
  reducers: {
    changeUserInfoAction(state, {payload}) {
      ls.setItem("userInfo",payload)
      state.userInfo = payload
    },

    changeSocketAction(state, {payload}){
      state.socket = payload
    },
    changeOnlineTypeAction(state, {payload}){
      state.onlineType = payload
    },

    changeUserMenuAction(state, {payload}) {
      state.userMenu = payload
    },
    changeSelectMenuKeyAction(state, {payload}) {
      state.selectMenuKey = payload
    },
    changeFriendsAction(state, {payload}){
      state.friends = payload
    }
  },
})

export const {
  changeUserInfoAction,
  changeSocketAction,
  changeFriendsAction,
  changeUserMenuAction,
  changeOnlineTypeAction,
  changeSelectMenuKeyAction
} = ActivationCodeSlice.actions

export default ActivationCodeSlice.reducer
