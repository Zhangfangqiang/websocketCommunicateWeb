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
        <div className="zf-auth-signup-page auth-public-style">
            <div>
                <img  src={require('@/assets/imgs/Designer (6).jpeg')} alt=""/>
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
                            appDispatch(changeUserInfoAction(res))
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


                    <Form.Item label="邮件验证码"
                               name="verify_code"
                               rules={[
                                   {required: true, message: '请输入邮件验证码'}
                               ]}
                    >
                        <Space>
                            <Input style={{width: "240px"}} placeholder="请输入邮件验证码"/>
                            <Button style={{width:"120px",fontSize:14}} onClick={() => {
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
                </Form>
            </div>
        </div>
    );
});

export default withRouter(Index);
