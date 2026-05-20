---
order: 2
---

# MovableType 入门教程

🔗 [GitHub 仓库](https://github.com/zakihuang/MovableType)

## 一、为什么需要 MovableType？

如果你写过前端表单，一定经历过这样的崩溃时刻：

> 产品经理说："这个表单加两个字段。"你改了 3 个文件，加了 50 行 JSX，测试了 4 种联动情况，花了半天。
> 下周他说："那两个字段删掉吧。"你又要翻出来改。

表单是前端开发中最重复、最琐碎的工作之一。每个项目里，80% 的表单代码长得都差不多：Input、Select、DatePicker 组合排列，加上 `useEffect` 监听联动，`onChange` 里写一堆判断。

**MovableType 想解决的问题很简单：能不能像搭积木一样搭表单？**

你只用写一次"积木清单"（字段定义），然后每次搭新表单时，告诉它"这次用哪几块、怎么摆"（配置），界面就自动生成了。

这个名字来自北宋毕昇发明的**活字印刷术**。古代的雕版印刷，每印一本书就要刻一整块木板，改一个字就要重刻。毕昇的做法是把每个字单独刻成小块，排版时按需组合。印完拆下来，下次还能用。

MovableType 就是这个思路在现代前端表单里的应用。

---

## 二、三分钟上手

先说明一下技术前提：MovableType 基于 **React** 和 **Ant Design 4** 的 Form 架构。它不是重新发明一套表单体系，而是站在 antd 的肩膀上——校验、数据收集、状态管理这些脏活累活全部交给 antd 处理，MovableType 只负责把 JSON 配置翻译成 antd 的 Form.Item 和组件。

所以如果你熟悉 antd 的表单，上手 MovableType 几乎没有任何学习成本。

假设你要做一个"企业信息"表单，有三个字段：企业名称、注册资本、成立日期。

传统做法：手写 JSX，写校验规则，写布局。MovableType 的做法分三步：

> **安装**

```bash
npm install movable-type
```

MovableType 基于 **React 17+** 和 **Ant Design 4**，使用前请确保项目已安装这两个依赖。

### 第一步：定义字段池

把每个可能的字段都定义好，像准备一盒字模：

```ts
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
```

字段池是**全局复用**的。项目里其他地方需要"企业名称"这个字段，直接引用，不用重新定义。

### 第二步：写表单配置

告诉引擎这次要摆哪些字段、怎么分组、几列布局：

```ts
const config = {
  code: 'enterprise_info',
  name: '企业信息',
  sections: [
    {
      key: 'basic',
      title: '基本信息',
      fields: ['companyName', 'registerCapital', 'establishDate'],
      columns: 2,  // 两列布局
    },
  ],
}
```

### 第三步：使用
:::demo
```tsx
import React from 'react'
import { Form } from 'antd'
import 'antd/dist/antd.css';
import { MovableType } from 'movable-type'

export default function MyPage() {
  const [form] = Form.useForm()
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
    registerPerson: {
      name: 'registerPerson',
      label: '法人代表',
      component: 'Input',
      required: true,
    },
    establishDate: {
      name: 'establishDate',
      label: '成立日期',
      component: 'DatePicker',
      required: true,
    },
  }
  const config = {
    code: 'enterprise_info',
    name: '企业信息',
    sections: [
      {
        key: 'basic',
        title: '基本信息',
        fields: ['companyName', 'registerCapital', 'registerPerson', 'establishDate'],
        columns: 2,  // 两列布局
      },
    ],
  }

  return (
    <Form form={form}>
      <MovableType config={config} fields={fields} />
    </Form>
  )
}
```
:::

三行核心代码，一个带布局、带校验的表单就出来了。

---

## 三、核心概念：活字印刷的三要素

理解 MovableType，关键是理解三个概念，它们正好对应活字印刷的三个环节：

<img src="https://blog.7hihi.com/MovableType/aiDrivenMovable.jpeg" width="100%" alt="MovableType 架构图" style="display:block;margin:16px auto;border-radius:8px;" />

| 概念 | 活字印刷的类比 | 作用 |
|------|--------------|------|
| **字段池 (fields)** | 字模仓库 | 所有可用字段的完整定义 |
| **表单配置 (config)** | 排版师傅 | 决定某张表单用哪些字段、怎么分组、怎么布局 |
| **组件注册表 (components)** | 特殊字体 | 自定义组件的加载方式，扩展引擎的渲染能力 |

**字段池**只管"这个字模长什么样"，**配置**只管"这次怎么排版"。两者解耦，所以同一份字段池可以被 N 个表单配置复用。

---

## 四、字段长什么样？

一个字段定义（FieldDescriptor）的核心属性就这些：

```ts
{
  name: 'fieldName',      // 字段名，支持嵌套路径如 ['finance', 'amount']
  label: '显示标签',
  component: 'Input',     // 用什么组件渲染
  required: true,         // 是否必填
  options: [...],         // 静态选项（Select / RadioGroup 用）
  visible: true,          // 是否显示
  rules: [...],           // 自定义校验规则
}
```

这里有一个很重要的设计：**字段定义把 `Form.Item` 的属性和组件的 props 整合在了一起**。

像 `label`、`required`、`rules`、`visible` 这些，是 `Form.Item` 和布局关心的；而 `placeholder`、`options`、`colSpan` 这些，是组件自己关心的。在传统开发里，你得分别在 `<Form.Item>` 标签和组件标签上写两次。在 MovableType 里，你写在一个对象里就行，引擎会自动分拣。

```ts
{
  name: 'remark',
  label: '备注',           // Form.Item 用
  component: 'InputTextArea',
  required: true,          // Form.Item 用
  placeholder: '请输入备注', // 组件用
  colSpan: 12,                // 布局用
}
```

你不用记住哪个属性属于谁，按直觉写就好。

其他属性会自动透传给底层组件，比如给 Input 加 `placeholder`，直接在字段定义里写就行：

```ts
{
  name: 'remark',
  label: '备注',
  component: 'InputTextArea',
  placeholder: '请输入备注信息',
  colSpan: 12,
}
```

MovableType 内置了常用的表单组件：

- `Input` / `InputTextArea` / `InputMoney` —— 文本输入
- `Select` / `Cascader` / `RadioGroup` / `Checkbox` —— 选择类
- `DatePicker` / `TimePicker` —— 时间选择
- `Switch` —— 开关
- `Hidden` —— 隐藏字段（不渲染，仅用于数据占位）

如果不够用，后面会讲怎么扩展自定义组件。

---

## 五、布局系统：你熟悉的 antd Grid

MovableType 没有自创布局语法，内部直接复用 antd 的 24 栅格系统。如果你用过 `<Row>` 和 `<Col>`，这里没有任何新概念。

### 5.1 区块列数：一键多列

`section.columns` 支持 1 / 2 / 3 列，引擎自动换算成 antd 的 `span`：

```ts
{
  key: 'basic',
  title: '基本信息',
  fields: ['companyName', 'registerCapital', 'establishDate'],
  columns: 2,  // 两列：每个字段自动 span=12
}
```

::::demo
```tsx
import React from 'react'
import { Form } from 'antd'
import 'antd/dist/antd.css';
import { MovableType } from 'movable-type'

export default function ColumnsDemo() {
  const [form] = Form.useForm()
  const fields = {
    name: { name: 'name', label: '姓名', component: 'Input' },
    phone: { name: 'phone', label: '电话', component: 'Input' },
    email: { name: 'email', label: '邮箱', component: 'Input' },
    city: { name: 'city', label: '城市', component: 'Input' },
    company: { name: 'company', label: '公司', component: 'Input' },
    job: { name: 'job', label: '职位', component: 'Input' },
  }
  const config = {
    code: 'columns_demo',
    sections: [{
      key: 's1',
      title: '联系方式',
      fields: ['name', 'phone', 'email', 'city', 'company', 'job'],
      columns: 3,
    }],
  }

  return (
    <Form form={form}>
      <MovableType config={config} fields={fields} />
    </Form>
  )
}
```
::::

### 5.2 字段级覆盖：打破均分

如果某个字段特别短，想在一行里塞多个，直接在字段定义里写 `colSpan`：

```ts
{
  name: 'verifyCode',
  label: '验证码',
  component: 'Input',
  colSpan: 8,  // 只占 1/3 行
}
```

没有 `colSpan` 的字段继续跟随区块默认列数。

### 5.3 标签与输入框比例

和原生 antd 一样，支持 `labelCol` / `wrapperCol`，可在区块或表单顶层配置：

```ts
{
  key: 'basic',
  title: '信息',
  fields: [...],
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
```

### 5.4 卡片与平铺

`title` 有值时，引擎自动用 `Card` 包裹该区块；不传 `title` 则字段平铺渲染。也可用 `cardProps` 传入自定义 Card 属性。

::::demo
```tsx
import React from 'react'
import { Form } from 'antd'
import 'antd/dist/antd.css';
import { MovableType } from 'movable-type'

export default function CardDemo() {
  const [form] = Form.useForm()
  const fields = {
    name: { name: 'name', label: '姓名', component: 'Input' },
    phone: { name: 'phone', label: '电话', component: 'Input' },
    email: { name: 'email', label: '邮箱', component: 'Input' },
    address: { name: 'address', label: '地址', component: 'Input' },
  }
  const config = {
    code: 'card_demo',
    sections: [
      {
        key: 'card',
        title: '基本信息',
        fields: ['name', 'phone'],
        columns: 2,
      },
      {
        key: 'flat',
        fields: ['email', 'address'],
        columns: 2,
      },
    ],
  }

  return (
    <Form form={form}>
      <MovableType config={config} fields={fields} />
    </Form>
  )
}
```
::::

### 5.5 自定义布局（区块级）

当 Grid 不够用，比如需要左右分栏、表格嵌套表单等，给 `section` 指定 `component`，引擎会把整个区块交给你渲染，内部布局完全由你控制。

```ts
{
  key: 'complex',
  component: 'MyCustomLayout',  // 自定义组件接管
  fields: [...],
}
```

::::demo
```tsx
import React from 'react'
import { Form, Row, Col, Avatar } from 'antd'
import 'antd/dist/antd.css';
import { MovableType, FieldSlot } from 'movable-type'

const UserInfoLayout = ({ section, fields, mode, components }: any) => (
  <Row gutter={24}>
    <Col span={12}>
      <div style={{ textAlign: 'center', padding: 24, background: '#f6ffed', borderRadius: 8 }}>
        <Avatar size={80} style={{ backgroundColor: '#52c41a' }}>张三</Avatar>
        <p style={{ marginTop: 12, color: '#666' }}>左侧自定义展示区</p>
      </div>
    </Col>
    <Col span={12}>
      {section.fields.map((fieldName: string) => (
        <FieldSlot
          key={fieldName}
          descriptor={fields[fieldName]}
          mode={mode}
          components={components}
          fields={fields}
          colSpan={24}
        />
      ))}
    </Col>
  </Row>
)

export default function CustomLayoutDemo() {
  const [form] = Form.useForm()
  const fields = {
    name: { name: 'name', label: '姓名', component: 'Input', required: true },
    phone: { name: 'phone', label: '电话', component: 'Input' },
    email: { name: 'email', label: '邮箱', component: 'Input' },
  }
  const config = {
    code: 'layout_demo',
    sections: [{
      key: 's1',
      component: 'UserInfoLayout',
      fields: ['name', 'phone', 'email'],
    }],
  }
  const components = {
    UserInfoLayout: () => Promise.resolve({ default: UserInfoLayout }),
  }

  return (
    <Form form={form}>
      <MovableType config={config} fields={fields} components={components} />
    </Form>
  )
}
```
::::

### 5.6 简单表单：不用分组

字段少的时候，连 `sections` 都不用写：

```ts
const config = {
  code: 'simple',
  fields: ['name', 'phone', 'email'],
  columns: 2,
}
```

::::demo
```tsx
import React from 'react'
import { Form } from 'antd'
import 'antd/dist/antd.css';
import { MovableType } from 'movable-type'

export default function SimpleFormDemo() {
  const [form] = Form.useForm()
  const fields = {
    name: { name: 'name', label: '姓名', component: 'Input', required: true },
    phone: { name: 'phone', label: '电话', component: 'Input', required: true },
  }
  const config = {
    code: 'simple',
    fields: ['name', 'phone'],
    columns: 2,
  }

  return (
    <Form form={form}>
      <MovableType config={config} fields={fields} />
    </Form>
  )
}
```
::::

引擎自动退化为单区块 Grid 渲染。

---

## 六、表单联动：字段之间的"对话"

实际业务中，表单字段往往不是孤立的。选了"企业"申请类型，才需要填写"企业名称"；选了省份，城市下拉框才需要更新。

MovableType 提供了三种联动方式，覆盖了绝大多数场景。

### 6.1 字段级联动：watch

`watch` 的意思是"我盯着谁，谁变了我就跟着变"。

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
    watch: {
      deps: ['applyType'],
      callback: (allValues) => {
        const isEnterprise = allValues.applyType === 'enterprise'
        return {
          visible: isEnterprise,   // 企业申请时才显示
          required: isEnterprise,  // 企业申请时才必填
        }
      },
    },
  },
}
```

当用户把申请类型从"个人"切换到"企业"，`companyName` 字段会自动出现，并且变成必填。切回去，它又自动隐藏。

不需要写 `useEffect`，不需要监听 `onChange`，声明式的写法非常直观。

::::demo
```tsx
import React from 'react'
import { Form } from 'antd'
import 'antd/dist/antd.css';
import { MovableType } from 'movable-type'

export default function WatchDemo() {
  const [form] = Form.useForm()
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
      watch: {
        deps: ['applyType'],
        callback: (allValues) => {
          const isEnterprise = allValues.applyType === 'enterprise'
          return {
            visible: isEnterprise,
            required: isEnterprise,
          }
        },
      },
    },
  }
  const config = {
    code: 'watch_demo',
    sections: [{ key: 's1', fields: ['applyType', 'companyName'] }],
  }

  return (
    <Form form={form}>
      <MovableType config={config} fields={fields} />
    </Form>
  )
}
```
::::

`watch` 的回调有两个参数。第一个是 `allValues`，也就是当前表单的所有值；第二个是 `form`，也就是 antd 的表单实例。**你可以用它来修改其他字段的值**。

比如，当申请类型切回"个人"时，顺手清空企业名称：

```ts
watch: {
  deps: ['applyType'],
  callback: (allValues, form) => {
    if (allValues.applyType !== 'enterprise') {
      form.setFieldsValue({ companyName: undefined })
    }
    return {
      visible: allValues.applyType === 'enterprise',
      disabled: allValues.applyType === 'personal',
    }
  },
}
```

注意返回值。`visible` 和 `required` 会交给 `Form.Item` 控制显隐和校验；而 `disabled` 这类属性则会透传给组件本身。**一句话：watch 的返回值是 `Form.Item` 和组件属性的组合，两边都能消费。**

### 6.2 异步选项加载：dataLoader

城市选择器的选项，往往依赖于省份。`dataLoader` 就是干这个的：

```ts
const fields = {
  city: {
    name: 'city',
    label: '城市',
    component: 'Select',
    dataLoader: {
      deps: ['province'],
      callback: async (deps) => {
        const { province } = deps
        if (!province) return []
        const res = await fetchCities(province)
        return res.data.map(item => ({ label: item.name, value: item.code }))
      },
    },
  },
}
```

 province 变了，引擎会自动重新加载城市列表， loading 状态也会自动处理。

::::demo
```tsx
import React from 'react'
import { Form } from 'antd'
import 'antd/dist/antd.css';
import { MovableType } from 'movable-type'

const cityMap: Record<string, { label: string; value: string }[]> = {
  beijing: [
    { label: '朝阳区', value: 'chaoyang' },
    { label: '海淀区', value: 'haidian' },
  ],
  shanghai: [
    { label: '浦东新区', value: 'pudong' },
    { label: '静安区', value: 'jingan' },
  ],
}

export default function DataLoaderDemo() {
  const [form] = Form.useForm()
  const fields = {
    province: {
      name: 'province',
      label: '省份',
      component: 'Select',
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
      ],
    },
    city: {
      name: 'city',
      label: '城市',
      component: 'Select',
      dataLoader: {
        deps: ['province'],
        callback: async (deps) => {
          const { province } = deps
          if (!province) return []
          await new Promise((r) => setTimeout(r, 500))
          return cityMap[province] || []
        },
      },
    },
  }
  const config = {
    code: 'loader_demo',
    sections: [{ key: 's1', fields: ['province', 'city'] }],
  }

  return (
    <Form form={form}>
      <MovableType config={config} fields={fields} />
    </Form>
  )
}
```
::::

### 6.3 区块级联动：Section watch

有时候不是某个字段要联动，而是整个区块（比如"企业信息"这一整组字段）要根据条件显隐：

```ts
const config = {
  sections: [
    {
      key: 'enterprise',
      title: '企业信息',
      fields: ['companyName', 'license'],
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

整个"企业信息"卡片会随申请类型自动出现或消失。

::::demo
```tsx
import React from 'react'
import { Form } from 'antd'
import 'antd/dist/antd.css';
import { MovableType } from 'movable-type'

export default function SectionWatchDemo() {
  const [form] = Form.useForm()
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
    },
    license: {
      name: 'license',
      label: '营业执照号',
      component: 'Input',
      required: true,
    },
  }
  const config = {
    code: 'section_watch_demo',
    sections: [
      {
        key: 'basic',
        fields: ['applyType'],
      },
      {
        key: 'enterprise',
        title: '企业信息',
        fields: ['companyName', 'license'],
        columns: 2,
        watch: {
          deps: ['applyType'],
          callback: (allValues) => ({
            visible: allValues.applyType === 'enterprise',
          }),
        },
      },
    ],
  }

  return (
    <Form form={form}>
      <MovableType config={config} fields={fields} />
    </Form>
  )
}
```
::::

---

## 七、自定义组件：你的"特殊字模"

内置组件不够用？比如需要一个特殊的"交易信息"卡片，或者一个带图表的复杂控件。

MovableType 支持自定义组件，而且不需要改引擎源码。

### 简单场景：同步渲染器

```ts
import { ComponentRenderer } from 'movable-type'

const MyRenderer: ComponentRenderer = {
  render: ({ label, mergedProps }) => (
    <MyCustomInput placeholder={`请输入${label}`} {...mergedProps} />
  ),
  viewFormatter: (value, ctx) => value ? `自定义前缀: ${value}` : '-',
}

<MovableType
  config={config}
  fields={fields}
  components={{ MyCustomInput: MyRenderer }}
/>
```

然后在字段定义里写 `component: 'MyCustomInput'` 即可。

::::demo
```tsx
import React, { useState } from 'react'
import { Form, Tag, Input } from 'antd'
import 'antd/dist/antd.css';
import { MovableType } from 'movable-type'

const TagInput = ({ value = [], onChange, ...props }: any) => {
  const [text, setText] = useState('')
  const add = () => {
    if (!text || value.includes(text)) return
    onChange?.([...value, text])
    setText('')
  }
  return (
    <div>
      {value.map((t: string) => (
        <Tag key={t} closable onClose={() => onChange?.(value.filter((v: string) => v !== t))}>
          {t}
        </Tag>
      ))}
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPressEnter={add}
        style={{ width: 120 }}
        placeholder="回车添加"
        {...props}
      />
    </div>
  )
}

export default function CustomComponentDemo() {
  const [form] = Form.useForm()
  const fields = {
    tags: {
      name: 'tags',
      label: '兴趣标签',
      component: 'TagInput',
    },
  }
  const components = {
    TagInput: {
      render: ({ mergedProps }: any) => <TagInput {...mergedProps} />,
      viewFormatter: (value: string[]) => value?.join('、') || '-',
    },
  }
  const config = {
    code: 'custom_demo',
    sections: [{ key: 's1', fields: ['tags'] }],
  }

  return (
    <Form form={form}>
      <MovableType config={config} fields={fields} components={components} />
    </Form>
  )
}
```
::::

### 复杂场景：异步懒加载

如果你的组件很大，或者想按需加载：

```ts
const components = {
  TradeInfo: () => import('./components/TradeInfo'),
  ComplexChart: () => import('./components/ComplexChart'),
}

<MovableType config={config} fields={fields} components={components} />
```

引擎内部会用 `React.lazy` + `Suspense` 处理加载，你什么都不用管。

---

## 八、查看模式：一套配置，两种面貌

很多项目里，编辑页和详情页长得几乎一样，只是一个是输入框，一个是纯文本。传统做法要写两套代码。

MovableType 的 `mode` 属性可以一键切换：

```ts
// 编辑模式
<MovableType config={config} fields={fields} mode="edit" />

// 查看模式
<MovableType config={config} fields={fields} mode="view" />
```

`mode="view"` 时，所有输入框自动变成纯文本展示。内置组件自带查看态的格式化逻辑（比如 Select 会自动匹配 options 显示 label），自定义组件可以通过 `viewFormatter` 自定义显示方式。

::::demo
```tsx
import React, { useState } from 'react'
import { Form, Switch } from 'antd'
import 'antd/dist/antd.css';
import { MovableType } from 'movable-type'

export default function ModeDemo() {
  const [form] = Form.useForm()
  const [mode, setMode] = useState<'edit' | 'view'>('edit')

  const fields = {
    name: { name: 'name', label: '姓名', component: 'Input', required: true },
    gender: {
      name: 'gender',
      label: '性别',
      component: 'Select',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
    birth: { name: 'birth', label: '出生日期', component: 'DatePicker' },
  }

  const config = {
    code: 'mode_demo',
    sections: [{ key: 's1', fields: ['name', 'gender', 'birth'] }],
  }

  return (
    <Form form={form} initialValues={{ name: '张三', gender: 'male' }}>
      <div style={{ marginBottom: 16 }}>
        <Switch
          checked={mode === 'view'}
          onChange={(c) => setMode(c ? 'view' : 'edit')}
          checkedChildren="查看"
          unCheckedChildren="编辑"
        />
      </div>
      <MovableType config={config} fields={fields} mode={mode} />
    </Form>
  )
}
```
::::

---

## 九、高级技巧

### 9.1 字段覆盖：同一张表单，不同场景

同一张申请表，在"新增"和"修改"场景下，某个字段的标签或必填状态可能不同。不需要重新定义字段池，用 `overrides` 微调：

```ts
const config = {
  code: 'edit_scene',
  name: '修改场景',
  sections: [...],
  overrides: {
    companyName: {
      label: '企业全称（变更后）',
      required: false,
    },
    registerCapital: {
      visible: false,
    },
  },
}
```

::::demo
```tsx
import React, { useState } from 'react'
import { Form, Switch } from 'antd'
import 'antd/dist/antd.css';
import { MovableType } from 'movable-type'

export default function OverridesDemo() {
  const [form] = Form.useForm()
  const [isEdit, setIsEdit] = useState(false)

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

  const config = {
    code: 'scene_demo',
    name: isEdit ? '修改场景' : '新增场景',
    sections: [{
      key: 's1',
      title: '企业信息',
      fields: ['companyName', 'registerCapital', 'establishDate'],
      columns: 2,
    }],
    overrides: isEdit
      ? {
          companyName: { label: '企业全称（变更后）' },
          registerCapital: { visible: false },
        }
      : {},
  }

  return (
    <Form form={form} initialValues={{ companyName: '示例企业' }}>
      <div style={{ marginBottom: 16 }}>
        <Switch
          checked={isEdit}
          onChange={setIsEdit}
          checkedChildren="修改场景"
          unCheckedChildren="新增场景"
        />
      </div>
      <MovableType config={config} fields={fields} />
    </Form>
  )
}
```
:::

### 9.2 提交前数据转换

有些数据在提交前需要简单转换，比如金额元转分：

```ts
const config = {
  sections: [...],
  submitAdapter: (data) => ({
    ...data,
    amount: data.amount ? Math.round(data.amount * 100) : 0,
  }),
}
```

### 9.3 简单表单：不用分组

如果表单很简单，只有三五个字段，不想写 `sections`，可以直接用顶层字段：

```ts
const config = {
  code: 'simple',
  name: '简单表单',
  fields: ['name', 'phone', 'email'],
  columns: 2,
}
```

引擎会自动退化为单区块渲染，代码更简洁。

---

## 十、引擎不负责什么？

MovableType 的定位是**纯渲染引擎**，它只管把配置变成界面和交互，不管业务生命周期。

以下这些事情，你需要在外层自己处理：

- **Form 实例创建**：`const [form] = Form.useForm()`
- **初始数据加载**：从接口读取后 `form.setFieldsValue(data)`
- **提交处理**：`onFinish` 里调接口
- **草稿自动保存**：`onValuesChange` 里 debounce 写 localStorage

这其实是好事。引擎不插手状态管理，你就能保留对表单的完全控制权，想怎么扩展都行。

下面是一个标准的外壳示例：

```ts
import { Form, Button, message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { MovableType } from 'movable-type'

export default function StandardFormPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 初始化
  useEffect(() => {
    // form.setFieldsValue({ companyName: '示例企业' })
  }, [])

  // 自动存草稿
  const handleValuesChange = useCallback(
    debounce(() => {
      localStorage.setItem(`draft_${config.code}`, JSON.stringify(form.getFieldsValue()))
    }, 1000),
    [form]
  )

  // 提交
  const handleFinish = async (values) => {
    setLoading(true)
    try {
      await submitApi(values)
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

---

## 十一、总结一下

**字段定义一次，表单配置百次复用。**

- 字段池 = 字模仓库，全局复用
- 表单配置 = 排版方案，按需组合
- 组件注册表 = 扩展字体，随加随用
- 联动机制 = 声明式"对话"
- 查看模式 = 一份配置，两种面貌

它不会让你少写代码，但会让你写的代码**更结构化、更可复用、更易维护**——产品经理改需求时，你改的是几行配置，而不是几十个组件文件。这就是活字印刷术在 21 世纪的回响。

MovableType 的设计哲学是**少就是多**：没有自创的状态管理、校验语法、布局系统，整个引擎只保留三个核心概念。极简的架构让配置成为纯粹的结构化数据——而大语言模型最擅长生成的，正是结构化数据。

因此，MovableType 不是"能配合 AI 使用"，它是**为 AI 时代的表单开发而生**。
