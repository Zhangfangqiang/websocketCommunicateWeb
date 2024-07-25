import moment from 'moment';
import {withRouter} from "@/hoc"
import classNames from "classnames";
import {memo, useEffect} from 'react'
import {useAppDispatch} from "@/stores";
import {Message} from "./proto/message"
import useUserData from "@/hooks/useUserData";
import {MoreOutlined} from "@ant-design/icons";
import {getContentByType} from "@/utils/common";
import * as Constant from '@/common/constant/Constant'
import {BASE_URL, WS_BASE_URL} from "@/services/axios/config"
import {changeMessageListAction} from "@/stores/modules/user";
import InfiniteScroll from 'react-infinite-scroll-component';
import {Avatar, Button, Card, Divider, Form, Input, List, Skeleton, Space} from "antd";
import ChatFile from "@/views/home/chat/c-cpns/ChatFile";


const Index = memo((props: { router: any }) => {
  const appDispatch = useAppDispatch()
  const {chooseUser, messageList, userInfo} = useUserData()


  useEffect(() => {
    connection()

    /*    setInterval(()=>{
          console.log("messagePB")
          const messagePB = Message.create(
            {
              "content": "234234",
              "contentType": 1,
              "messageType": 1,
              "fromUsername": "zf1860@qq.com",
              "from": "d8e37262-3533-40f0-b45f-b57d1b1db82f",
              "to": "c9c72dc7-bdca-46ac-b761-a5656554b1be"
            }
          )
          socket.send(Message.encode(messagePB).finish())
        },5000)*/

  }, [])

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
    window.socket = new WebSocket(WS_BASE_URL + "/socket.io?user=" + "uuid")

    let image = document.getElementById('receiver');

    /**
     * 打开链接
     */
    // @ts-ignore
    window.socket.onopen = () => {
      heartCheck.start()
    }

    /**
     * 监听webSocket的消息
     * @param message
     */
    // @ts-ignore
    window.socket.onmessage = (message: MessageEvent) => {
      heartCheck.start()
      let reader = new FileReader();              //创建 FileReader 对象以读取二进制数据
      reader.readAsArrayBuffer(message.data);                //将收到的 blob 对象读取为 ArrayBuffer

      reader.onload = ((event: ProgressEvent<FileReader>) => {
        // @ts-ignore
        const messagePB = Message.decode(new Uint8Array(event.target.result as ArrayBuffer));

        if (messagePB.type === "heatbeat") {
          return;
        }

        /*处理 WebRTC 消息 | 接受语音电话或者视频电话 webrtc*/
        if (messagePB.type === Constant.MESSAGE_TRANS_TYPE) {
          // dealWebRtcMessage(messagePB);
          return;
        }

        /*如果该消息不是正在聊天消息，显示未读提醒*/
        if (chooseUser.uuid !== messagePB.from) {
          // showUnreadMessageDot(messagePB.from);
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

        appDispatch(changeMessageListAction([
          ...messageList,
          {
            author: messagePB.fromUsername,
            avatar: avatar,
            content: <p>1111</p>,
            datetime: moment().fromNow(),
          },
        ]))
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
      messageType: 1,               // 消息类型，1.单聊 2.群聊
      fromUsername: userInfo?.data?.name,
      from: userInfo?.data?.uuid,
      to: toUser,
    }

    const messagePB = Message.create(data)
    // @ts-ignore
    console.log(window)
    // @ts-ignore
    window.socket.send(Message.encode(messagePB).finish())
  }


  let dataTest = Array.from({length: 100}, (_, index) => ({id: index}));

  return (
    <div className="zf-chat">
      <Card title="Inner Card" bordered={false} extra={<MoreOutlined onClick={() => {
      }}/>} style={{height: "100vh"}}>

        {/*消息列表开始*/}
        <div style={{height: 600, overflow: 'auto', padding: '0 16px'}}>
          <InfiniteScroll
            dataLength={dataTest.length}
            hasMore={dataTest.length < 50}
            loader={<Skeleton avatar paragraph={{rows: 1}} active/>}
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
            next={() => {
            }}>
            <List
              dataSource={dataTest}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    style={{marginBottom: 10}}
                    className={classNames({
                      'zf-reverse-list': index & 2,
                    })}
                    avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}/>}
                    title={<a href="https://ant.design">{item.id}</a>}
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  />
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>
        {/*消息列表结束*/}

        {/*分割线开始*/}
        <Divider></Divider>
        {/*分割线结束*/}

        {/*功能菜单开始*/}
        <Space.Compact block>

          <ChatFile sendMessage={sendMessage}/>


          {/*<Tooltip title="Like">*/}
          {/*  <Button icon={<LikeOutlined />} />*/}
          {/*</Tooltip>*/}
          {/*<Tooltip title="Comment">*/}
          {/*  <Button icon={<CommentOutlined />} />*/}
          {/*</Tooltip>*/}
          {/*<Tooltip title="Star">*/}
          {/*  <Button icon={<StarOutlined />} />*/}
          {/*</Tooltip>*/}
          {/*<Tooltip title="Heart">*/}
          {/*  <Button icon={<HeartOutlined />} />*/}
          {/*</Tooltip>*/}
          {/*<Tooltip title="Share">*/}
          {/*  <Button icon={<ShareAltOutlined />} />*/}
          {/*</Tooltip>*/}
          {/*<Tooltip title="Download">*/}
          {/*  <Button icon={<DownloadOutlined />} />*/}
          {/*</Tooltip>*/}
        </Space.Compact>
        {/*功能菜单结束*/}


        {/*表单发送开始*/}
        <Form>
          <Form.Item name="content">
            <Input.TextArea rows={7}/>
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
    </div>
  );
});

export default withRouter(Index);
