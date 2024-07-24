import {memo} from 'react'
import moment from 'moment';
import {message} from "antd";
import {withRouter} from "@/hoc"
import protobuf from './proto/proto'
import {useAppDispatch} from "@/stores";
import useUserData from "@/hooks/useUserData";
import {BASE_URL} from "@/services/axios/config"
import * as Constant from '@/common/constant/Constant'
import {changeSocketAction} from "@/stores/modules/user";
import {FileOutlined} from "@ant-design/icons";


const Index = memo((props: { router: any }) => {
  const appDispatch = useAppDispatch()
  const {onlineType,chooseUser,messageList} = useUserData()


  var peer: any = null;
  var socket: any = null;
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
        if (socket.readyState === 1) {
          let message = protobuf.lookup("protocol.Message")
          // @ts-ignore
          const messagePB = message.create(data)
          // @ts-ignore
          socket.send(message.encode(messagePB).finish())
        }

        // @ts-ignore
        self.serverTimeoutObj = setTimeout(function () {
          _num--
          if (_num <= 0) {
            console.log("the ping num is more then 3, close socket!")
            socket.close();   // WebSocket 连接状态为 OPEN
          }
        }, self.timeout);
      }, this.timeout)
    }
  }


  /**
   * websocket连接
   */
  const connection = () => {
    peer = new RTCPeerConnection();
    socket = new WebSocket("ws://" + BASE_URL + "/v1/socket.io?user=" + "uuid")
    let image = document.getElementById('receiver');

    /**
     * 打开链接
     */
    socket.onopen = () => {
      heartCheck.start()
      webrtcConnection()
      appDispatch(changeSocketAction(socket))
      // this.props.setSocket(socket);  全局保存socket
    }

    /**
     * 监听webSocket的消息
     * @param message
     */
    socket.onmessage = (message: MessageEvent) => {
      heartCheck.start()

      let messageProto = protobuf.lookup("protocol.Message") //获取协议的 message 类型
      let reader = new FileReader();              //创建 FileReader 对象以读取二进制数据
      reader.readAsArrayBuffer(message.data);                //将收到的 blob 对象读取为 ArrayBuffer

      reader.onload = ((event: ProgressEvent<FileReader>) => {
        // @ts-ignore
        let messagePB = messageProto.decode(new Uint8Array(event.target.result as ArrayBuffer))

        if (messagePB.type === "heatbeat") {
          return;
        }

        /*处理 WebRTC 消息 | 接受语音电话或者视频电话 webrtc*/
        if (messagePB.type === Constant.MESSAGE_TRANS_TYPE) {
          dealWebRtcMessage(messagePB);
          return;
        }

        /*如果该消息不是正在聊天消息，显示未读提醒*/
        if (chooseUser.toUser !== messagePB.from) {
          showUnreadMessageDot(messagePB.from);
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


        let avatar = chooseUser.avatar
        if (messagePB.messageType === 2) {
          avatar = BASE_URL + "/file/" + messagePB.avatar  //这里要改
        }

        // 文件内容，录制的视频，语音内容
        let content = getContentByType(messagePB.contentType, messagePB.url, messagePB.content)
        this.props.setMessageList([
          ...messageList,
          {
            author: messagePB.fromUsername,
            avatar: avatar,
            content: <p>{content}</p>,
            datetime: moment().fromNow(),
          },
        ]);
      })


    }

    socket.onclose = (_message:CloseEvent) => {
      console.log("close and reconnect-->--->")

      reconnect()
    }

    socket.onerror = (_message:Event) => {
      console.log("error----->>>>")

      reconnect()
    }
  }

  /**
   * 断开连接后重新连接
   */
  let reconnectTimeoutObj: any = null;
  const reconnect = () => {
    if (lockConnection) return;
    lockConnection = true

    reconnectTimeoutObj && clearTimeout(reconnectTimeoutObj)

    reconnectTimeoutObj = setTimeout(() => {
      if (socket.readyState !== 1) {
        connection()
      }
      lockConnection = false
    }, 10000)
  }

  /**
   * 检查媒体权限是否开启
   * @returns 媒体权限是否开启
   */
  const checkMediaPermission = (): boolean => {
    // @ts-ignore
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (!navigator || !navigator.mediaDevices) {
      message.error("获取摄像头权限失败！")
      return false;
    }
    return true;
  };

  /**
   * 发送消息
   * @param {消息内容} messageData
   */
  const sendMessage = (messageData) => {
    let toUser = messageData.toUser;
    if (null == toUser) {
      toUser = chooseUser.toUser;
    }
    let data = {
      ...messageData,
      messageType: chooseUser.messageType, // 消息类型，1.单聊 2.群聊
      fromUsername: localStorage.username,
      from: localStorage.uuid,
      to: toUser,
    }
    let message = protobuf.lookup("protocol.Message")
    const messagePB = message.create(data)

    socket.send(message.encode(messagePB).finish())
  }

  /**
   * 根据文件类型渲染对应的标签，比如视频，图片等。
   * @param {文件类型} type
   * @param {文件地址} url
   * @returns
   */
  const getContentByType = (type, url, content) => {
    if (type === 2) {
      content = <FileOutlined style={{ fontSize: 38 }} />
    } else if (type === 3) {
      content = <img src={BASE_URL + "/file/" + url} alt="" width="150px" />
    } else if (type === 4) {
      content = <audio src={BASE_URL + "/file/" + url} controls autoPlay={false} preload="auto" />
    } else if (type === 5) {
      content = <video src={BASE_URL + "/file/" + url} controls autoPlay={false} preload="auto" width='200px' />
    }

    return content;
  }


  /**
   * webrtc 绑定事件
   */
  const webrtcConnection = () => {
    /**
     * 对等方收到ice信息后，通过调用 addIceCandidate 将接收的候选者信息传递给浏览器的ICE代理。
     * @param {候选人信息} e
     */
    peer.onicecandidate = (e) => {
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
    peer.ontrack = (e: any) => {
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
   * 停止视频电话,屏幕共享
   */
  const stopVideoOnline = () => {
    this.setState({
      isRecord: false
    })

    let localVideoReceiver = document.getElementById("localVideoReceiver");
    if (localVideoReceiver && localVideoReceiver.srcObject && localVideoReceiver.srcObject.getTracks()) {
      localVideoReceiver.srcObject.getTracks().forEach((track) => track.stop());
    }

    let preview = document.getElementById("preview");
    if (preview && preview.srcObject && preview.srcObject.getTracks()) {
      preview.srcObject.getTracks().forEach((track) => track.stop());
    }

    let audioPhone = document.getElementById("audioPhone");
    if (audioPhone && audioPhone.srcObject && audioPhone.srcObject.getTracks()) {
      audioPhone.srcObject.getTracks().forEach((track) => track.stop());
    }

    // 停止视频或者屏幕共享时，将画布最小
    let currentScreen = {
      width: 0,
      height: 0
    }
    this.setState({
      currentScreen: currentScreen
    })
  }

  /**
   * 显示视频或者音频的面板
   */
  const mediaPanelDrawerOnClose = () => {
    let media = {
      ...this.props.media,
      showMediaPanel: false,
    }
    this.props.setMedia(media)
  }

  /**
   * 如果接收到的消息不是正在聊天的消息，显示未读提醒
   * @param {发送给对应人员的uuid} toUuid
   */
  const showUnreadMessageDot = (toUuid) => {
    let userList = this.props.userList;
    for (var index in userList) {
      if (userList[index].uuid === toUuid) {
        userList[index].hasUnreadMessage = true;
        this.props.setUserList(userList);
        break;
      }
    }
  }

  /**
   * 接听电话后，发送接听确认消息，显示媒体面板
   */
  const handleOk = () => {
    this.setState({
      videoCallModal: false,
    })
    let data = {
      contentType: Constant.ACCEPT_VIDEO_ONLINE,
      type: Constant.MESSAGE_TRANS_TYPE,
      toUser: this.state.fromUserUuid,
    }
    sendMessage(data);

    let media = {
      ...this.props.media,
      showMediaPanel: true,
    }
    this.props.setMedia(media)
  }

  /**
   * 关闭方法
   */
  const handleCancel = () => {
    let data = {
      contentType: Constant.REJECT_VIDEO_ONLINE,
      type: Constant.MESSAGE_TRANS_TYPE,
    }
    sendMessage(data);
    this.setState({
      videoCallModal: false,
    })
  }

  /**
   * 交易媒体电话
   * @param message
   */
  const dealMediaCall = (message) => {
    if (message.contentType === Constant.DIAL_AUDIO_ONLINE || message.contentType === Constant.DIAL_VIDEO_ONLINE) {
      this.setState({
        videoCallModal: true,
        callName: message.fromUsername,
        fromUserUuid: message.from,
      })
      return;
    }

    if (message.contentType === Constant.CANCELL_AUDIO_ONLINE || message.contentType === Constant.CANCELL_VIDEO_ONLINE) {
      this.setState({
        videoCallModal: false,
      })
      return;
    }

    if (message.contentType === Constant.REJECT_AUDIO_ONLINE || message.contentType === Constant.REJECT_VIDEO_ONLINE) {
      let media = {
        ...this.props.media,
        mediaReject: true,
      }
      this.props.setMedia(media);
      return;
    }

    if (message.contentType === Constant.ACCEPT_VIDEO_ONLINE || message.contentType === Constant.ACCEPT_AUDIO_ONLINE) {
      let media = {
        ...this.props.media,
        mediaConnected: true,
      }
      this.props.setMedia(media);
    }
  }

  /**
   * 处理webrtc消息，包括获取请求方的offer，回应answer等
   * @param {消息内容}} messagePB
   */
  const dealWebRtcMessage = (messagePB) => {
    if (messagePB.contentType >= Constant.DIAL_MEDIA_START && messagePB.contentType <= Constant.DIAL_MEDIA_END) {
      dealMediaCall(messagePB);
      return;
    }
    const {type, sdp, iceCandidate} = JSON.parse(messagePB.content);

    if (type === "answer") {
      const answerSdp = new RTCSessionDescription({type, sdp});
      this.props.peer.localPeer.setRemoteDescription(answerSdp)
    } else if (type === "answer_ice") {
      this.props.peer.localPeer.addIceCandidate(iceCandidate)
    } else if (type === "offer_ice") {
      peer.addIceCandidate(iceCandidate)
    } else if (type === "offer") {
      if (!checkMediaPermission()) {
        return;
      }
      let preview :any

      let video = false;
      if (messagePB.contentType === Constant.VIDEO_ONLINE) {
        preview = document.getElementById("localVideoReceiver");
        video = true
        this.setState({
          onlineType: 1,
        })
      } else {
        preview = document.getElementById("audioPhone");
        this.setState({
          onlineType: 2,
        })
      }

      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: video,
        }).then((stream) => {
        preview.srcObject = stream;
        stream.getTracks().forEach(track => {
          peer.addTrack(track, stream);
        });

        // 一定注意：需要将该动作，放在这里面，即流获取成功后，再进行answer创建。不然不能获取到流，从而不能播放视频。
        const offerSdp = new RTCSessionDescription({type, sdp});
        peer.setRemoteDescription(offerSdp)
          .then(() => {
            peer.createAnswer().then(answer => {
              peer.setLocalDescription(answer)

              let message = {
                content: JSON.stringify(answer),
                type: Constant.MESSAGE_TRANS_TYPE,
                messageType: messagePB.contentType
              }
              sendMessage(message);
            })
          });
      });
    }
  }


  return (
    <div className="zf-chat">

    </div>
  );
});

export default withRouter(Index);
