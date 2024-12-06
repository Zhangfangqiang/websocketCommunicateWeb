import {memo} from 'react'
import {withRouter} from "@/hoc"
import {MoreOutlined} from "@ant-design/icons";
import {Button, Card, Form, Switch} from "antd";

const ChatWindowDetails = memo((props: { router: any }) => {
  return (




    <div className="zf-chat-window-details">

      <Form.Item name="消息免打扰" label="消息免打扰" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item name="消息免打扰" label="置顶聊天" valuePropName="checked">
        <Switch />
      </Form.Item>


      <Button type="primary" block >
        清空聊天记录
      </Button>
    </div>
  );
});

export default withRouter(ChatWindowDetails);
