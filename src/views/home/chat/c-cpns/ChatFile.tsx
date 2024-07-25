import {withRouter} from "@/hoc";
import React, {memo, useRef} from 'react';
import useUserData from "@/hooks/useUserData";
import {Tooltip, Button, message} from "antd";
import {FileAddOutlined, FileOutlined} from '@ant-design/icons';


const Index = memo((props: { router: any, sendMessage: (data: any) => void }) => {
  const {chooseUser} = useUserData()
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * 隐藏真正的文件上传控件，通过按钮模拟点击文件上传控件
   */
  const clickFile = () => {
    fileInputRef.current?.click();
  }

  /**
   * 文件上传
   * @param e
   */
  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files

    if (!files || !files[0]) {
      return;
    }

    let fileName = files[0].name

    if (null == fileName) {
      message.error("文件无名称")
      return
    }

    let index = fileName.lastIndexOf('.');

    let fileSuffix: any;

    if (index >= 0) {
      fileSuffix = fileName.substring(index + 1);
    }


    let reader = new FileReader()

    reader.onload = ((event: ProgressEvent<FileReader>) => {
      const target = event.target;
      if (target && target.result) {

        let file = event.target.result
        var u8 = new Uint8Array(file as ArrayBuffer);


        let data = {
          // content: this.state.value,
          contentType: 3,
          fileSuffix: fileSuffix,
          file: u8
        }

        console.log(props.sendMessage(data))
        // props.sendMessage(data)

        if (["jpeg", "jpg", "png", "gif", "tif", "bmp", "dwg"].indexOf(fileSuffix) !== -1) {
          //将图片追加到消息列表
          // this.props.appendImgToPanel(file)
        } else {
          //将图片追加到消息列表
          // this.props.appendMessage(<FileOutlined style={{fontSize: 38}}/>)
        }
      }
    })

    reader.readAsArrayBuffer(files[0])
  }

  return (
    <Tooltip title="上传图片或者文件">

      <input type='file' id='file' ref={fileInputRef} onChange={uploadFile} hidden disabled={chooseUser.uuid === ''}/>
      <Button
        onClick={clickFile}
        shape="circle"
        style={{marginRight: 10}}
        icon={<FileAddOutlined/>}
        disabled={chooseUser.uuid === ''}
      />
    </Tooltip>
  )
});

export default withRouter(Index);
