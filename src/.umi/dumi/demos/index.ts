// @ts-nocheck
import React from 'react';
import { dynamic } from 'dumi';

export default {
  'src-demo': {
    component: function DumiDemo() {
  var _interopRequireDefault = require("/Users/huangliang/Works/goldnet/MovableType/node_modules/@umijs/babel-preset-umi/node_modules/@babel/runtime/helpers/interopRequireDefault.js")["default"];

  var _slicedToArray2 = _interopRequireDefault(require("/Users/huangliang/Works/goldnet/MovableType/node_modules/@umijs/babel-preset-umi/node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

  var _react = _interopRequireDefault(require("react"));

  var _antd = require("antd");

  var _ = require("@/");

  // 1. 定义字段池（全局复用）
  var fields = {
    companyName: {
      name: 'companyName',
      label: '企业名称',
      component: 'Input',
      required: true
    },
    registerCapital: {
      name: 'registerCapital',
      label: '注册资本',
      component: 'InputMoney',
      required: true
    },
    establishDate: {
      name: 'establishDate',
      label: '成立日期',
      component: 'DatePicker'
    }
  }; // 2. 定义表单配置（业务侧按场景组织）

  var config = {
    code: 'enterprise_info',
    name: '企业信息',
    sections: [{
      key: 'basic',
      title: '基本信息',
      fields: ['companyName', 'registerCapital', 'establishDate'],
      columns: 2
    }]
  }; // 3. 使用（Form 由外部提供，引擎只负责渲染）

  function MyPage() {
    var _Form$useForm = _antd.Form.useForm(),
        _Form$useForm2 = (0, _slicedToArray2["default"])(_Form$useForm, 1),
        form = _Form$useForm2[0];

    return /*#__PURE__*/_react["default"].createElement(_antd.Form, {
      form: form
    }, /*#__PURE__*/_react["default"].createElement(_.MovableType, {
      config: config,
      fields: fields
    }));
  }

  return React.createElement(MyPage);
},
    previewerProps: {"sources":{"_":{"tsx":"import React from 'react'\nimport { Form } from 'antd'\nimport { MovableType } from '@/'\n\n// 1. 定义字段池（全局复用）\nconst fields = {\n  companyName: {\n    name: 'companyName',\n    label: '企业名称',\n    component: 'Input',\n    required: true,\n  },\n  registerCapital: {\n    name: 'registerCapital',\n    label: '注册资本',\n    component: 'InputMoney',\n    required: true,\n  },\n  establishDate: {\n    name: 'establishDate',\n    label: '成立日期',\n    component: 'DatePicker',\n  },\n}\n\n// 2. 定义表单配置（业务侧按场景组织）\nconst config = {\n  code: 'enterprise_info',\n  name: '企业信息',\n  sections: [\n    {\n      key: 'basic',\n      title: '基本信息',\n      fields: ['companyName', 'registerCapital', 'establishDate'],\n      columns: 2,\n    },\n  ],\n}\n\n// 3. 使用（Form 由外部提供，引擎只负责渲染）\nexport default function MyPage() {\n  const [form] = Form.useForm()\n  return (\n    <Form form={form}>\n      <MovableType config={config} fields={fields} />\n    </Form>\n  )\n}"}},"dependencies":{"react":{"version":">=16.9.0"},"antd":{"version":"4.24.16","css":"antd/dist/antd.css"},"react-dom":{"version":">=16.9.0"}},"identifier":"src-demo"},
  },
  'src-demo-1': {
    component: function DumiDemo() {
  var _interopRequireDefault = require("/Users/huangliang/Works/goldnet/MovableType/node_modules/@umijs/babel-preset-umi/node_modules/@babel/runtime/helpers/interopRequireDefault.js")["default"];

  var _react = _interopRequireDefault(require("react"));

  var _antd = require("antd");

  var _ = require("@/");

  var fields = {
    companyName: {
      name: 'companyName',
      label: '企业名称',
      component: 'Input'
    }
  };
  var config = {
    code: 'view_demo',
    name: '查看模式示例',
    sections: [{
      key: 's1',
      title: '基本信息',
      fields: ['companyName']
    }]
  };

  function ViewDemo() {
    return /*#__PURE__*/_react["default"].createElement(_antd.Form, null, /*#__PURE__*/_react["default"].createElement(_.MovableType, {
      config: config,
      fields: fields,
      mode: "view"
    }));
  }

  return React.createElement(ViewDemo);
},
    previewerProps: {"sources":{"_":{"tsx":"import React from 'react'\nimport { Form } from 'antd'\nimport { MovableType } from '@/'\n\nconst fields = {\n  companyName: { name: 'companyName', label: '企业名称', component: 'Input' },\n}\n\nconst config = {\n  code: 'view_demo',\n  name: '查看模式示例',\n  sections: [{ key: 's1', title: '基本信息', fields: ['companyName'] }],\n}\n\nexport default function ViewDemo() {\n  return (\n    <Form>\n      <MovableType config={config} fields={fields} mode=\"view\" />\n    </Form>\n  )\n}"}},"dependencies":{"react":{"version":">=16.9.0"},"antd":{"version":"4.24.16","css":"antd/dist/antd.css"},"react-dom":{"version":">=16.9.0"}},"identifier":"src-demo-1"},
  },
  'src-demo-2': {
    component: function DumiDemo() {
  var _interopRequireWildcard = require("/Users/huangliang/Works/goldnet/MovableType/node_modules/@umijs/babel-preset-umi/node_modules/@babel/runtime/helpers/interopRequireWildcard.js")["default"];

  var _interopRequireDefault = require("/Users/huangliang/Works/goldnet/MovableType/node_modules/@umijs/babel-preset-umi/node_modules/@babel/runtime/helpers/interopRequireDefault.js")["default"];

  var _regeneratorRuntime2 = _interopRequireDefault(require("/Users/huangliang/Works/goldnet/MovableType/node_modules/@umijs/babel-preset-umi/node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js"));

  var _asyncToGenerator2 = _interopRequireDefault(require("/Users/huangliang/Works/goldnet/MovableType/node_modules/@umijs/babel-preset-umi/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js"));

  var _slicedToArray2 = _interopRequireDefault(require("/Users/huangliang/Works/goldnet/MovableType/node_modules/@umijs/babel-preset-umi/node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

  var _react = _interopRequireWildcard(require("react"));

  var _antd = require("antd");

  var _lodash = require("lodash");

  var _ = require("@/");

  var fieldPool = {
    companyName: {
      name: 'companyName',
      label: '企业名称',
      component: 'Input'
    }
  };
  var config = {
    code: 'demo',
    name: '示例表单',
    sections: [{
      key: 's1',
      title: '基本信息',
      fields: ['companyName']
    }]
  };

  function StandardFormPage() {
    var _Form$useForm = _antd.Form.useForm(),
        _Form$useForm2 = (0, _slicedToArray2["default"])(_Form$useForm, 1),
        form = _Form$useForm2[0];

    var _useState = (0, _react.useState)(false),
        _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
        loading = _useState2[0],
        setLoading = _useState2[1]; // ---- 1. 初始化 ----


    (0, _react.useEffect)(function () {// 可从 localStorage 或接口加载初始值
      // form.setFieldsValue({ companyName: '示例企业' })
    }, []); // ---- 2. 自动存草稿 ----

    var handleValuesChange = (0, _react.useCallback)((0, _lodash.debounce)(function () {
      localStorage.setItem("draft_".concat(config.code), JSON.stringify(form.getFieldsValue()));
    }, 1000), [config.code, form]); // ---- 3. 提交 ----

    var handleFinish = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/(0, _regeneratorRuntime2["default"])().mark(function _callee(values) {
        return (0, _regeneratorRuntime2["default"])().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                setLoading(true);

                try {
                  console.log('提交数据:', values);

                  _antd.message.success('提交成功');
                } finally {
                  setLoading(false);
                }

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function handleFinish(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    return /*#__PURE__*/_react["default"].createElement(_antd.Form, {
      form: form,
      onFinish: handleFinish,
      onValuesChange: handleValuesChange
    }, /*#__PURE__*/_react["default"].createElement(_.MovableType, {
      config: config,
      fields: fieldPool
    }), /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        marginTop: 24
      }
    }, /*#__PURE__*/_react["default"].createElement(_antd.Button, {
      type: "primary",
      htmlType: "submit",
      loading: loading
    }, "\u63D0\u4EA4"), /*#__PURE__*/_react["default"].createElement(_antd.Button, {
      style: {
        marginLeft: 8
      },
      onClick: function onClick() {
        return form.resetFields();
      }
    }, "\u91CD\u7F6E")));
  }

  return React.createElement(StandardFormPage);
},
    previewerProps: {"sources":{"_":{"tsx":"import React from 'react'\nimport { Form, Button, message } from 'antd'\nimport { useCallback, useEffect, useState } from 'react'\nimport { debounce } from 'lodash'\nimport { MovableType } from '@/'\n\nconst fieldPool = {\n  companyName: { name: 'companyName', label: '企业名称', component: 'Input' },\n}\n\nconst config = {\n  code: 'demo',\n  name: '示例表单',\n  sections: [{ key: 's1', title: '基本信息', fields: ['companyName'] }],\n}\n\nexport default function StandardFormPage() {\n  const [form] = Form.useForm()\n  const [loading, setLoading] = useState(false)\n\n  // ---- 1. 初始化 ----\n  useEffect(() => {\n    // 可从 localStorage 或接口加载初始值\n    // form.setFieldsValue({ companyName: '示例企业' })\n  }, [])\n\n  // ---- 2. 自动存草稿 ----\n  const handleValuesChange = useCallback(\n    debounce(() => {\n      localStorage.setItem(`draft_${config.code}`, JSON.stringify(form.getFieldsValue()))\n    }, 1000),\n    [config.code, form]\n  )\n\n  // ---- 3. 提交 ----\n  const handleFinish = async (values: any) => {\n    setLoading(true)\n    try {\n      console.log('提交数据:', values)\n      message.success('提交成功')\n    } finally {\n      setLoading(false)\n    }\n  }\n\n  return (\n    <Form\n      form={form}\n      onFinish={handleFinish}\n      onValuesChange={handleValuesChange}\n    >\n      <MovableType config={config} fields={fieldPool} />\n\n      <div style={{ marginTop: 24 }}>\n        <Button type=\"primary\" htmlType=\"submit\" loading={loading}>\n          提交\n        </Button>\n        <Button style={{ marginLeft: 8 }} onClick={() => form.resetFields()}>\n          重置\n        </Button>\n      </div>\n    </Form>\n  )\n}"}},"dependencies":{"react":{"version":">=16.9.0"},"antd":{"version":"4.24.16","css":"antd/dist/antd.css"},"lodash":{"version":"4.18.1"},"react-dom":{"version":">=16.9.0"}},"identifier":"src-demo-2"},
  },
};
