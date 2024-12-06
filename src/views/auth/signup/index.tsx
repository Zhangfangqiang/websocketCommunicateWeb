import "./style.scss"
import {withRouter} from "@/hoc"
import {memo, useEffect, useState} from 'react'
import {useAppDispatch} from "@/stores";
import {Button, Form, Input, message, Space} from "antd";
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
import {Link} from "react-router-dom";

const Index = memo((props: { router: any }) => {
  const {verifyCodesCaptcha} = useVerifyCodesData()
  const appDispatch = useAppDispatch()
  const [form] = Form.useForm<PostSignupUsingEmailParamsInterface>();
  const [countdown, setCountdown] = useState(0)
  
  
  useEffect(() => {
    postVerifyCodesCaptcha().then((res) => {
      appDispatch(changeVerifyCodesCaptchaAction(res))
    })
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);

      return () => clearTimeout(timerId); // 清理计时器
    }
  }, [countdown]);

  return (
    <div className="zf-auth-signup-page auth-public-style">
      <div>
        <img src={require('@/assets/imgs/Designer (6).jpeg')} alt=""/>
      </div>

      <div>
        <h1>注册</h1>

        <Form
          size={"large"}
          layout={"vertical"}
          form={form}
          style={{maxWidth: 360}}
          initialValues={{remember: true}}
          onFinish={(v: PostSignupUsingEmailParamsInterface) => {
            postSignupUsingEmail(v).then((res) => {
              appDispatch(changeUserInfoAction(res));
              window.location.reload();
            })
          }}
          autoComplete="off">

          <Form.Item<PostSignupUsingEmailParamsInterface>
            label="用户昵称"
            name="name"
            rules={[{required: true, message: '请输入用户昵称'}]}>
            <Input placeholder="请输入用户昵称"/>
          </Form.Item>

          <Form.Item<PostSignupUsingEmailParamsInterface>
            label="邮箱"

            name="email"
            rules={[{required: true, message: '请输入邮箱'}]}>
            <Input placeholder="请输入邮箱"/>
          </Form.Item>


          <Form.Item
            label="图片验证码"
            name="captcha_answer"
            rules={[
              {required: true, message: '请输入验证码'},
              {pattern: /^\d{6}$/, message: '请输入6位数字'}
            ]}
          >
            <Space>
              <Input name="captcha_answer" style={{width: "240px"}} placeholder="请输入验证码"/>
              <div onClick={() => {
                postVerifyCodesCaptcha().then((res) => {
                  appDispatch(changeVerifyCodesCaptchaAction(res))
                })
              }}>
                <img src={verifyCodesCaptcha.captcha_image} style={{height: 40, cursor: 'pointer'}} alt=""/>
              </div>
            </Space>
          </Form.Item>


          <Form.Item label="邮件验证码"
                     name="verify_code"
                     rules={[
                       {required: true, message: '请输入邮件验证码'},
                       {pattern: /^\d{6}$/, message: '请输入6位数字'}
                     ]}
          >
            <Space>
              <Input style={{width: "240px"}} placeholder="请输入邮件验证码"/>
              <Button style={{width: "120px", fontSize: 14}} onClick={() => {
                if (countdown === 0) {
                  let email = form.getFieldValue("email")
                  let captchaAnswer = form.getFieldValue("captcha_answer")

                  if (!email) {
                    message.error("请填写邮箱")
                    return
                  }
                  if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase())) {
                    message.error("请填写邮箱")
                    return
                  }
                  if (!captchaAnswer) {
                    message.error("请填写图片验证码后在发送验证邮件")
                    return
                  }
                  if (captchaAnswer.length !== 6) {
                    message.error("请填写图片验证码后在发送验证邮件")
                    return
                  }
                  setCountdown(60)

                  postVerifyCodesEmail({
                    email: email,
                    captcha_id: verifyCodesCaptcha.captcha_id,
                    captcha_answer: captchaAnswer,
                  } as PostVerifyCodesEmailParamsInterface).then(() => {
                    setCountdown(0)
                    message.success("邮件发送成功")
                  })
                }
              }}>{countdown === 0 ? "发送邮件" : countdown} </Button>
            </Space>
          </Form.Item>


          <Form.Item<PostSignupUsingEmailParamsInterface>
            label="密码"
            name="password"
            rules={[{required: true, message: '请输入密码'}]}>
            <Input.Password placeholder="请输入密码"/>
          </Form.Item>

          <Form.Item<PostSignupUsingEmailParamsInterface>
            label="确认密码"
            name="password_confirm"
            rules={[{required: true, message: '请输入确认密码'}]}>
            <Input.Password placeholder="请输入确认密码"/>
          </Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" style={{width: "100%"}}>
              注册
            </Button>
          </Form.Item>

          <div style={{display:"flex",flexFlow:"nowrap row",justifyContent:"space-between"}}>
            <Link to="/login">登录账号</Link>
            <Link to="/findPassword">找回密码</Link>
          </div>

        </Form>
      </div>
    </div>
  );
});

export default withRouter(Index);
