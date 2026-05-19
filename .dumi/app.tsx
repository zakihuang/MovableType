import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

export function rootContainer(container: any) {
  return React.createElement(
    ConfigProvider,
    { locale: zhCN },
    container,
  );
}
