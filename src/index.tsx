import React from 'react'
import { FormConfig, ComponentRegistryItem, FieldDescriptor, SectionDescriptor } from './types'
import { SectionRender } from './SectionRender'

// ==========================================
// 表单渲染引擎（纯渲染引擎，Form 由外部包裹）
// ==========================================
export const MovableType: React.FC<{
  /** 当前要渲染的表单配置（由外部自行决定从 formConfigs 中选取） */
  config: FormConfig
  mode?: 'edit' | 'view'
  /** 全局字段池 */
  fields: Record<string, FieldDescriptor>
  /** 统一组件注册表（与内置合并，同名覆盖） */
  components?: Record<string, ComponentRegistryItem>
}> = ({ config, mode = 'edit', fields, components: externalComponents }) => {
  const components = externalComponents

  // ---- 简单表单退化：无 sections 时取顶层 fields / columns ----
  const sections = config.sections ?? [
    { key: 'default', fields: config.fields ?? [], columns: config.columns, labelCol: config.labelCol, wrapperCol: config.wrapperCol } as SectionDescriptor,
  ]

  return (
    <>
      {sections.map((section) => (
        <SectionRender
          key={section.key}
          section={section}
          overrides={config.overrides}
          mode={mode}
          fields={fields}
          components={components}
        />
      ))}
    </>
  )
}

export { FieldSlot } from './FieldSlot'
export * from './types'
