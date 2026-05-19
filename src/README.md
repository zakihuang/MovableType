# MovableType 使用指南

> 纯渲染型配置引擎。你只需提供**字段池** + **表单配置**，引擎负责把配置变成界面。

---

## 设计目标

| 目标 | 说明 |
|------|------|
| **配置驱动** | JSON 即表单。增减字段、调整布局、修改联动，改配置而非改代码。 |
| **纯渲染** | 不持有表单状态，不管理生命周期。初始化、提交、持久化完全由外层控制，对接灵活。 |
| **复杂简单同化** | 简单表单（3 个字段）和复杂表单（100 个字段 + 多级联动）共用同一套配置模型，没有"简单模式"和"复杂模式"的分支。 |
| **精确重渲染** | 联动字段仅监听依赖变化，无关字段零开销。隐藏字段跳过内核渲染，避免 Hooks 空跑。 |
| **零侵入扩展** | 新增字段类型只需在注册表加一条记录，新增自定义布局只需提供一个懒加载函数，永不修改引擎核心。 |

## 解决痛点

| 痛点 | 传统方式 | MovableType 方案 |
|------|---------|----------------|
| 表单代码重复冗余 | 每个表单都手写 JSX、校验、联动逻辑 | 配置一次，多处复用字段池 |
| 简单复杂两套方案 | 简单表单写死 JSX，复杂表单上低代码平台 | 同一套配置模型，密度不同而已 |
| 联动逻辑散落各处 | `useEffect` + `onChange` 回调满天飞 | `watch` / `dataLoader` 结构化声明 |
| 编辑查看两套代码 | 编辑页一套组件，详情页再写一套展示 | `mode="edit" / "view"` 同配置切换 |
| 新增字段类型改核心 | 改渲染组件、改校验逻辑、改查看态 | 注册表加一条 `ComponentRenderer` |
| 表单状态管理混乱 | `useState` / `useReducer` / Redux 层层包裹 | 纯渲染，状态完全交给外层 Ant Design Form |

---

## 1. 最小可运行示例

:::demo
```tsx
import React from 'react'
import 'antd/dist/antd.css';
import { Form } from 'antd'
import { MovableType } from 'movable-type'

// 1. 定义字段池（全局复用）
const fields = {
  companyName: {
    name: 'companyName',
    label: '企业名称',
    component: 'Input',
    required: true,
  },
  registerCapital: {
    name: 'registerCapital',
    label: '注册资本',
    component: 'InputMoney',
    required: true,
  },
  establishDate: {
    name: 'establishDate',
    label: '成立日期',
    component: 'DatePicker',
  },
}

// 2. 定义表单配置（业务侧按场景组织）
const config = {
  code: 'enterprise_info',
  name: '企业信息',
  sections: [
    {
      key: 'basic',
      title: '基本信息',
      fields: ['companyName', 'registerCapital', 'establishDate'],
      columns: 2,
    },
  ],
}

// 3. 使用（Form 由外部提供，引擎只负责渲染）
export default function MyPage() {
  const [form] = Form.useForm()
  return (
    <Form form={form}>
      <MovableType config={config} fields={fields} />
    </Form>
  )
}
```
:::

---

## 2. 核心概念

| 概念 | 说明 | 类比 |
|------|------|------|
| **字段池 (fields)** | 所有可用字段的完整定义，全局复用 | 组件库 |
| **表单配置 (config)** | 某张具体表单的编排：用哪些字段、怎么分组、几列 | 页面布局 |
| **组件注册表 (components)** | 自定义组件的加载器，与内置组件同名即覆盖 | 插件系统 |

---

## 3. 字段定义 (FieldDescriptor)

```ts
{
  name: 'fieldName',           // 表单字段名，支持嵌套 ['finance', 'amount']
  label: '显示标签',
  component: 'Input',          // 内置或自定义组件名
  required: true,              // 是否必填（自动生成校验规则）
  options: [                   // 静态选项（Select / RadioGroup 等）
    { label: '选项A', value: 1 },
    { label: '选项B', value: 2 },
  ],
  visible: true,               // 是否显示（可被 watch 动态覆盖）
  hideLabel: false,            // 隐藏 label，只保留输入框
  rules: [...],                // 自定义校验规则（优先级高于 required）
  // ... 其他 props 透传给组件
}
```

### 3.1 内置组件清单

| 组件名 | 说明 | 查看态默认行为 |
|--------|------|---------------|
| `Input` | 文本输入 | 原值显示 |
| `InputTextArea` | 多行文本 | 原值显示 |
| `InputMoney` | 金额输入（带 ¥ 前缀） | 原值显示 |
| `Select` | 下拉选择 | 匹配 `options` 显示 label |
| `Cascader` | 级联选择 | 多级 label 拼接 |
| `DatePicker` | 日期选择 | 格式化 `YYYY-MM-DD` |
| `TimePicker` | 时间选择 | 格式化 `HH:mm:ss` |
| `Switch` | 开关 | 显示"是/否" |
| `Checkbox` | 复选框 | 显示"是/否" |
| `RadioGroup` | 单选组 | 匹配 `options` 显示 label |

> 未列出的组件名视为**自定义组件**，需通过 `components` 注册。

---

## 4. 联动机制

### 4.1 字段级联动 (watch)

当依赖字段变化时，动态修改当前字段的属性。

```ts
const fields = {
  applyType: {
    name: 'applyType',
    label: '申请类型',
    component: 'Select',
    options: [
      { label: '个人', value: 'personal' },
      { label: '企业', value: 'enterprise' },
    ],
  },
  companyName: {
    name: 'companyName',
    label: '企业名称',
    component: 'Input',
    required: true,
    // 当 applyType 变化时，动态调整自身属性
    watch: {
      deps: ['applyType'],
      callback: (allValues, form) => {
        const isEnterprise = allValues.applyType === 'enterprise'
        return {
          visible: isEnterprise,      // 企业申请时才显示
          required: isEnterprise,     // 企业申请时才必填
        }
      },
    },
  },
}
```

### 4.2 异步选项加载 (dataLoader)

```ts
const fields = {
  city: {
    name: 'city',
    label: '城市',
    component: 'Select',
    dataLoader: {
      deps: ['province'],          // 监听省份变化
      callback: async (deps, form) => {
        const { province } = deps
        if (!province) return []
        const res = await fetchCities(province)
        return res.data.map(item => ({ label: item.name, value: item.code }))
      },
    },
  },
}
```

### 4.3 区块级联动 (Section watch)

```ts
const config = {
  code: 'dynamic_form',
  name: '动态表单',
  sections: [
    {
      key: 'enterprise_section',
      title: '企业信息',
      fields: ['companyName', 'license'],
      columns: 2,
      // 整个区块的显隐联动
      watch: {
        deps: ['applyType'],
        callback: (allValues) => ({
          visible: allValues.applyType === 'enterprise',
        }),
      },
    },
  ],
}
```

---

## 5. 自定义组件

### 5.1 同步渲染器（推荐简单场景）

```ts
import { ComponentRenderer } from 'movable-type'

const MyRenderer: ComponentRenderer = {
  // 编辑态渲染
  render: ({ label, mergedProps, dynamicOptions }) => (
    <MyCustomInput placeholder={`请输入${label}`} {...mergedProps} />
  ),
  // 查看态格式化（可选）
  viewFormatter: (value) => value ? `自定义前缀: ${value}` : '-',
  // 非 value 属性绑定时指定（如 Checkbox 用 checked）
  valuePropName: 'value',
}

// 使用
<MovableType
  config={config}
  fields={fields}
  components={{ MyCustomInput: MyRenderer }}
/>
```

字段定义中：
```ts
{ name: 'foo', label: 'Foo', component: 'MyCustomInput' }
```

### 5.2 异步懒加载（复杂组件/按需加载）

```ts
const components = {
  TradeInfo: () => import('movable-typecomponents/TradeInfo'),
  ComplexChart: () => import('movable-typecomponents/ComplexChart'),
}

<MovableType config={config} fields={fields} components={components} />
```

异步组件接收的 props：
```ts
{
  form,      // Ant Design Form 实例
  values,    // 当前全部表单值
  name,      // 字段路径
  label,     // 标签
  rules,     // 校验规则
  ...props   // FieldDescriptor 中其他透传属性
}
```

---

## 6. 查看模式

:::demo
```tsx
import React from 'react'
import 'antd/dist/antd.css';
import { Form } from 'antd'
import { MovableType } from 'movable-type'

const fields = {
  companyName: { name: 'companyName', label: '企业名称', component: 'Input' },
}

const config = {
  code: 'view_demo',
  name: '查看模式示例',
  sections: [{ key: 's1', title: '基本信息', fields: ['companyName'] }],
}

export default function ViewDemo() {
  return (
    <Form>
      <MovableType config={config} fields={fields} mode="view" />
    </Form>
  )
}
```
:::

- 所有字段变为纯文本展示
- 内置组件自带查看态格式化逻辑
- 自定义组件通过 `viewFormatter` 控制显示

---

## 7. 高级使用

### 7.1 字段覆盖 (overrides)

同一张表单在不同场景下微调字段属性，无需重新定义字段池。

```ts
const config = {
  code: 'special_scene',
  name: '特殊场景',
  sections: [...],
  overrides: {
    companyName: {
      label: '企业全称（变更）',   // 覆盖标签
      required: false,             // 覆盖必填
      placeholder: '请输入变更后名称', // 覆盖 props
    },
    registerCapital: {
      visible: false,              // 隐藏字段
    },
  },
}
```

### 7.2 提交前数据转换 (submitAdapter)

```ts
const config = {
  code: 'payment',
  name: '付款申请',
  sections: [...],
  submitAdapter: (data) => ({
    ...data,
    // 金额元转分
    amount: data.amount ? Math.round(data.amount * 100) : 0,
    // 字段重命名
    applyTime: data.createTime,
  }),
}
```

### 7.3 自定义区块布局

当标准网格无法满足需求时，可自定义整个 Section 的渲染。

```ts
// 1. 注册自定义区块组件（必须是懒加载函数）
const components = {
  TradeSection: () => import('movable-typecomponents/TradeSection'),
}

// 2. 表单配置中引用
const config = {
  sections: [
    {
      key: 'trade',
      title: '交易信息',
      component: 'TradeSection',   // 自定义组件名
      fields: ['buyer', 'seller', 'amount'], // 字段仍走引擎校验
    },
  ],
}
```

自定义区块组件接收 props：
```ts
{
  section: SectionDescriptor,   // 当前区块配置
  fields: Record<string, FieldDescriptor>, // 覆盖后的字段池
  mode: 'edit' | 'view',
  components: Record<string, ComponentRegistryItem>,
}
```

### 7.4 简单表单（无区块）

当表单较简单时，可省略 `sections`，直接写顶层字段。

```ts
const config = {
  code: 'simple',
  name: '简单表单',
  fields: ['name', 'phone', 'email'],
  columns: 2,
}
```

引擎会自动退化为单区块渲染。

---

## 8. 标准接入与最佳实践

> 引擎只做**渲染和交互**，表单的**生命周期管理**（初始化、提交、持久化）由外层控制。以下是推荐的标准接入模式。

### 8.1 引擎不负责什么

| 职责 | 归属 | 说明 |
|------|------|------|
| Form 实例创建 | 外层 | `const [form] = Form.useForm()` |
| 初始数据加载 | 外层 | 从接口、URL、localStorage 读取后 `form.setFieldsValue` |
| 提交处理 | 外层 | `onFinish` 里调接口、提示、跳转 |
| 草稿自动保存 | 外层 | `onValuesChange` 里 `debounce` 写 `localStorage` |
| 提交前数据转换 | 可选 `submitAdapter` | 轻量级转换（元转分、重命名）走配置；复杂转换走外层 |

### 8.2 推荐的标准外壳

:::demo
```tsx
import React from 'react'
import 'antd/dist/antd.css';
import { Form, Button, message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { MovableType } from 'movable-type'

const fieldPool = {
  companyName: { name: 'companyName', label: '企业名称', component: 'Input' },
}

const config = {
  code: 'demo',
  name: '示例表单',
  sections: [{ key: 's1', title: '基本信息', fields: ['companyName'] }],
}

export default function StandardFormPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // ---- 1. 初始化 ----
  useEffect(() => {
    // 可从 localStorage 或接口加载初始值
    // form.setFieldsValue({ companyName: '示例企业' })
  }, [])

  // ---- 2. 自动存草稿 ----
  const handleValuesChange = useCallback(
    debounce(() => {
      localStorage.setItem(`draft_${config.code}`, JSON.stringify(form.getFieldsValue()))
    }, 1000),
    [config.code, form]
  )

  // ---- 3. 提交 ----
  const handleFinish = async (values: any) => {
    setLoading(true)
    try {
      console.log('提交数据:', values)
      message.success('提交成功')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      onValuesChange={handleValuesChange}
    >
      <MovableType config={config} fields={fieldPool} />

      <div style={{ marginTop: 24 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          提交
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => form.resetFields()}>
          重置
        </Button>
      </div>
    </Form>
  )
}
```
:::
