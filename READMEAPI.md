---
order: 4
---

# MovableType API

🔗 [GitHub 仓库](https://github.com/zakihuang/MovableType)

## 核心组件

### `<MovableType />`

表单渲染引擎入口。纯渲染，不持有状态，必须由外层 `<Form>` 包裹。

```ts
import { Form } from 'antd'
import { MovableType } from 'movable-type'

<Form form={form}>
  <MovableType config={config} fields={fields} mode="edit" components={components} />
</Form>
```

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `config` | `Config` | 是 | 当前表单配置 |
| `fields` | `Record<string, FieldDescriptor>` | 是 | 全局字段池 |
| `mode` | `'edit' \| 'view'` | 否 | 编辑/查看模式，默认 `edit` |
| `components` | `Record<string, ComponentRegistryItem>` | 否 | 自定义组件注册表，同名覆盖内置 |

---

## 配置类型

### `Config`

```ts
interface Config {
  code: string              // 表单唯一标识
  name: string              // 表单名称
  sections?: SectionDescriptor[]   // 区块列表（传了走区块布局）
  fields?: string[]         // 简单表单字段名（sections 未传时生效）
  columns?: 1 | 2 | 3       // 简单表单列数，默认 1
  labelCol?: { span?, offset? }
  wrapperCol?: { span?, offset? }
  overrides?: Record<string, Partial<FieldDescriptor>>  // 字段级覆盖
  submitAdapter?: (data) => Record<string, any>         // 提交前数据转换
}
```

### `SectionDescriptor`

```ts
interface SectionDescriptor {
  key: string
  title?: string
  columns?: 1 | 2 | 3       // 列数
  fields: string[]          // 字段名列表
  component?: string        // 自定义区块组件名（走 components 注册表懒加载）
  watch?: {                 // 区块级联动
    deps: string[]
    callback: (allValues, form) => Partial<SectionDescriptor> | void
  }
  labelCol?: { span?, offset? }
  wrapperCol?: { span?, offset? }
  cardProps?: Record<string, any>
}
```

### `FieldDescriptor`

```ts
interface FieldDescriptor {
  name: string | string[]   // 字段路径，支持嵌套 ['finance', 'amount']
  label: string
  component: string         // 组件名，内置或自定义
  required?: boolean
  options?: OptionItem[]    // 静态选项
  visible?: boolean         // 显隐
  hideLabel?: boolean       // 隐藏 label
  rules?: any[]             // 校验规则（优先级高于 required 自动生成）
  watch?: {                 // 字段级联动
    deps: string[]
    callback: (allValues, form) => Partial<FieldDescriptor> | void
  }
  dataLoader?: {            // 动态选项加载
    deps?: string[]
    callback: (deps, form) => Promise<OptionItem[]>
  }
  [key: string]: any        // 其余属性透传给组件
}
```

---

## 自定义组件

### 同步渲染器

```ts
import { ComponentRenderer } from 'movable-type'

const MyRenderer: ComponentRenderer = {
  render: ({ label, mergedProps, dynamicOptions }) => (
    <MyInput placeholder={`请输入${label}`} {...mergedProps} />
  ),
  viewFormatter: (value) => value ? `前缀: ${value}` : '-',
  valuePropName: 'value',   // 非 value 属性绑定时指定
}
```

### 异步组件（懒加载）

```ts
const components = {
  TradeInfo: () => import('./components/TradeInfo'),
}
```

异步组件接收的 `props`：

```ts
{
  form, values, name, label, rules, mode, required,
  hideLabel, formItemProps, dynamicOptions, optionsLoading,
  options, value, fields, ...mergedProps
}
```

### 自定义区块

`SectionDescriptor.component` 指向一个懒加载函数，接收：

```ts
{
  section: SectionDescriptor
  fields: Record<string, FieldDescriptor>
  mode: 'edit' | 'view'
  components: Record<string, ComponentRegistryItem>
}
```

---

## 内置组件

| 组件名 | 说明 | 查看态 |
|--------|------|--------|
| `Input` | 文本输入 | 原值 |
| `InputTextArea` | 多行文本 | 原值 |
| `InputMoney` | 金额输入（¥ 前缀） | 原值 |
| `Select` | 下拉选择 | 匹配 options 显示 label |
| `Cascader` | 级联选择 | 多级 label 拼接 |
| `DatePicker` | 日期选择 | 格式化 `YYYY-MM-DD` |
| `TimePicker` | 时间选择 | 格式化 `HH:mm:ss` |
| `Switch` | 开关 | 是/否 |
| `Checkbox` | 复选框 | 是/否 |
| `RadioGroup` | 单选组 | 匹配 options 显示 label |
| `Hidden` | 隐藏字段 | — |

---

## 导出项

```ts
export { MovableType, FieldSlot }
export type {
  FieldDescriptor, SectionDescriptor, Config,
  ComponentRenderer, ComponentRenderContext,
  ComponentRegistryItem, ExtensionComponentProps,
  OptionItem, SavePurpose, MovableTypeConfig,
}
```
