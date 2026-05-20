---
order: 5
---

# MovableType 的一些例子

🔗 [GitHub 仓库](https://github.com/goldnet/MovableType)

## 例一：单一场景表单

最简用法，无金融机构切换，直接渲染。

::::demo
```tsx
import React from 'react'
import { Form } from 'antd'
import 'antd/dist/antd.css'
import { MovableType } from 'movable-type'

export default function Demo1() {
  const [form] = Form.useForm()

  const fields = {
    supplierName: { name: 'supplierName', label: '供应商名称', component: 'Input', required: true },
    bankName:     { name: 'bankName',     label: '开户银行',   component: 'Input', required: true },
    bankAccount:  { name: 'bankAccount',  label: '银行账号',   component: 'Input', required: true },
    contactName:  { name: 'contactName',  label: '联系人姓名', component: 'Input' },
    contactPhone: { name: 'contactPhone', label: '联系人电话', component: 'Input' },
  }

  const config = {
    code: 'demo1',
    sections: [
      { key: 'basic',  title: '基本信息',   columns: 2, fields: ['supplierName', 'bankName', 'bankAccount'] },
      { key: 'contact', title: '联系人信息', columns: 2, fields: ['contactName', 'contactPhone'] },
    ],
  }

  return (
    <Form form={form}>
      <MovableType config={config} fields={fields} />
    </Form>
  )
}
```
:::::

---

## 例二：多金融机构切换

选择银行后，自动切换对应表单配置。

::::demo
```tsx
import React from 'react'
import { Form, Select } from 'antd'
import 'antd/dist/antd.css'
import { MovableType } from 'movable-type'

const { Option } = Select

export default function Demo2() {
  const [form] = Form.useForm()
  const bankCode = Form.useWatch('openBank', form) || 'JRJG0001'

  const fields = {
    openBank: {
      name: 'openBank', label: '开立方银行', component: 'Select', required: true,
      options: [
        { label: '工商银行', value: 'JRJG0001' },
        { label: '浦发银行', value: 'JRJG0020' },
      ],
    },
    claimsAmount: { name: 'claimsAmount', label: '凭证金额', component: 'InputMoney', required: true },
    dueDate:      { name: 'dueDate',      label: '承诺付款日', component: 'DatePicker', required: true },
    contactName:  { name: 'contactName',  label: '联系人姓名', component: 'Input' },
    contactPhone: { name: 'contactPhone', label: '联系人电话', component: 'Input' },
  }

  const scenes = {
    JRJG0001: {
      code: 'JRJG0001', name: '工商银行开立',
      sections: [
        { key: 'basic', title: '基本信息', columns: 2, fields: ['openBank', 'claimsAmount', 'dueDate'] },
        { key: 'contact', title: '联系人', columns: 2, fields: ['contactName', 'contactPhone'] },
      ],
    },
    JRJG0020: {
      code: 'JRJG0020', name: '浦发银行开立',
      sections: [
        { key: 'basic', title: '基本信息', columns: 2, fields: ['openBank', 'claimsAmount', 'dueDate'] },
        { key: 'contact', title: '联系人', columns: 3, fields: ['contactName', 'contactPhone'] },
      ],
    },
  }

  return (
    <Form form={form} initialValues={{ openBank: 'JRJG0001' }}>
      <Form.Item name="openBank" label="开立方银行" style={{ marginBottom: 24 }}>
        <Select style={{ width: 200 }}>
          <Option value="JRJG0001">工商银行</Option>
          <Option value="JRJG0020">浦发银行</Option>
        </Select>
      </Form.Item>
      <MovableType config={scenes[bankCode]} fields={fields} />
    </Form>
  )
}
```
:::::

---

## 例三：扩展组件 + dataLoader

注册自定义组件，异步加载选项。

::::demo
```tsx
import React from 'react'
import { Form, Input } from 'antd'
import 'antd/dist/antd.css'
import { MovableType } from 'movable-type'

// 自定义组件（接收 value / onChange，由 Form.Item 自动注入）
const TradeInfo = ({ value, onChange, ...rest }: any) => (
  <Input
    value={value}
    onChange={onChange}
    placeholder="请输入贸易合同编号"
    style={{ background: '#f6ffed' }}
    {...rest}
  />
)

export default function Demo3() {
  const [form] = Form.useForm()

  const fields = {
    claimsRef: {
      name: 'claimsRef', label: '关联凭证', component: 'Select', required: true,
      dataLoader: {
        deps: [],
        callback: async () => {
          await new Promise(r => setTimeout(r, 600))
          return [
            { label: '凭证 A-001', value: 'A001' },
            { label: '凭证 B-002', value: 'B002' },
          ]
        },
      },
    },
    tradeInfo: {
      name: 'tradeInfo', label: '贸易合同编号', component: 'TradeInfo',
    },
    financeAmount: {
      name: 'financeAmount', label: '融资金额', component: 'InputMoney', required: true,
    },
  }

  const config = {
    code: 'demo3',
    sections: [
      { key: 'basic', title: '融资信息', columns: 2, fields: ['claimsRef', 'financeAmount'] },
      { key: 'trade', title: '贸易信息', columns: 1, fields: ['tradeInfo'] },
    ],
  }

  // 把自定义组件注册到引擎
  const components = {
    TradeInfo: {
      render: ({ mergedProps }: any) => <TradeInfo {...mergedProps} />,
    },
  }

  return (
    <Form form={form}>
      <MovableType config={config} fields={fields} components={components} />
    </Form>
  )
}
```
:::::

---

## 例四：编辑/查看模式切换

同一份配置，切换 `mode` 即可在编辑与查看之间转换。

::::demo
```tsx
import React, { useState } from 'react'
import { Form, Button, Space } from 'antd'
import 'antd/dist/antd.css'
import { MovableType } from 'movable-type'

export default function Demo4() {
  const [form] = Form.useForm()
  const [mode, setMode] = useState<'edit' | 'view'>('edit')

  const fields = {
    name:  { name: 'name',  label: '姓名', component: 'Input', required: true },
    phone: { name: 'phone', label: '电话', component: 'Input' },
    city:  { name: 'city',  label: '城市', component: 'Select', options: [{ label: '北京', value: 'bj' }, { label: '上海', value: 'sh' }] },
  }

  const config = {
    code: 'demo4',
    sections: [
      { key: 's1', title: '基本信息', columns: 2, fields: ['name', 'phone', 'city'] },
    ],
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type={mode === 'edit' ? 'primary' : 'default'} onClick={() => setMode('edit')}>编辑</Button>
        <Button type={mode === 'view' ? 'primary' : 'default'} onClick={() => setMode('view')}>查看</Button>
      </Space>
      <Form form={form} initialValues={{ name: '张三', phone: '13800138000', city: 'bj' }}>
        <MovableType config={config} fields={fields} mode={mode} />
      </Form>
    </div>
  )
}
```
:::::

---

## 例五：DatePicker 日期转换

编辑加载时日期为字符串，需在 `submitAdapter` 中统一转回字符串格式。

::::demo
```tsx
import React from 'react'
import { Form, Button, Space } from 'antd'
import 'antd/dist/antd.css'
import { MovableType } from 'movable-type'

export default function Demo5() {
  const [form] = Form.useForm()

  const fields = {
    dueDate: { name: 'dueDate', label: '承诺付款日', component: 'DatePicker', required: true },
    amount:  { name: 'amount',  label: '融资金额',   component: 'InputMoney', required: true },
  }

  const config = {
    code: 'demo5',
    sections: [
      { key: 's1', title: '融资信息', columns: 2, fields: ['dueDate', 'amount'] },
    ],
    submitAdapter: (data: any) => ({
      ...data,
      // DatePicker 返回 moment 对象，提交前格式化为字符串
      dueDate: data.dueDate?.format?.('YYYY-MM-DD'),
    }),
  }

  const handleFinish = (values: any) => {
    const adapted = config.submitAdapter!(values)
    alert('提交数据：\n' + JSON.stringify(adapted, null, 2))
  }

  return (
    <Form form={form} onFinish={handleFinish} initialValues={{ dueDate: undefined, amount: undefined }}>
      <MovableType config={config} fields={fields} />
      <Space style={{ marginTop: 16 }}>
        <Button type="primary" htmlType="submit">提交</Button>
      </Space>
    </Form>
  )
}
```
:::::
