import moment from 'moment';
import {withRouter} from "@/hoc"
import classNames from "classnames";
import {Message} from "./proto/message"
import {useAppDispatch} from "@/stores";
import {memo, useEffect, useRef, useState} from 'react'
import useUserData from "@/hooks/useUserData";
import {MoreOutlined} from "@ant-design/icons";
import {checkMediaPermission, getContentByType} from "@/utils/common";
import {WS_BASE_URL} from "@/services/axios/config"
import * as Constant from '@/common/constant/Constant'
import ChatFile from "@/views/home/chat/c-cpns/ChatFile";
import InfiniteScroll from 'react-infinite-scroll-component';
import {Avatar, Button, Card, Divider, Dropdown, Form, Input, List, MenuProps, Skeleton, Space} from "antd";
import {
  changeFriendsOrGroupsAction,
  changeMessageListAction,
  changeMessageListActionThunk,
  changeOnlineTypeAction,
} from "@/stores/modules/user";
import ChatAudio from "@/views/home/chat/c-cpns/ChatAudio";
import {useNotification} from "@/components/NotificationContext";
import ChatWindowDetails from "@/views/home/chat/c-cpns/ChatWindowDetails";


const Index = memo((props: { router: any }) => {
  const [textForm] = Form.useForm();
  const { api } = useNotification();
  const appDispatch = useAppDispatch()
  const {chooseUser, messageList, userInfo, onlineType ,selectMenuKey,friendsOrGroups} = useUserData()
  const chooseUserRef = useRef(chooseUser);
  const onlineTypeRef = useRef(onlineType);
  const friendsOrGroupsRef = useRef(friendsOrGroups);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [chatWindowDetails, setChatWindowDetails] = useState(true)

  /*外抛选中用户信息*/
  useEffect(() => {
    chooseUserRef.current = chooseUser;
  }, [chooseUser]);

  /*外抛来电类型*/
  useEffect(() => {
    onlineTypeRef.current = onlineType;
  }, [onlineType]);

  /*外抛用户信息*/
  useEffect(() => {
    friendsOrGroupsRef.current = friendsOrGroups;
  }, [friendsOrGroups]);

  /*初始化连接*/
  useEffect(() => {
    connection()
  }, [])

  /*监听消息列表*/
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messageList]);

  var lockConnection = false;

  /**
   * 心跳检测
   */
  const heartCheck = {
    timeout: 10000,
    timeoutObj: null,
    serverTimeoutObj: null,
    num: 3,
    start: function () {
      var self = this;
      var _num = this.num

      /*清除之前的定时器*/
      // @ts-ignore
      this.timeoutObj && clearTimeout(this.timeoutObj);
      // @ts-ignore
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);

      /*设置客户端心跳检测定时器*/
      // @ts-ignore
      this.timeoutObj = setTimeout(function () {

        /*发送心跳消息*/
        let data = {
          type: "heatbeat",
          content: "ping",
        }

        /*WebSocket 连接状态为 OPEN*/
        // @ts-ignore
        if (window.socket.readyState === 1) {
          const messagePB = Message.create(data)
          // @ts-ignore
          window.socket.send(Message.encode(messagePB).finish())
        }
        // @ts-ignore
        self.serverTimeoutObj = setTimeout(function () {
          _num--
          if (_num <= 0) {
            console.log("the ping num is more then 3, close socket!")
            // @ts-ignore
            window.socket.close();   // WebSocket 连接状态为 OPEN
          }
        }, self.timeout);
      }, this.timeout)
    }
  }


  /**
   * websocket连接
   */
  const connection = () => {
    // @ts-ignore
    window.peer = new RTCPeerConnection();
    // @ts-ignore
    window.socket = new WebSocket(WS_BASE_URL + "/v1/socket.io?user=" + userInfo?.data?.uuid)

    let image = document.getElementById('receiver');

    /**
     * 打开链接
     */
    // @ts-ignore
    window.socket.onopen = () => {
      heartCheck.start()      //心跳检测开启
      webrtcConnection()
    }

    /**
     * 监听webSocket的消息
     * @param message
     */
    // @ts-ignore
    window.socket.onmessage = (message: MessageEvent) => {
      heartCheck.start()
      let chooseUser = chooseUserRef.current;                //获取选中用户
      let reader = new FileReader();              //创建 FileReader 对象以读取二进制数据
      reader.readAsArrayBuffer(message.data);                //将收到的 blob 对象读取为 ArrayBuffer

      reader.onload = ((event: ProgressEvent<FileReader>) => {
        // @ts-ignore
        const messagePB = Message.decode(new Uint8Array(event.target.result as ArrayBuffer));

        /*心跳检测保持链接*/
        if (messagePB.type === "heatbeat") {
          return;
        }

        /*处理 WebRTC 消息 | 接受语音电话或者视频电话 webrtc*/
        if (messagePB.type === Constant.MESSAGE_TRANS_TYPE) {
          dealWebRtcMessage(messagePB)
          return;
        }

        /*如果该消息不是正在聊天消息，显示未读提醒*/
        if (chooseUser.uuid !== messagePB.from) {

          /*做一个简单的消息未读, 服务器还要做设置*/
          let arrData = friendsOrGroupsRef.current.map((item: any) => {
            if (item.uuid === messagePB.from) {
              return { ...item, unMessage: item.unMessage + 1 };
            }
            return item;
          });

          appDispatch(changeFriendsOrGroupsAction(arrData))

          console.log('999999999999999')
          console.log( messagePB.content)
          api.open({
            message: '您收到一条新消息',
            description: messagePB.content,
          });
          return;
        }

        /*视频图像*/
        if (messagePB.contentType === 8) {
          // @ts-ignore
          image.src = messagePB.content
          return;
        }

        // 屏幕共享
        if (messagePB.contentType === 9) {
          // @ts-ignore
          image.src = messagePB.content
          return;
        }

        console.log("messagePB",messagePB)
        // 文件内容，录制的视频，语音内容
        // @ts-ignore
        appDispatch(
          changeMessageListActionThunk({
            author: messagePB.fromUsername,
            avatar: messagePB.avatar,     //用户头像
            content: <p>{getContentByType(messagePB.contentType, messagePB.url, messagePB.content)}</p>,
            datetime: moment().fromNow(),
          }))
      })
    }

    /**
     * 监听关闭重连
     */
    // @ts-ignore
    window.socket.onclose = (_message: CloseEvent) => {
      console.log("close and reconnect-->--->")
      reconnect()
    }

    /**
     * 监听错误重连
     */
    // @ts-ignore
    window.socket.onerror = (_message: Event) => {
      console.log("error----->>>>")
      reconnect()
    }
  }


  /**
   * 断开连接后重新连接
   */
  let reconnectTimeoutObj: any = null;
  const reconnect = () => {
    if (lockConnection) {
      return
    }
    lockConnection = true
    reconnectTimeoutObj && clearTimeout(reconnectTimeoutObj)
    reconnectTimeoutObj = setTimeout(() => {
      // @ts-ignore
      if (window.socket.readyState !== 1) {
        connection()
      }
      lockConnection = false
    }, 10000)
  }


  /**
   * 发送消息
   * @param {消息内容} messageData
   */
  const sendMessage = (messageData: any) => {
    let toUser = messageData.toUser;

    if (null == toUser) {
      toUser = chooseUser.uuid;
    }

    let data = {
      ...messageData,
      messageType: selectMenuKey ? (parseInt(selectMenuKey) - 1) : 1,               // 消息类型，1.单聊 2.群聊
      fromUsername: userInfo?.data?.name,
      from: userInfo?.data?.uuid,
      avatar: userInfo?.data?.avatar,
      to: toUser,
    }


    const messagePB = Message.create(data)

    // @ts-ignore
    window.socket.send(Message.encode(messagePB).finish())
  }


  /**
   * 在消息面板 添加消息
   * @param {消息内容，包括图片视频消息标签} content
   */
  const appendMessage = (content: any) => {

    appDispatch(changeMessageListAction(
      [
        ...messageList,
        {
          author: userInfo?.data?.name,
          avatar: userInfo?.data?.avatar,
          datetime: moment().fromNow(),
          content: <p>{content}</p>,
        },
      ]
    ))
  }

  /**
   * 在消息列表添加图片
   * @param imgData
   */
  const appendImgToPanel = (imgData: ArrayBuffer) => {
    // 将ArrayBuffer转换为base64进行展示
    var binary = '';
    var bytes = new Uint8Array(imgData);
    var len = bytes.byteLength;

    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    let base64String = `data:image/jpeg;base64,${window.btoa(binary)}`;

    appendMessage(<img src={base64String} alt="" width="150px"/>);
  }

  /**
   * webrtc 绑定事件
   */
  const webrtcConnection = () => {
    /**
     * 对等方收到ice信息后，通过调用 addIceCandidate 将接收的候选者信息传递给浏览器的ICE代理。
     * @param {候选人信息} e
     */
    // @ts-ignore
    window.peer.onicecandidate = (e) => {
      if (e.candidate) {
        // rtcType参数默认是对端值为answer，如果是发起端，会将值设置为offer
        let candidate = {
          type: 'answer_ice',
          iceCandidate: e.candidate
        }
        let message = {
          content: JSON.stringify(candidate),
          type: Constant.MESSAGE_TRANS_TYPE,
        }
        sendMessage(message);
      }

    };

    /**
     * 当连接成功后，从里面获取语音视频流
     * @param {包含语音视频流} e
     */
    // @ts-ignore
    window.peer.ontrack = (e) => {
      if (e && e.streams) {

        if (onlineType === 1) {
          let remoteVideo = document.getElementById("remoteVideoReceiver");
          // @ts-ignore
          remoteVideo.srcObject = e.streams[0];
        } else {
          let remoteAudio = document.getElementById("audioPhone");
          // @ts-ignore
          remoteAudio.srcObject = e.streams[0];
        }
      }
    };
  }

  /**
   * 处理webrtc消息，包括获取请求方的offer，回应answer等
   * @param {消息内容}} messagePB
   */
  const dealWebRtcMessage = (messagePB: Message) => {
    let preview: HTMLVideoElement | HTMLAudioElement | null = null;
    let video = false;

    const data = JSON.parse(messagePB.content);

    //发送
    // if (data.type === "answer") {
    // peer.localPeer.setRemoteDescription(new RTCSessionDescription({sdp: data.sdp, type: data.type}))
    // }
    //发送
    // if (data.type === "answer_ice") {
    //   console.log("peer.localPeer",peer.localPeer)
    // peer.localPeer.addIceCandidate(data.iceCandidate)     //添加 ICE 候选
    // }


    if (data.type === "offer_ice") {
      // @ts-ignore
      if (window.peer && window.peer.remoteDescription) {
        // @ts-ignore
        window.peer.addIceCandidate(iceCandidate);
      }
    }

    if (data.type === "offer") {
      if (!checkMediaPermission()) {
        return;
      }

      if (messagePB.contentType === Constant.VIDEO_ONLINE) {
        /*视频聊天*/
        preview = document.getElementById("localVideoReceiver") as HTMLVideoElement;
        video = true
        appDispatch(changeOnlineTypeAction(1))
      } else {
        /*语音聊天*/
        preview = document.getElementById("audioPhone") as HTMLAudioElement;
        appDispatch(changeOnlineTypeAction(2))
      }

      navigator.mediaDevices.getUserMedia({audio: true, video: video}).then((stream) => {
        if (!preview) {
          return;
        }

        preview.srcObject = stream;

        stream.getTracks().forEach(track => {
          // @ts-ignore
          if (window.peer) {
            // @ts-ignore
            window.peer.addTrack(track, stream);
          }
        });

        // 一定注意：需要将该动作，放在这里面，即流获取成功后，再进行answer创建。不然不能获取到流，从而不能播放视频。

        // @ts-ignore
        window.peer.setRemoteDescription(new RTCSessionDescription({sdp: data.sdp, type: data.type})).then(() => {
          // @ts-ignore
          window.peer.createAnswer().then((answer: RTCSessionDescriptionInit) => {

            console.log(answer)
            // @ts-ignore
            window.peer.setLocalDescription(answer)

            //发送消息
            sendMessage({
              content: JSON.stringify(answer),
              type: Constant.MESSAGE_TRANS_TYPE,
              messageType: messagePB.contentType
            });
          })
        });
      });
    }
  }


  return (
    <div className="zf-chat">
      <Card title={chooseUser.name} bordered={false} extra={<MoreOutlined onClick={()=>{
        setChatWindowDetails(!chatWindowDetails)
      }}/>}>

        {/*消息列表开始*/}
        <div id="scrollableDiv" ref={listRef} style={{height: "60vh", overflow: 'auto', padding: '0 16px'}}>
          <InfiniteScroll
            dataLength={200} // 当前列表长度
            hasMore={false} // 是否还有更多数据
            loader={<Skeleton avatar paragraph={{rows: 1}} active/>} // 加载时的 loading 组件
            scrollableTarget="scrollableDiv" // 滚动的目标元素
            inverse={true} // 启用反向滚动，即向上滚动加载历史数据
            next={() => {
              console.log("反方向加载之前的历史数据")
            }}>

            <List
              dataSource={messageList}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    style={{marginBottom: 10}}
                    className={classNames({
                      'zf-reverse-list': item.author === userInfo?.data?.name,
                    })}
                    avatar={<Avatar src={item.avatar}/>}
                    title={`${item.author} - ${item.datetime}`}
                    description={item.content}
                  />
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>
        {/*消息列表结束*/}

        {/*分割线开始*/}
        <Divider style={{margin: 0}}></Divider>
        {/*分割线结束*/}

        {/*功能菜单开始*/}
        <Space.Compact block style={{marginTop:5,marginBottom:5}}>
          <ChatFile sendMessage={sendMessage} appendImgToPanel={appendImgToPanel} appendMessage={appendMessage}/>
          <ChatAudio sendMessage={sendMessage} appendImgToPanel={appendImgToPanel} appendMessage={appendMessage}/>
        </Space.Compact>
        {/*功能菜单结束*/}

        {/*表单发送开始*/}
        <Form form={textForm} onFinish={(values) => {
          if (values.content.length === 0) {
            return;
          }

          let message = {
            content: values.content,
            contentType: 1,
          }

          sendMessage(message)
          appendMessage(values.content);
          textForm.resetFields();
        }}>
          <Form.Item name="content">
            <Input.TextArea
              rows={7}
              showCount
              maxLength={1000}
              style={{height: "180px", resize: 'none', border: "none"}}
              onKeyDown={(e) => {
                // 如果按下的是回车键且没有按住 Shift 键
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); // 阻止默认的回车键行为（换行）
                  textForm.submit(); // 提交表单
                }
              }}
            />
          </Form.Item>
          <Form.Item>
            <Space style={{float: "right"}}>
              <Button htmlType="reset">清除</Button>
              <Button type="primary" htmlType="submit">发送</Button>
            </Space>
          </Form.Item>
        </Form>
        {/*表单发送结束*/}
      </Card>

      {chatWindowDetails &&
        <ChatWindowDetails></ChatWindowDetails>
      }







      <div style={{display: "none"}}>
        <audio id="audioPhone" autoPlay controls/>
        <video id="remoteVideoReceiver" width="700px" height="auto" autoPlay muted controls/>
      </div>

    </div>
  );
});

export default withRouter(Index);
