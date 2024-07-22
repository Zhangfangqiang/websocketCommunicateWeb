import "./style.scss"
import {withRouter} from "@/hoc"
import {memo, useEffect} from 'react'
import {useAppDispatch} from "@/stores";
import {Button, Form, Input, Space} from "antd";
import useVerifyCodesData from "@/hooks/useVerifyCodesData";
import {changeVerifyCodesCaptchaAction} from "@/stores/modules/verifyCodes";
import {
  postSignupUsingEmail,
  PostSignupUsingEmailParamsInterface,
  postVerifyCodesCaptcha,
  postVerifyCodesEmail,
  PostVerifyCodesEmailParamsInterface
} from "@/services";
import {changeUserInfoAction} from "@/stores/modules/user";

const Index = memo((props: { router: any }) => {
  const {verifyCodesCaptcha} = useVerifyCodesData()
  const appDispatch = useAppDispatch()
  const [form] = Form.useForm<PostSignupUsingEmailParamsInterface>();

  useEffect(() => {
    postVerifyCodesCaptcha().then((res) => {
      appDispatch(changeVerifyCodesCaptchaAction(res))
    })
  }, [])

  return (
    <div className="zf-auth-signup-page">
      <h1>注册</h1>

      <Form
        form={form}
        name="basic"
        labelCol={{span: 8}}
        wrapperCol={{span: 16}}
        style={{maxWidth: 600}}
        initialValues={{remember: true}}
        onFinish={(v: PostSignupUsingEmailParamsInterface) => {
          postSignupUsingEmail(v).then(()=>{
            appDispatch(changeUserInfoAction(v))
          })
        }}
        onFinishFailed={() => {
        }}
        autoComplete="off">


        <Form.Item<PostSignupUsingEmailParamsInterface>
          label="name"
          name="name"
          rules={[{required: true, message: 'Please input your username!'}]}>
          <Input/>
        </Form.Item>

        <Form.Item<PostSignupUsingEmailParamsInterface>
          label="email"
          name="email"
          rules={[{required: true, message: 'Please input your username!'}]}>
          <Input/>
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


        <Form.Item label="verify_code">
          <Space>
            <Form.Item
              name="verify_code"
              noStyle
              rules={[{required: true, message: 'Username is required'}]}>
              <Input style={{width: 160}} placeholder="Please input"/>
            </Form.Item>
            <Button onClick={() => {
              postVerifyCodesEmail(
                {
                  email: form.getFieldValue("email"),
                  captcha_id: verifyCodesCaptcha.captcha_id,
                  captcha_answer: form.getFieldValue("captcha_answer"),
                } as PostVerifyCodesEmailParamsInterface
              )
            }}>发送邮件</Button>
          </Space>
        </Form.Item>


        <Form.Item<PostSignupUsingEmailParamsInterface>
          label="password"
          name="password"
          rules={[{required: true, message: 'Please input your username!'}]}>
          <Input/>
        </Form.Item>

        <Form.Item<PostSignupUsingEmailParamsInterface>
          label="password_confirm"
          name="password_confirm"
          rules={[{required: true, message: 'Please input your username!'}]}>
          <Input/>
        </Form.Item>


        <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>

      </Form>
    </div>
  );
});

export default withRouter(Index);
