import {RootState} from "@/stores";
import ls from "@/utils/localStorage"
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
// import {postSearchForUsersOrGroups} from "@/services";

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
  searchForUsersOrGroupsData:{
    "id": number,
    "uuid": string,
    "city": string,
    "introduction": string,
    "avatar": string,
    "name": string,
    "created_at": string,
    "updated_at": string,
    "deleted_at": string
  }[] | []
  userInfo: userInfoInterface | null
  selectMenuKey: string
  friendsOrGroups: {
    "id": number,
    "uuid": string,
    "introduction": string,
    "avatar": string,
    "name": string,
    "unMessage":number,
    "created_at": string,
    "updated_at": string,
    "deleted_at": string
  }[] | []    //好友列表
  //选择的用户
  chooseUser: {
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
  onlineType: number,      // 收到的电话 1:视频，2:音频
  currentScreen: {
    height: number,
    width: number
  },
  callName: string,
  fromUserUuid: string,
  videoCallModal: boolean
}


const initialState: initialStateInterface = {
  searchForUsersOrGroupsData:[],
  userInfo: ls.getItem("userInfo") as userInfoInterface,
  selectMenuKey: '2',
  friendsOrGroups: [],
  chooseUser: {
    // type 1 代表用户 type 2代表群 这里以后要加
    "id": 0,
    "uuid": "",
    "city": "",
    "introduction": "",
    "avatar": "",
    "name": "",
    "created_at": "",
    "updated_at": "",
    "deleted_at": ""
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
  videoCallModal: false
}




/**
 * 修改消息列表的方法
 */
export const changeMessageListActionThunk = createAsyncThunk("changeMessageListActionThunk", (payload: any, {dispatch,getState}) => {
  const currentState = getState() as RootState;
  dispatch(changeMessageListAction(
    [
      ...currentState.user.messageList,
      payload,
    ]
  ))
})


/**
 * 修改内容的东西
 */
const ActivationCodeSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changePeerAction(state, {payload}){
      state.peer = payload
    },
    changeMediaAction(state, {payload}) {
      state.media = payload
    },
    changeSocketAction(state, {payload}) {
      state.socket = payload
    },
    changeUserInfoAction(state, {payload}) {
      ls.setItem("userInfo", payload)
      state.userInfo = payload
    },
    changeCallNameAction(state, {payload}) {
      state.callName = payload
    },
    changeOnlineTypeAction(state, {payload}) {
      state.onlineType = payload
    },
    changeChooseUserAction(state, {payload}) {
      state.chooseUser = payload
    },
    changeMessageListAction(state, {payload}) {
      state.messageList = payload
    },
    changeFromUserUuidAction(state, {payload}) {
      state.fromUserUuid = payload
    },
    changeCurrentScreenAction(state, {payload}) {
      state.currentScreen = payload
    },
    changeSelectMenuKeyAction(state, {payload}) {
      state.selectMenuKey = payload
    },
    changeVideoCallModalAction(state, {payload}) {
      state.videoCallModal = payload
    },
    changeFriendsOrGroupsAction(state, {payload}) {
      state.friendsOrGroups = payload
    },
    changeSearchForUsersOrGroupsDataAction(state, {payload}){
      state.searchForUsersOrGroupsData = payload
    }
  },
})

export const {
  changePeerAction,
  changeMediaAction,
  changeSocketAction,
  changeCallNameAction,
  changeUserInfoAction,
  changeOnlineTypeAction,
  changeChooseUserAction,
  changeMessageListAction,
  changeFromUserUuidAction,
  changeCurrentScreenAction,
  changeSelectMenuKeyAction,
  changeVideoCallModalAction,
  changeFriendsOrGroupsAction,
  changeSearchForUsersOrGroupsDataAction,
} = ActivationCodeSlice.actions

export default ActivationCodeSlice.reducer
