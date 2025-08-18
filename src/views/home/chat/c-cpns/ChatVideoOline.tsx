import {memo, useState} from "react";
import {withRouter} from "@/hoc";
import useUserData from "@/hooks/useUserData";
import {Tooltip, Button, Drawer, Modal} from 'antd';
import {VideoCameraOutlined, PoweroffOutlined} from '@ant-design/icons';
import * as Constant from '@/common/constant/Constant'
import {useAppDispatch} from "@/stores";
import {changeVerifyCodesCaptchaAction} from "@/stores/modules/verifyCodes";
import {changeMediaAction} from "@/stores/modules/user";
import {checkMediaPermission} from "@/utils/common";



const Index = memo((props: {
    router: any,
    sendMessage: (data: any) => void,
    appendMessage: (data: any) => void,
    appendImgToPanel: (data: any) => void,
}) => {

    let videoIntervalObj: NodeJS.Timer
    let localPeer: RTCPeerConnection | null = null;

    const appDispatch = useAppDispatch()
    const {chooseUser, media: _media}         = useUserData()

    const [videoCallModal, setVideoCallModal]                   = useState(false)
    const [mediaPanelDrawerVisible, setMediaPanelDrawerVisible] = useState(false)


    /**
     * 开启视频电话
     */
    const startVideoOnline = () => {

        if (!checkMediaPermission()) {
            return;
        }
        let media = {
            ..._media,
            mediaConnected: false,
        }

        appDispatch(changeMediaAction(media))
        setVideoCallModal(true)

        let data = {
            contentType: Constant.DIAL_VIDEO_ONLINE,
            type: Constant.MESSAGE_TRANS_TYPE,
        }

        props.sendMessage(data);


        videoIntervalObj = setInterval(() => {
            console.log("video call")

            // 对方接受视频
            if (media && media.mediaConnected) {
                setMediaState();
                sendVideoData();
                return;
            }

            // 对方拒接
            if (media && media.mediaReject) {
                setMediaState();
                return;
            }

            props.sendMessage(data);
        }, 3000)
    }


    const setMediaState = () => {
        videoIntervalObj && clearInterval(videoIntervalObj);

        setVideoCallModal(false)

        let media = {
            ..._media,
            mediaConnected: false,
            mediaReject: false,
        }

        appDispatch(changeMediaAction(media))
    }


    const sendVideoData = () => {
        const preview = document.getElementById("localPreviewSender") as HTMLVideoElement | null;
        if (!preview) return;

        navigator.mediaDevices
          .getUserMedia({
              audio: true,
              video: true,
          }).then((stream) => {

            preview.srcObject = stream;
            stream.getTracks().forEach(track => {
                localPeer?.addTrack(track, stream);
            });

            // 一定注意：需要将该动作，放在这里面，即流获取成功后，再进行offer创建。不然不能获取到流，从而不能播放视频。
            localPeer?.createOffer()
              .then(offer => {
                  localPeer?.setLocalDescription(offer);

                  let data = {
                      contentType: Constant.VIDEO_ONLINE,
                      content: JSON.stringify(offer),
                      type: Constant.MESSAGE_TRANS_TYPE,
                  }

                  props.sendMessage(data);
              });
        });

        setMediaPanelDrawerVisible(true)
    }



    const handleOk = () => {

    }

    const handleCancel = () => {

        setVideoCallModal(false)

        let data = {
            contentType: Constant.CANCELL_VIDEO_ONLINE,
            type: Constant.MESSAGE_TRANS_TYPE,
        }
        props.sendMessage(data);

        videoIntervalObj && clearInterval(videoIntervalObj);
    }

   const  mediaPanelDrawerOnClose = () => {
        setMediaPanelDrawerVisible(false)
    }

    /**
     * 停止视频电话,屏幕共享
     */
    const stopVideoOnline = (): void => {
        const preview = document.getElementById("localPreviewSender") as HTMLVideoElement | null;
        if (!preview) return;

        const localStream = preview.srcObject as MediaStream | null;
        if (localStream) {
            localStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        }

        const remoteVideo = document.getElementById("remoteVideoSender") as HTMLVideoElement | null;
        const remoteStream = remoteVideo?.srcObject as MediaStream | null;
        if (remoteStream) {
            remoteStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        }
    };

    return (
      <>
          <Tooltip title="视频聊天">
              <Button
                shape="circle"
                onClick={startVideoOnline}
                style={{ marginRight: 10 }}
                icon={<VideoCameraOutlined />} disabled={chooseUser.uuid === ''}
              />
          </Tooltip>

          <Drawer width='820px'
                  forceRender={true}
                  title="媒体面板"
                  placement="right"
                  onClose={mediaPanelDrawerOnClose}
                  visible={mediaPanelDrawerVisible}
          >
              <Tooltip title="结束视频语音">
                  <Button
                    shape="circle"
                    onClick={stopVideoOnline}
                    style={{ marginRight: 10, float: 'right' }}
                    icon={<PoweroffOutlined style={{ color: 'red' }} />}
                  />
              </Tooltip>
              <br />
              <video id="localPreviewSender" width="700px" height="auto" autoPlay muted controls />
              <video id="remoteVideoSender" width="700px" height="auto" autoPlay muted controls />
          </Drawer>

          <Modal
            title="视频电话"
            visible={videoCallModal}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="确认"
            cancelText="取消"
          >
              <p>呼叫中...</p>
          </Modal>
      </>
    )
})

export default withRouter(Index);
