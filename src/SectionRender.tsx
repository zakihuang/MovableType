import React, { useCallback, useMemo } from 'react'
import { Card, Form, Row } from 'antd'
import { ComponentRegistryItem, FieldDescriptor, SectionDescriptor } from './types'
import { FieldSlot } from './FieldSlot'
import { getValueByPath } from './utils'

// ==========================================
// 模块（Section）渲染核心
// ==========================================
interface SectionRenderCoreProps {
  section: SectionDescriptor
  overrides?: Record<string, Partial<FieldDescriptor>>
  mode?: 'edit' | 'view'
  fields: Record<string, FieldDescriptor>
  components?: Record<string, ComponentRegistryItem>
}

const SectionRenderCore: React.FC<SectionRenderCoreProps> = ({
  section,
  overrides,
  mode,
  fields,
  components,
}) => {
  const colSpan = useMemo(() => {
    if (section.columns === 2) return 12
    if (section.columns === 3) return 8
    return 24
  }, [section.columns])

  // ---- 统一合并 overrides 到字段池，保证自定义布局也能拿到覆盖后的字段 ----
  const resolvedFields = useMemo(() => {
    if (!overrides) return fields
    const result: Record<string, FieldDescriptor> = { ...fields }
    Object.keys(overrides).forEach((key) => {
      if (fields[key]) {
        result[key] = { ...fields[key], ...overrides[key] } as FieldDescriptor
      }
    })
    return result
  }, [fields, overrides])

  // ---- Hidden 字段统一渲染（提前到 Section 层级，不依赖 FieldSlot）----
  const hiddenFieldKeys = useMemo(() => {
    return Object.keys(resolvedFields).filter((key) => resolvedFields[key].component === 'Hidden')
  }, [resolvedFields])
  const hiddenSection = hiddenFieldKeys.map((fieldKey) => (
    <Form.Item key={fieldKey} hidden name={resolvedFields[fieldKey].name}>
      <input type="hidden" />
    </Form.Item>
  ))

  // ---- 自定义布局：通过 components 加载业务组件，引擎仅负责挂载 ----
  if (section.component) {
    const item = components?.[section.component]
    if (typeof item !== 'function') {
      console.warn(`[MovableType] 未找到自定义区块组件（必须是懒加载函数）: ${section.component}`)
      const fallback = (
        <span style={{ color: '#ff4d4f' }}>自定义区块加载失败: {section.component}</span>
      )
    return section.title != null ? (
      <Card title={section.title} size="small" style={{ marginBottom: 16 }} bodyStyle={{ paddingBottom: 8 }} {...section.cardProps}>
        {fallback}
      </Card>
    ) : fallback
    }
    const CustomSection = React.lazy(item)
    const inner = (
      <React.Suspense fallback={null}>
        <CustomSection
          section={section}
          fields={resolvedFields}
          mode={mode}
          components={components}
        />
      </React.Suspense>
    )
    return section.title != null ? (
      <Card title={section.title} size="small" style={{ marginBottom: 16 }} bodyStyle={{ paddingBottom: 8 }} {...section.cardProps}>
        {hiddenSection}
        {inner}
      </Card>
    ) : (
      <>
        {hiddenSection}
        {inner}
      </>
    )
  }

  // ---- 标准网格布局 ----
  const grid = (
    <Row gutter={24}>
      {section.fields.map((fieldName) => {
        const field = resolvedFields[fieldName]
        if (!field) {
          console.warn(`[MovableType] 未找到字段定义: ${fieldName}`)
          return null
        }
        return (
          <FieldSlot key={fieldName} descriptor={field} mode={mode} components={components} fields={resolvedFields} colSpan={(field as any).colSpan ?? colSpan}
            formItemProps={{ labelCol: section.labelCol, wrapperCol: section.wrapperCol }} />
        )
      })}
    </Row>
  )

  return section.title != null ? (
    <Card title={section.title} size="small" style={{ marginBottom: 16 }} bodyStyle={{ paddingBottom: 8 }} {...section.cardProps}>
      {hiddenSection}
      {grid}
    </Card>
  ) : (
    <>
      {hiddenSection}
      {grid}
    </>
  )
}

// ==========================================
// 模块（Section）渲染外壳（shouldUpdate 精确控制重渲染）
// ==========================================
export const SectionRender: React.FC<SectionRenderCoreProps> = (props) => {
  const { section, fields } = props
  const watchDeps = section.watch?.deps || []
  // watch 有配置就要监听
  const needsWatch = !!(watchDeps.length || section.watch)

  if (!needsWatch) {
    return <SectionRenderCore {...props} />
  }

  const shouldUpdate = useCallback((prev: any, cur: any) => {
    if (!watchDeps.length) return false
    return watchDeps.some((depKey) => {
      const depField = fields[depKey]
      const depName = depField?.name ?? depKey
      return getValueByPath(prev, depName) !== getValueByPath(cur, depName)
    })
  }, [watchDeps, fields])

  return (
    <Form.Item noStyle shouldUpdate={shouldUpdate}>
      {(form) => {
        // ---- 显隐联动上移到外壳，隐藏时不渲染 SectionRenderCore，避免 Hooks 空跑 ----
        const allValues = form.getFieldsValue()
        const watchFn = section.watch?.callback
        const computed = watchFn ? watchFn(allValues, form) : {}
        const resolved = { ...section, ...computed }
        const visible = (resolved as any).visible !== false
        if (!visible) return null
        return <SectionRenderCore {...props} section={resolved as SectionDescriptor} />
      }}
    </Form.Item>
  )
}
