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
  }[] | []    //好友列表
  chooseUser: {
    toUser: string,       //接收方uuid
    toUsername: string,   //接收方用户名
    messageType: number,  //消息类型，1.单聊 2.群聊
    avatar: string,       //接收方的头像
  },
  messageList: any[],
  socket: any,
  media: {
    isRecord: boolean,
    showMediaPanel: boolean,
    mediaConnected: boolean,
    mediaReject: boolean,
  },
  peer: {
    localPeer: any,  // WebRTC peer 发起端
    remotePeer: any, // WebRTC peer 接收端
  }
  onlineType: number, // 在线视频或者音频： 1视频，2音频
  currentScreen: {
    height: number,
    width: number
  },
  callName: string,
  fromUserUuid: string,
  videoCallModal:boolean



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
  chooseUser: {
    toUser: '',
    toUsername: '',
    messageType: 1,
    avatar: '',
  },
  messageList: [],
  socket: {},
  media: {
    isRecord: false,
    showMediaPanel: false,
    mediaConnected: false,
    mediaReject: false,
  },
  peer: {
    localPeer: null,  // WebRTC peer 发起端
    remotePeer: null, // WebRTC peer 接收端
  },
  onlineType: 1,
  currentScreen: {
    height: 540,
    width: 400
  },
  callName: '',
  fromUserUuid: '',
  videoCallModal:false
}

/**
 * 修改内容的东西
 */
const ActivationCodeSlice = createSlice({
  name: "verifyCodes",
  initialState,
  reducers: {
    changeCallNameAction(state, {payload}) {
      state.callName = payload
    },
    changeFromUserUuidAction(state, {payload}) {
      state.fromUserUuid = payload
    },
    changeUserInfoAction(state, {payload}) {
      ls.setItem("userInfo", payload)
      state.userInfo = payload
    },
    changeCurrentScreenAction(state, {payload}) {
      state.currentScreen = payload
    },
    changeSocketAction(state, {payload}) {
      state.socket = payload
    },
    changeOnlineTypeAction(state, {payload}) {
      state.onlineType = payload
    },
    changeMediaAction(state, {payload}){
      state.media = payload
    },
    changeMessageListAction(state, {payload}) {
      state.messageList = payload
    },
    changeUserMenuAction(state, {payload}) {
      state.userMenu = payload
    },
    changeSelectMenuKeyAction(state, {payload}) {
      state.selectMenuKey = payload
    },
    changeFriendsAction(state, {payload}) {
      state.friends = payload
    },
    changeVideoCallModalAction(state, {payload}){
      state.videoCallModal = payload
    }
  },
})

export const {
  changeCallNameAction,
changeFromUserUuidAction,
  changeMediaAction,
  changeCurrentScreenAction,
  changeMessageListAction,
  changeUserInfoAction,
  changeSocketAction,
  changeFriendsAction,
  changeUserMenuAction,
  changeOnlineTypeAction,
  changeSelectMenuKeyAction,
changeVideoCallModalAction
} = ActivationCodeSlice.actions

export default ActivationCodeSlice.reducer