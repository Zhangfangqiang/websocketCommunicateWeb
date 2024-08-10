import {withRouter} from "@/hoc";
import {useAppDispatch} from "@/stores";
import {memo, useEffect, useState} from "react";
import useVerifyCodesData from "@/hooks/useVerifyCodesData";
import {Button, Form, Input, message, Space, Steps} from "antd";
import {changeVerifyCodesCaptchaAction} from "@/stores/modules/verifyCodes";
import {
  postVerifyCodesEmail,
  postVerifyCodesCaptcha,
  PostPasswordResetUsingEmail,
  PostVerifyCodesEmailParamsInterface
} from "@/services";


const Index = memo((props: { router: any }) => {
  const {navigate} = props.router;
  const {verifyCodesCaptcha} = useVerifyCodesData()
  const appDispatch = useAppDispatch()
  const [findPassSteps, setFindPassSteps] = useState(0)

  useEffect(() => {
    postVerifyCodesCaptcha().then((res) => {
      appDispatch(changeVerifyCodesCaptchaAction(res))
    })
  }, [])

  return (
    <div className="zf-auth-find-password-page auth-public-style">

      <div>
        <img src={require('@/assets/imgs/Designer (6).jpeg')} alt=""/>
      </div>
      <div>
        <h1>通过邮箱找回密码</h1>

        {/*步骤条开始*/}
        <Steps size="small" style={{margin: "40px 0", width: "360px"}} current={findPassSteps}
               items={[{title: '发送邮件',}, {title: '修改密码'}, {title: '完成'}]}/>
        {/*步骤条结束*/}

        {/*步骤1开始*/}
        {findPassSteps === 0 &&
          <Form
            size={"large"}
            layout={"vertical"}
            style={{maxWidth: 360}}
            initialValues={{remember: true}}
            onFinish={(v) => {
              postVerifyCodesEmail({...v, captcha_id: verifyCodesCaptcha.captcha_id}).then((r) => {
                setFindPassSteps(1)
                message.success("发送成功")
              })
            }}
            autoComplete="off">

            <Form.Item<PostVerifyCodesEmailParamsInterface>
              label="邮箱"
              name="email"
              rules={[{required: true, message: '请输入邮箱'}, {type: 'email', message: '请输入有效的邮箱格式'}]}>
              <Input placeholder="请输入邮箱"/>
            </Form.Item>

            <Form.Item
              label="图片验证码"
              name="captcha_answer"
              rules={[{required: true, message: '请输入验证码'}]}>
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
              <Button type="primary" htmlType="submit" style={{width: "100%"}}>
                发送邮件
              </Button>
            </Form.Item>
          </Form>}
        {/*步骤1结束*/}

        {/*步骤2开始*/}
        {findPassSteps === 1 &&
          <Form
            size={"large"}
            layout={"vertical"}
            style={{maxWidth: 360}}
            initialValues={{remember: true}}
            onFinish={(v) => {
              PostPasswordResetUsingEmail(v).then(res => {
                setFindPassSteps(2)
                message.success("修改成功")
              })
            }}
            autoComplete="off">

            <Form.Item<PostVerifyCodesEmailParamsInterface>
              label="邮箱"
              name="email"
              rules={[{required: true, message: '请输入邮箱'}, {type: 'email', message: '请输入有效的邮箱格式'}]}>
              <Input placeholder="请输入邮箱"/>
            </Form.Item>

            <Form.Item
              label="邮箱验证码"
              name="verify_code"
              rules={[{required: true, message: '请输入验证码'}]}>
              <Input placeholder="请输入邮箱验证码"/>
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{required: true, message: '请输入密码'}]}>
              <Input.Password placeholder="请输入密码"/>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{width: "100%"}}>
                修改密码
              </Button>
            </Form.Item>
          </Form>}
        {/*步骤2结束*/}

        {/*步骤3开始*/}
        {findPassSteps === 2 && <div style={{width: "360px"}}>
          <img src={require('@/assets/imgs/1.jpeg')} style={{width: "100%", borderRadius: "20px", display: "block"}}/>
          <Button type="text" style={{width: "100%", margin: "15px 0"}}>
            操作成功
          </Button>
          <Button type="primary" style={{width: "100%"}} onClick={() => {
            navigate("/login")
          }}>
            跳转登录
          </Button>
        </div>}
        {/*步骤3结束*/}

      </div>
    </div>
  )
})

export default withRouter(Index);
