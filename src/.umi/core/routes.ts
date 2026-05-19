// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/Users/huangliang/Works/goldnet/MovableType/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/~demos/:uuid",
    "layout": false,
    "wrappers": [require('../dumi/layout').default],
    "component": ((props) => {
        const React = require('react');
        const { default: getDemoRenderArgs } = require('/Users/huangliang/Works/goldnet/MovableType/node_modules/@umijs/preset-dumi/lib/plugins/features/demo/getDemoRenderArgs');
        const { default: Previewer } = require('dumi-theme-default/es/builtins/Previewer.js');
        const { usePrefersColor, context } = require('dumi/theme');

        
      const { demos } = React.useContext(context);
      const [renderArgs, setRenderArgs] = React.useState([]);

      // update render args when props changed
      React.useLayoutEffect(() => {
        setRenderArgs(getDemoRenderArgs(props, demos));
      }, [props.match.params.uuid, props.location.query.wrapper, props.location.query.capture]);

      // for listen prefers-color-schema media change in demo single route
      usePrefersColor();

      switch (renderArgs.length) {
        case 1:
          // render demo directly
          return renderArgs[0];

        case 2:
          // render demo with previewer
          return React.createElement(
            Previewer,
            renderArgs[0],
            renderArgs[1],
          );

        default:
          return `Demo ${props.match.params.uuid} not found :(`;
      }
    
        })
  },
  {
    "path": "/_demos/:uuid",
    "redirect": "/~demos/:uuid"
  },
  {
    "__dumiRoot": true,
    "layout": false,
    "path": "/",
    "wrappers": [require('../dumi/layout').default, require('/Users/huangliang/Works/goldnet/MovableType/node_modules/dumi-theme-default/es/layout.js').default],
    "routes": [
      {
        "component": require('/Users/huangliang/Works/goldnet/MovableType/src/README.md').default,
        "path": "/",
        "exact": true,
        "meta": {
          "filePath": "src/README.md",
          "updatedTime": 1779100379302,
          "slugs": [
            {
              "depth": 1,
              "value": "MovableType 使用指南",
              "heading": "movabletype-使用指南"
            },
            {
              "depth": 2,
              "value": "设计目标",
              "heading": "设计目标"
            },
            {
              "depth": 2,
              "value": "解决痛点",
              "heading": "解决痛点"
            },
            {
              "depth": 2,
              "value": "1. 最小可运行示例",
              "heading": "1-最小可运行示例"
            },
            {
              "depth": 2,
              "value": "2. 核心概念",
              "heading": "2-核心概念"
            },
            {
              "depth": 2,
              "value": "3. 字段定义 (FieldDescriptor)",
              "heading": "3-字段定义-fielddescriptor"
            },
            {
              "depth": 3,
              "value": "3.1 内置组件清单",
              "heading": "31-内置组件清单"
            },
            {
              "depth": 2,
              "value": "4. 联动机制",
              "heading": "4-联动机制"
            },
            {
              "depth": 3,
              "value": "4.1 字段级联动 (watch)",
              "heading": "41-字段级联动-watch"
            },
            {
              "depth": 3,
              "value": "4.2 异步选项加载 (dataLoader)",
              "heading": "42-异步选项加载-dataloader"
            },
            {
              "depth": 3,
              "value": "4.3 区块级联动 (Section watch)",
              "heading": "43-区块级联动-section-watch"
            },
            {
              "depth": 2,
              "value": "5. 自定义组件",
              "heading": "5-自定义组件"
            },
            {
              "depth": 3,
              "value": "5.1 同步渲染器（推荐简单场景）",
              "heading": "51-同步渲染器推荐简单场景"
            },
            {
              "depth": 3,
              "value": "5.2 异步懒加载（复杂组件/按需加载）",
              "heading": "52-异步懒加载复杂组件按需加载"
            },
            {
              "depth": 2,
              "value": "6. 查看模式",
              "heading": "6-查看模式"
            },
            {
              "depth": 2,
              "value": "7. 高级使用",
              "heading": "7-高级使用"
            },
            {
              "depth": 3,
              "value": "7.1 字段覆盖 (overrides)",
              "heading": "71-字段覆盖-overrides"
            },
            {
              "depth": 3,
              "value": "7.2 提交前数据转换 (submitAdapter)",
              "heading": "72-提交前数据转换-submitadapter"
            },
            {
              "depth": 3,
              "value": "7.3 自定义区块布局",
              "heading": "73-自定义区块布局"
            },
            {
              "depth": 3,
              "value": "7.4 简单表单（无区块）",
              "heading": "74-简单表单无区块"
            },
            {
              "depth": 2,
              "value": "8. 标准接入与最佳实践",
              "heading": "8-标准接入与最佳实践"
            },
            {
              "depth": 3,
              "value": "8.1 引擎不负责什么",
              "heading": "81-引擎不负责什么"
            },
            {
              "depth": 3,
              "value": "8.2 推荐的标准外壳",
              "heading": "82-推荐的标准外壳"
            }
          ],
          "title": "MovableType 使用指南",
          "hasPreviewer": true
        },
        "title": "MovableType 使用指南 - MovableType"
      }
    ],
    "title": "MovableType",
    "component": (props) => props.children
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
