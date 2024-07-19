import "./style.scss"
import {memo, useEffect} from 'react'
import {withRouter} from "@/hoc"
import {
  PostLoginUsingPasswordParamsInterface,
  postVerifyCodesCaptcha
} from "@/services";
import {Button, Form, Input, Space, Tooltip} from "antd";

const Index = memo((props: { router: any }) => {
  useEffect(() => {

    postVerifyCodesCaptcha().then((res)=>{
      console.log(res)
    })
  })

  return (
    <div className="zf-auth-login-page">
      <Form
        name="basic"
        labelCol={{span: 8}}
        wrapperCol={{span: 16}}
        style={{maxWidth: 600}}
        initialValues={{remember: true}}
        onFinish={(v :PostLoginUsingPasswordParamsInterface) => {
          console.log(v)
        }}
        onFinishFailed={() => {

        }}
        autoComplete="off"
      >
        <Form.Item<PostLoginUsingPasswordParamsInterface>
          label="Username"
          name="login_id"
          rules={[{required: true, message: 'Please input your username!'}]}
        >
          <Input/>
        </Form.Item>

        <Form.Item<PostLoginUsingPasswordParamsInterface>
          label="Password"
          name="password"
          rules={[{required: true, message: 'Please input your password!'}]}
        >
          <Input.Password/>
        </Form.Item>


        <Form.Item label="captcha_answer">
          <Space>
            <Form.Item
              name="captcha_answer"
              noStyle
              rules={[{ required: true, message: 'Username is required' }]}
            >
              <Input style={{ width: 160 }} placeholder="Please input" />
            </Form.Item>


            <img >
            </img>

          </Space>
        </Form.Item>


        <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default withRouter(Index);
