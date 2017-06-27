import React from 'react';
import './index.less';

/**
 * 展示欢迎界面
 */
class Welcome extends React.PureComponent {

  render() {
    return (
      <div id="welcome_container">
        <p>
          Welcome, 这里是欢迎界面, 欢迎访问我的<a target="_blank" href="http://rulifun.com">个人网站</a>
        </p>
        <p>
          项目地址: <a target="_blank" href="https://github.com/weihomechen/react-admin-front">https://github.com/weihomechen/react-admin-front</a>
        </p>
        <div className="welcome-img-container">
          <img className="welcome-img" src="http://os4z3wv5q.bkt.clouddn.com/welcome.gif" />
        </div>

      </div>
    );
  }

}

export default Welcome;
