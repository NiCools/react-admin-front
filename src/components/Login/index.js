import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import globalConfig from 'config';
import ajax from '../../utils/ajax';
import Logger from '../../utils/Logger';
import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  message
} from 'antd';
import './index.less';
import { loginSuccessCreator } from '../../redux/Login.js';

const logger = Logger.getLogger('Login');
const FormItem = Form.Item;

/**
 * 定义Login组件
 */
class Login extends React.PureComponent {

  // 一般而言公司内部都会提供基于 LDAP 的统一登录, 用到这个登录组件的场景应该挺少的

  state = {
    userName: '', // 当前输入的用户名
    password: '', // 当前输入的密码
    requesting: false, // 当前是否正在请求服务端接口
  };

  // controlled components

  handleUserNameInput = (e) => {
    // this.setState({ userName: e.target.value }); // 如果不使用 antd 的form，应该是这样写的
    this.props.form.setFieldsValue({ userName: e.target.value });
  };

  handlePasswordInput = (e) => {
    this.props.form.setFieldsValue({ password: e.target.value });
  };

  /**
   * 处理表单的submit事件
   * @param e
   */
  handleSubmit = async (e) => { // async可以配合箭头函数
    e.preventDefault(); // 这个很重要, 防止跳转
    this.setState({ requesting: true });
    const hide = message.loading('正在验证...', 0);

    const userName = this.props.form.getFieldValue('userName');
    const password = this.props.form.getFieldValue('password');
    logger.debug('userName = %s, password = %s', userName, password);

    try {
      // 服务端验证
      const res = await ajax.login(userName, password);
      hide();
      logger.debug('login validate return: result %o', res);

      if (res.success) {
        message.success('登录成功');
        // 如果登录成功, 触发一个loginSuccess的action, payload就是登录后的用户名
        this.props.handleLoginSuccess(res.data);
      } else {
        message.error(`登录失败: ${res.message}, 请联系管理员`);
        this.setState({ requesting: false });
      }
    } catch (exception) {
      hide();
      message.error(`网络请求出错: ${exception.message}`);
      logger.error('login error, %o', exception);
      this.setState({ requesting: false });
    }
  };

  render() {
    // 整个组件被一个id="loginDIV"的div包围, 样式都设置到这个div中
    const { getFieldDecorator } = this.props.form;
    return (
      <div id="loginDIV">

        {/*debug模式下显示 fork me on github*/}
        {globalConfig.debug && <a href="https://github.com/weihomechen/vue-mail-front" target="_blank" className="github-corner" aria-label="View source on Github">
          <svg width="90" height="90" viewBox="0 0 250 250" style={{ fill: "#29D2E4", color: "#fff", position: "absolute", border: "0", right: 0 }}
            aria-hidden="true">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
            <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
              fill="currentColor" style={{ transformOrigin: "130px 106px" }} className="octo-arm"></path>
            <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" className="octo-body"></path>
          </svg>
        </a>}

        <div className="login">
          <h1>{globalConfig.name}</h1>

          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入用户名!' }],
              })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} type="text"
                  onChange={this.handleUserNameInput} placeholder="用户名" />
                )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password"
                  onChange={this.handlePasswordInput} placeholder="密码" />
                )}
            </FormItem>
            <FormItem>
              <Checkbox>记住我</Checkbox>
              <a className="login-form-forgot" href="">忘记密码</a>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登陆
              </Button>
            </FormItem>
          </Form>

        </div>

      </div>
    );
  }

}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoginSuccess: bindActionCreators(loginSuccessCreator, dispatch)
  };
};

const login = Form.create()(Login);
// 不需要从state中获取什么, 所以传一个null
export default connect(null, mapDispatchToProps)(login);
