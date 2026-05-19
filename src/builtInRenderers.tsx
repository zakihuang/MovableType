import React from 'react'
import {
  Checkbox, DatePicker, Input, InputNumber, Radio,
  Select, Cascader, TimePicker, Switch,
} from 'antd'
import { ComponentRenderer } from './types'

// ==========================================
// 内置组件注册表（新增组件只需加一条，无需改 FieldSlotCore）
// ==========================================
export const builtInRenderers: Record<string, ComponentRenderer> = {
  Input: {
    render: ({ label, mergedProps }) => <Input placeholder={`请输入${label}`} {...mergedProps} />,
  },
  InputTextArea: {
    render: ({ label, mergedProps }) => <Input.TextArea rows={3} placeholder={`请输入${label}`} {...mergedProps} />,
  },
  InputMoney: {
    render: ({ label, mergedProps }) => <InputNumber style={{ width: '100%' }} prefix="¥" placeholder={`请输入${label}`} {...mergedProps} />,
  },
  Select: {
    render: ({ label, mergedProps, dynamicOptions, optionsLoading }) =>
      <Select options={dynamicOptions} loading={optionsLoading} placeholder={`请选择${label}`} {...mergedProps} />,
    viewFormatter: (value, { dynamicOptions }) => dynamicOptions.find(opt => opt.value === value)?.label ?? (value ?? '-'),
  },
  Cascader: {
    render: ({ label, mergedProps, dynamicOptions, options }) =>
      <Cascader options={dynamicOptions.length ? dynamicOptions : options} placeholder={`请选择${label}`} {...mergedProps} />,
    viewFormatter: (value, { dynamicOptions }) => {
      if (Array.isArray(value)) return value.map(val => dynamicOptions.find(opt => opt.value === val)?.label ?? val).join(' / ')
      return dynamicOptions.find(opt => opt.value === value)?.label ?? (value ?? '-')
    },
  },
  DatePicker: {
    render: ({ mergedProps }) => <DatePicker style={{ width: '100%' }} {...mergedProps} />,
    viewFormatter: (value, { mergedProps }) => {
      if (!value) return '-'
      if (typeof value.format === 'function') return value.format(mergedProps.format || 'YYYY-MM-DD')
      return String(value)
    },
  },
  TimePicker: {
    render: ({ label, mergedProps }) => <TimePicker style={{ width: '100%' }} placeholder={`请选择${label}`} {...mergedProps} />,
    viewFormatter: (value, { mergedProps }) => {
      if (!value) return '-'
      if (typeof value.format === 'function') return value.format(mergedProps.format || 'HH:mm:ss')
      return String(value)
    },
  },
  Switch: {
    valuePropName: 'checked',
    render: ({ mergedProps }) => <Switch {...mergedProps} />,
    viewFormatter: (value) => value ? '是' : '否',
  },
  Checkbox: {
    valuePropName: 'checked',
    render: ({ label, mergedProps }) => <Checkbox {...mergedProps}>{label}</Checkbox>,
    viewFormatter: (value) => value ? '是' : '否',
  },
  RadioGroup: {
    render: ({ mergedProps, dynamicOptions, options }) =>
      <Radio.Group options={dynamicOptions.length ? dynamicOptions : options} {...mergedProps} />,
    viewFormatter: (value, { dynamicOptions }) => dynamicOptions.find(opt => opt.value === value)?.label ?? (value ?? '-'),
  },
}
