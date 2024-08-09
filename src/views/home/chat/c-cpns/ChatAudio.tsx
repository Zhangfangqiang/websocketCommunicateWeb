import {memo} from "react";
import {Button, message, Tooltip} from "antd";
import {AudioOutlined} from "@ant-design/icons";
import useUserData from "@/hooks/useUserData";
import {withRouter} from "@/hoc";
import Recorder from 'js-audio-recorder';


const Index = memo((props: {
  router: any,
  sendMessage: (data: any) => void,
  appendMessage: (data: any) => void,
  appendImgToPanel: (data: any) => void,
}) => {

  const {chooseUser} = useUserData()

  let audiorecorder:any = null;
  let hasAudioPermission = true;

  /**
   * 开始录音方法
   */
  const startAudio = () => {
    audiorecorder = new Recorder()
    audiorecorder.start().then(() => {

      console.log("开始录音")
    }, (_error: any) => {
      hasAudioPermission = false;
      message.error("录音权限获取失败！")
    })
  }

  /**
   * 结束录音方法
   */
  const stopAudio = () => {
    if (!hasAudioPermission) {
      return;
    }

    let blob = audiorecorder.getWAVBlob();
    let reader = new FileReader()

    audiorecorder.stop()
    audiorecorder.destroy()
    audiorecorder = null;
    reader.readAsArrayBuffer(blob)

    reader.onload = ((e) => {
      const target = e.target;

      if (target && target.result) {
        let file = e.target.result

        // 上传文件必须将ArrayBuffer转换为Uint8Array
        let data = {
          content: "",
          contentType: 3,
          fileSuffix: "wav",
          file: new Uint8Array(file as ArrayBuffer)
        }

        props.sendMessage(data)
      }
    })

    props.appendMessage(<audio src={window.URL.createObjectURL(blob)} controls autoPlay={false} preload="auto" />);
  }

  return (
    <Tooltip title="发送语音">
      <Button
        style={{border:"none"}}
        onMouseDown={startAudio}
        onMouseUp={stopAudio}
        onTouchStart={startAudio}
        onTouchEnd={stopAudio}
        icon={<AudioOutlined/>}
        disabled={chooseUser.uuid === ''}
      />
    </Tooltip>
  )
})

export default withRouter(Index);
