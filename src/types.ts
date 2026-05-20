/**
 * 申请配置引擎类型定义
 * 与业务配置解耦，供引擎和业务层共用
 */

export interface OptionItem {
  label: string
  value: any
}

export interface FieldDescriptor {
  /** 强制指定字段模式（优先级高于全局 mode）：edit | view */
  mode?: 'edit' | 'view'
  /** 表单字段路径：支持扁平字符串 'fieldName' 或嵌套路径 ['finance', 'amount'] */
  name: string | string[]
  label: string
  /** 内置组件：Input / InputMoney / DatePicker / TradeInfo / Select / Checkbox / Hidden；其他值视为自定义组件路径 */
  component: string
  required?: boolean
  /** 静态选项（component === 'Select' 时生效） */
  options?: OptionItem[]
  /**
   * 监听依赖并响应：返回值与静态定义浅合并，可返回任意属性
   * 也可通过 callback 的第二个参数 form 做副作用（如清空关联字段）
   */
  watch?: {
    deps: string[]
    callback: (allValues: Record<string, any>, form: any) => Record<string, any> | void
  }
  /**
   * 动态选项加载器
   * 回调接收依赖字段值（key 为字段池 key），返回选项列表
   */
  dataLoader?: {
    deps?: string[]
    callback: (deps: Record<string, any>, form: any) => Promise<OptionItem[]>
  }
  /** 显隐控制（静态配置或通过 watch 动态返回均可） */
  visible?: boolean
  /** 表单校验规则（优先级高于 required 自动生成的规则） */
  rules?: any[]
  /** 隐藏 label，只保留输入框 */
  hideLabel?: boolean
  /** 额外 props */
  [key: string]: any
}

export interface SectionDescriptor {
  key: string
  title?: string
  /** 列数：1 单列 / 2 双列 / 3 三列（无 component 时走默认 grid） */
  columns?: 1 | 2 | 3
  /** 字段名列表，引擎按 name 去 defaultFields 查找完整定义 */
  fields: string[]
  /** 自定义区块组件路径（有值时走自定义布局，由 components 注册表加载） */
  component?: string
  /**
   * 监听依赖并响应：可返回任意属性（如 visible/title/columns）
   * 也可通过 callback 的第二个参数 form 做副作用
   */
  watch?: {
    deps: string[]
    callback: (allValues: Record<string, any>, form: any) => Record<string, any> | void
  }
  labelCol?: { span?: number; offset?: number }
  wrapperCol?: { span?: number; offset?: number }
  cardProps?: Record<string, any>
    /** 额外 props */
  [key: string]: any
}

export interface Config {
  code: string
  name: string
  /** 按模块分组的能力描述。不传时退化为简单表单，取顶层 fields / columns */
  sections?: SectionDescriptor[]
  /** 简单表单字段列表（sections 未传时生效） */
  fields?: string[]
  /** 简单表单列数（sections 未传时生效，默认 1） */
  columns?: 1 | 2 | 3
  labelCol?: { span?: number; offset?: number }
  wrapperCol?: { span?: number; offset?: number }
  /** 字段覆盖：按字段名做浅合并，可改 label、required、props 等 */
  overrides?: Record<string, Partial<FieldDescriptor>>
  /** 提交前数据转换（如金额元转分、字段重命名） */
  submitAdapter?: (data: Record<string, any>) => Record<string, any>
}

/** 统一组件注册表项：同步渲染器 或 异步懒加载函数 */
export type ComponentRegistryItem = ComponentRenderer | (() => Promise<any>)

/**
 * 配置引擎的统一配置入口
 * 将 fields、components、Configs 三合一，减少调用方导入成本
 */
export interface MovableTypeConfig {
  /** 表单配置表：key -> Config */
  Configs: Record<string, Config>
  /** 全局字段池：字段名 -> 字段定义 */
  fields: Record<string, FieldDescriptor>
  /** 统一组件注册表：同步渲染器（ComponentRenderer）或异步懒加载函数。与内置合并，同名覆盖 */
  components?: Record<string, ComponentRegistryItem>
}

/** 表单保存用途枚举 */
export type SavePurpose = 'submit' | 'draft'

/** 组件注册表项：引擎内置组件和外部注册组件统一接口 */
export interface ComponentRenderer {
  /** 渲染编辑态组件 */
  render: (ctx: ComponentRenderContext) => React.ReactNode
  /** Form.Item 的 valuePropName（如 Checkbox/Switch 需设为 'checked'） */
  valuePropName?: string
  /** 查看态显示文本转换（不配则默认 fieldValue ?? '-'） */
  viewFormatter?: (value: any, ctx: ComponentRenderContext) => string
}

/** 组件渲染上下文：注册表项 render/viewFormatter 的入参 */
export interface ComponentRenderContext {
  label: string
  mergedProps: Record<string, any>
  dynamicOptions: OptionItem[]
  optionsLoading: boolean
  options?: OptionItem[]
}

/**
 * 字段级扩展组件（第 3 方自定义控件）接收的 props
 * 引擎通过 React.lazy + Suspense 动态加载，props 由引擎在加载后透传
 * 扩展组件自行包裹 Form.Item，引擎不干预其内部布局与表单绑定
 */
export interface ExtensionComponentProps {
  /** 当前表单实例 */
  form: any
  /** 当前全部表单值 */
  values: Record<string, any>
  /** 字段路径（支持嵌套） */
  name: string | string[]
  /** 标签文案 */
  label: string
  /** 校验规则（已按 required 兜底） */
  rules?: any[]
  /** 当前模式：edit / view */
  mode?: 'edit' | 'view'
  /** 是否必填 */
  required?: boolean
  /** 隐藏 label */
  hideLabel?: boolean
  /** 引擎传入的 Form.Item 通用 props */
  formItemProps?: Record<string, any>
  /** 动态选项（dataLoader 加载后） */
  dynamicOptions?: OptionItem[]
  /** 选项加载中 */
  optionsLoading?: boolean
  /** 原始静态选项 */
  options?: OptionItem[]
  /** 当前字段值 */
  value?: any
  /** 字段池（复合字段内部可引用其他字段配置） */
  fields?: Record<string, FieldDescriptor>
  /** 透传的额外 props（来自 FieldDescriptor 的其余属性） */
  [key: string]: any
}
