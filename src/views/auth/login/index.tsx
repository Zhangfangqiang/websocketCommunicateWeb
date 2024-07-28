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
      <div className="zf-auth-login-page auth-public-style">
          <div>
              <img src={require('@/assets/imgs/Designer (6).jpeg')} alt=""/>
          </div>

          <div>
              <h1>登录</h1>
              <Form
                  size={"large"}
                layout={"vertical"}
                style={{maxWidth: 360}}
                initialValues={{remember: true}}
                onFinish={(v: PostLoginUsingPasswordParamsInterface) => {
                  postLoginUsingPassword({...v, captcha_id: verifyCodesCaptcha.captcha_id}).then((res) => {
                    appDispatch(changeUserInfoAction(res))
                  })
                }}
                autoComplete="off">
              <Form.Item<PostLoginUsingPasswordParamsInterface>
                  label="账号"
                  name="login_id"
                  rules={[{required: true, message: '请输入账号'}]}>
                <Input/>
              </Form.Item>

              <Form.Item<PostLoginUsingPasswordParamsInterface>
                  label="密码"
                  name="password"
                  rules={[{required: true, message: '请输入密码'}]}>
                <Input.Password/>
              </Form.Item>


              <Form.Item
                  label="图片验证码"
                  name="captcha_answer"
                  rules={[
                    {required: true, message: '请输入验证码'}
                  ]}
              >
                <Space>
                  <Input name="captcha_answer" style={{width: "240px"}} placeholder="请输入验证码"/>
                  <div onClick={() => {
                    postVerifyCodesCaptcha().then((res) => {
                      appDispatch(changeVerifyCodesCaptchaAction(res))
                    })
                  }}>
                    <img src={verifyCodesCaptcha.captcha_image} style={{height: 40}} alt=""/>
                  </div>
                </Space>
              </Form.Item>


              <Form.Item>
                <Button type="primary" htmlType="submit" style={{width:"100%"}}>
                  登录
                </Button>
              </Form.Item>

              <div>
                <Link to="/signup">注册账号</Link>
              </div>
            </Form>
          </div>

      </div>
  );
});

export default withRouter(Index);
