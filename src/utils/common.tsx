import {FileOutlined} from '@ant-design/icons';
import {BASE_URL, WS_BASE_URL} from "@/services/axios/config"

/**
 * 根据文件类型渲染对应的标签，比如视频，图片等。
 * @returns
 */
export const getContentByType = (type: number, url: string, content: any) => {
  if (type === 2) {
    content = <FileOutlined style={{fontSize: 38}}/>
  } else if (type === 3) {
    content = <img src={BASE_URL + "/" + url} alt="" width="150px"/>
  } else if (type === 4) {
    content = <audio src={BASE_URL + "/" + url} controls autoPlay={false} preload="auto"/>
  } else if (type === 5) {
    content = <video src={BASE_URL + "/" + url} controls autoPlay={false} preload="auto" width='200px'/>
  }

  return content;
}


/**
 * 检查摄像头权限
 */
export const checkMediaPermission = () => {
  // @ts-ignore
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia; //获取媒体对象（这里指摄像头）

  if (!navigator || !navigator.mediaDevices) {
    return false;
  }
  return true;
}
