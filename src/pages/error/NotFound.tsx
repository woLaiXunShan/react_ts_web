/**
 * 404页面未找到展示页面
 */
import React from 'react';

const NotFound: React.FC = () => {
  /**
   * 返回上一页
   * @memberof NoPermissions
   */


  return (
    <div className="error">
      <p className="pic noF"></p>
      <div className="action">
        <h2>404</h2>
        <p>抱歉，您访问的页面不存在</p>
        <br />
        {/* <Button href="/">返回首页</Button> */}
      </div>
    </div>
  )
}

export default NotFound
