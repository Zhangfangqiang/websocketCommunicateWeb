import "./style.scss"
import {withRouter} from "@/hoc"
import {memo, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useAppDispatch} from "@/stores";
import {Button, Form, Input, Space} from "antd";
import useVerifyCodesData from "@/hooks/useVerifyCodesData";
import {changeVerifyCodesCaptchaAction} from "@/stores/modules/verifyCodes";
import {postLoginUsingPassword, PostLoginUsingPasswordParamsInterface, postVerifyCodesCaptcha} from "@/services";
import {changeUserInfoAction} from "@/stores/modules/user";


const Index = memo((props: { router: any }) => {
  const appDispatch = useAppDispatch()

  const {verifyCodesCaptcha} = useVerifyCodesData()

  useEffect(() => {
    postVerifyCodesCaptcha().then((res) => {
      appDispatch(changeVerifyCodesCaptchaAction(res))
    })
  }, [])

  return (
    <div className="zf-auth-login-page">
      <h1>登录</h1>
      <Form
        name="basic"
        labelCol={{span: 8}}
        wrapperCol={{span: 16}}
        style={{maxWidth: 600}}
        initialValues={{remember: true}}
        onFinish={(v: PostLoginUsingPasswordParamsInterface) => {
          postLoginUsingPassword({...v, captcha_id: verifyCodesCaptcha.captcha_id}).then((res) => {
            appDispatch(changeUserInfoAction(res))
          })
        }}
        onFinishFailed={() => {
        }}
        autoComplete="off">
        <Form.Item<PostLoginUsingPasswordParamsInterface>
          label="Username"
          name="login_id"
          rules={[{required: true, message: 'Please input your username!'}]}>
          <Input/>
        </Form.Item>

        <Form.Item<PostLoginUsingPasswordParamsInterface>
          label="Password"
          name="password"
          rules={[{required: true, message: 'Please input your password!'}]}>
          <Input.Password/>
        </Form.Item>

        <Form.Item label="captcha_answer">
          <Space>
            <Form.Item
              name="captcha_answer"
              noStyle
              rules={[{required: true, message: 'Username is required'}]}>
              <Input style={{width: 160}} placeholder="Please input"/>
            </Form.Item>
            <div onClick={() => {
              postVerifyCodesCaptcha().then((res) => {
                appDispatch(changeVerifyCodesCaptchaAction(res))
              })
            }}>
              <img src={verifyCodesCaptcha.captcha_image} alt=""/>
            </div>
          </Space>
        </Form.Item>


        <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>

        <div>
          <Link to="/signup">注册账号</Link>
        </div>
      </Form>
    </div>
  );
});

export default withRouter(Index);
