import { useCallback, useEffect, useMemo, useState } from 'react'
import { Col, Form } from 'antd'
import React from 'react'
import { ComponentRenderer, ComponentRenderContext, ComponentRegistryItem, FieldDescriptor, OptionItem } from './types'
import { builtInRenderers } from './builtInRenderers'
import { getValueByPath } from './utils'

// ==========================================
// 字段自治渲染核心（纯渲染，无监听，由外层 Form.Item shouldUpdate 精确控制重渲染）
// ==========================================
function FieldSlotCore({
  descriptor,
  mode = 'edit',
  components,
  formItemProps,
  fields,
}: {
  descriptor: FieldDescriptor
  mode?: 'edit' | 'view'
  components?: Record<string, ComponentRegistryItem>
  formItemProps?: Record<string, any>
  /** 字段池，用于解析 dependencies 的 namePath */
  fields: Record<string, FieldDescriptor>
}) {
  const form = Form.useFormInstance()
  const allValues = form.getFieldsValue()

  // ---- 解析 watch / dataLoader ----
  const watchFn = descriptor.watch?.callback
  const dataLoaderDeps = descriptor.dataLoader?.deps || []
  const dataLoaderFn = descriptor.dataLoader?.callback

  // ---- watch 统一动态属性计算 ----
  const computed = watchFn ? watchFn(allValues, form) : {}
  const resolved = { ...descriptor, ...computed }
  const { component, name, label, required, options, rules, watch, dataLoader, visible, hideLabel, ...mergedProps } = resolved

  // 提取当前字段关心的依赖值（通过字段池 key 找到对应 namePath，再取值）
  const depValues: Record<string, any> = {}
  dataLoaderDeps.forEach((depKey) => {
    if (depKey == null) return
    const depField = fields[depKey]
    const depName = depField?.name ?? depKey
    depValues[depKey] = form.getFieldValue(depName)
  })
  const depKey = JSON.stringify(depValues)

  // ---- 数据联动：动态选项加载 ----
  const [dynamicOptions, setDynamicOptions] = useState<OptionItem[]>(options || [])
  const [optionsLoading, setOptionsLoading] = useState(false)

  useEffect(() => {
    if (!dataLoaderFn) return
    setOptionsLoading(true)
    dataLoaderFn(depValues, form).then((data) => {
      setDynamicOptions(data)
      setOptionsLoading(false)
    })
  }, [depKey, dataLoaderFn])

  // ---- 合并注册表（内置 + 外部）----
  const allComponents = useMemo(() => ({ ...builtInRenderers, ...components }), [components])
  const item = allComponents[component]

  // ---- 校验规则 ----
  const fieldRules = rules ?? (required ? [{ required: true, message: `${component === 'Select' ? '请选择' : '请输入'}${label}` }] : [])

  // 未找到组件
  if (!item) {
    console.warn(`[MovableType] 未找到组件: ${component}`)
    return (
      <Form.Item name={name} label={label}>
        <span style={{ color: '#ff4d4f' }}>组件加载失败: {component}</span>
      </Form.Item>
    )
  }

  // ---- 异步懒加载组件（完整组件，引擎只负责挂载）----
  if (typeof item === 'function') {
    const ExtComponent = React.lazy(item)
    return (
      <React.Suspense fallback={null}>
        <ExtComponent
          form={form}
          values={allValues}
          name={name}
          label={label}
          rules={fieldRules}
          mode={mode}
          required={required}
          hideLabel={hideLabel}
          formItemProps={formItemProps}
          dynamicOptions={dynamicOptions}
          optionsLoading={optionsLoading}
          options={options}
          value={form.getFieldValue(name)}
          fields={fields}
          {...mergedProps}
        />
      </React.Suspense>
    )
  }

  // ---- 同步渲染器（引擎包 Form.Item、rules、viewFormatter）----
  const renderer = item as ComponentRenderer
  const ctx: ComponentRenderContext = { label, mergedProps, dynamicOptions, optionsLoading, options }

  // ---- 查看态 ----
  if (mode === 'view') {
    const fieldValue = form.getFieldValue(name)
    const displayText = renderer.viewFormatter
      ? renderer.viewFormatter(fieldValue, ctx)
      : (fieldValue ?? '-')
    return (
      <Form.Item name={name} label={hideLabel ? undefined : label} {...formItemProps} {...mergedProps}>
        <span>{displayText}</span>
      </Form.Item>
    )
  }

  // ---- 编辑态 ----
  return (
    <Form.Item name={name} label={hideLabel ? undefined : label} rules={fieldRules} valuePropName={renderer.valuePropName} {...formItemProps} {...mergedProps}>
      {renderer.render(ctx)}
    </Form.Item>
  )
}

// ==========================================
// 字段自治渲染外壳（form-driven：shouldUpdate 精确控制重渲染）
// ==========================================
export function FieldSlot({
  descriptor,
  mode = 'edit',
  components,
  formItemProps,
  fields,
  colSpan,
}: {
  descriptor: FieldDescriptor
  mode?: 'edit' | 'view'
  components?: Record<string, ComponentRegistryItem>
  formItemProps?: Record<string, any>
  /** 字段池，用于解析 dependencies */
  fields: Record<string, FieldDescriptor>
  /** 占用栅格数；传入时 FieldSlot 内部自包 Col，隐藏时不占位 */
  colSpan?: number
}) {
  const { component } = descriptor

  // ---- Hidden 字段：由 SectionRenderCore 统一渲染，FieldSlot 不重复渲染 ----
  if (component === 'Hidden') {
    return null
  }

  const watchDeps = descriptor.watch?.deps || []
  const dataLoaderDeps = descriptor.dataLoader?.deps || []
  const allDeps = Array.from(new Set(watchDeps.concat(dataLoaderDeps)))
  // watch 或 dataLoader 有配置就要监听
  const needsWatch = !!(allDeps.length || descriptor.watch || descriptor.dataLoader)

  // ---- 无联动需求，零监听开销 ----
  if (!needsWatch) {
    const visible = (descriptor as any).visible !== false
    if (!visible) return null
    const resolvedMode = (descriptor as any).mode ?? mode
    const core = <FieldSlotCore descriptor={descriptor} mode={resolvedMode} components={components} formItemProps={formItemProps} fields={fields} />
    return colSpan != null ? <Col span={colSpan}>{core}</Col> : core
  }

  const shouldUpdate = useCallback((prev: any, cur: any) => {
    if (!allDeps.length) return false
    return allDeps.some((depKey) => {
      const depField = fields[depKey]
      const depName = depField?.name ?? depKey
      return getValueByPath(prev, depName) !== getValueByPath(cur, depName)
    })
  }, [allDeps, fields])

  return (
    <Form.Item noStyle shouldUpdate={shouldUpdate}>
      {(form) => {
        // ---- 显隐联动上移到外壳，隐藏时不渲染 FieldSlotCore，避免 Hooks 空跑 ----
        const allValues = form.getFieldsValue()
        const watchFn = descriptor.watch?.callback
        const computed = watchFn ? watchFn(allValues, form) : {}
        const resolved = { ...descriptor, ...computed }
        const visible = (resolved as any).visible !== false
        if (!visible) return null
        const resolvedMode = (resolved as any).mode ?? mode
        const core = <FieldSlotCore descriptor={resolved as FieldDescriptor} mode={resolvedMode} components={components} formItemProps={formItemProps} fields={fields} />
        return colSpan != null ? <Col span={colSpan}>{core}</Col> : core
      }}
    </Form.Item>
  )
}
