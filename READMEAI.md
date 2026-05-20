---
order: 3
---

# MovableType 为AI而生

<img src="/logo.svg" width="200" alt="MovableType AI" style="display:block;margin:24px auto;" />

> 当大语言模型成为 co-worker，我们需要的不是"AI 能写的代码"，而是"AI 最擅长生成的东西"。

---

## 一、代码不是最好的界面契约

让 AI 直接生成 JSX 表单，就像让翻译官逐字手写雕版——它能做到，但极易出错：

- **自由度过高**：同样的 Select 联动，10 个开发者能写出 10 种 `useEffect` 写法，AI 亦然。
- **难以验证**：生成的 JSX 有没有拼错变量名？依赖项是否遗漏？只能靠运行时报错。
- **需求即废稿**：产品说"把企业信息放第二行"，AI 生成的整块 JSX 都要重排。

**如果 AI 的输出物不是代码，而是结构化配置呢？**

```json
{
  "sections": [
    { "key": "basic", "title": "企业信息", "fields": ["name", "capital"], "columns": 2 }
  ]
}
```

这段 JSON 的语义是自我描述的。AI 生成它时，不需要理解 React 生命周期，不需要担心闭包陷阱，更不需要记住哪个 `onChange` 该联动哪个 `useEffect`。它只需要回答一个问题：**这张表单有哪些字段，怎么分组，什么关系？**

这正是 MovableType 的核心假设：**配置即契约，契约即代码。**

> 两种工作方式的对比：

<img src="/woodblockToMovabletype.jpeg" width="100%" alt="雕版印刷 vs 活字印刷" style="display:block;margin:16px auto;border-radius:8px;" />

---

## 二、活字印刷：一千年前的"组件化"

北宋毕昇的活字印刷术，核心洞察只有一条：

> **把"字"和"版"分开。字是复用的，版是一次性的。**

雕版印刷时代，每印一本书都要整块木板重刻，改一个字就得重来。毕昇把每个字刻成独立字模，排版时按需拣字、组合、印刷。印完拆版，字模回库，下次再用。

MovableType 把这个思路搬到前端表单：

| 活字印刷 | MovableType |
|---------|-------------|
| 字模仓库 | **字段池 (fields)** —— 每个字段定义一次，全局复用 |
| 排版方案 | **表单配置 (config)** —— 不同场景按需组合字段 |
| 特殊字体 | **组件注册表 (components)** —— 自定义渲染器即插即用 |

AI 生成表单时，不再是"写一页 React 组件"，而是完成两件事：

1. **造字模**：定义字段的语义（名称、标签、组件类型、校验规则）。
2. **排版面**：决定这张表单引用哪些字模、分几栏、如何联动。

两者解耦，意味着同一份字段池可以被 AI 在多个场景下复用——新增表单时，AI 只需重新排版，不需要重新造字。

> AI 驱动的活字排版架构：

<img src="/aiDrivenMovable.jpeg" width="100%" alt="AI 驱动 MovableType 架构" style="display:block;margin:16px auto;border-radius:8px;" />

---

## 三、为什么配置比 JSX 更适合 LLM？

### 3.1 结构化是 LLM 的母语

大语言模型在生成 JSON / YAML 等结构化数据时，准确率和一致性远高于生成自由代码。原因在于：

- **Schema 约束**：字段定义的键是固定的，AI 不会凭空发明一个 `rule` 而忘记写 `rules`。
- **局部修改安全**：把 `columns: 2` 改成 `columns: 3`，影响范围只限于布局，不会意外拆掉一个 `useEffect`。
- **可静态分析**：配置可以被程序校验（TypeScript 类型、JSON Schema），在运行之前就发现错误。

### 3.2 声明式联动 > 指令式代码

传统表单的联动逻辑是命令式的：

```ts
// AI 很容易在这里写错依赖项或忘记 cleanup
useEffect(() => {
  if (values.type !== 'enterprise') {
    form.setFieldsValue({ companyName: undefined });
  }
}, [values.type]);
```

MovableType 把它变成声明式：

```ts
watch: {
  deps: ['applyType'],
  callback: (allValues) => ({
    visible: allValues.applyType === 'enterprise',
  }),
}
```

AI 生成这段配置时，不需要理解 Hooks 规则，只需要描述业务关系：**"当申请类型为企业时，显示企业名称"**。引擎负责把声明翻译成正确的运行时行为。

---

## 四、AI 与 MovableType 的协作范式

### 范式一：自然语言 → 表单配置

```
用户：帮我做一个企业入驻申请表单，需要企业名称、注册资本、成立日期，
      三列布局，企业名称必填。

AI：
- 检查字段池是否已有 "企业名称" 等字段。
- 若有，直接引用；若无，生成新的字段定义并注入字段池。
- 生成 config，引用字段、设置 columns: 3、标注 required。
```

整个过程不需要生成任何 JSX。

### 范式二：需求变更 → 配置 diff

```
用户：把三列改成两列，注册资本挪到第二行。

AI：
- 修改 config.sections[0].columns: 2。
- 调整 config.sections[0].fields 数组顺序。

产出物是一个可读的 JSON diff，而不是一大段重排的 JSX。
```

### 范式三：表单审计 → 结构化审查

当 AI 需要检查"这张表单是否缺少手机号校验"时，审查 JSON 配置远比审查 JSX 容易：

```ts
// 在字段池里全局搜索
const phoneField = fields['phone'];
if (!phoneField?.rules?.some(r => r.pattern)) {
  return '手机号缺少正则校验';
}
```

这种审计可以程序化、自动化，而 JSX audit 几乎只能依赖 AST 解析。

---

## 五、设计原则：为 AI 降低认知负担

MovableType 的每一个设计决策，都遵循同一个原则：**让 AI 需要理解的上下文最少。**

| 设计 | 对 AI 的好处 |
|------|-------------|
| **纯渲染，不持有状态** | AI 不需要理解 React 状态管理，只需描述"有什么字段" |
| **字段池与配置解耦** | AI 可以分两步生成：先定义原子，再组合分子 |
| **内置组件自带查看态** | AI 不需要为 view 模式写额外的格式化逻辑 |
| **声明式 watch / dataLoader** | AI 用业务语言表达联动，不用写命令式代码 |
| **无自创布局语法** | 复用 antd 的 24 栅格，AI 只需知道 `span` 和 `columns` |
| **overrides 机制** | 同一张表单的衍生场景，AI 只需生成差异配置 |

最终的结果是：**AI 的产出物从"可能出错的代码"变成了"可验证的配置"。**

---

## 六、这不是低代码

MovableType 和低代码平台有本质区别：

- **低代码**说："别写代码了，来拖拖拽拽。"它的终点是封闭的平台。
- **MovableType**说："你仍然写代码，但只写最有价值的部分。"字段定义、表单配置、自定义组件都是代码，只是极度精简的代码。

对 AI 而言，低代码平台意味着要理解一套专有 DSL 和可视化元数据；而 MovableType 只需要理解 JSON 和 React 组件——这是 LLM 训练数据里最丰富的两种知识。

---

## 七、结语

> **"字模是永恒的，版面是流动的。"**

MovableType 不是又一个表单组件库，它是一种**界面契约的表达方式**。在 AI 成为主要生产力之后，人类和 AI 之间的协作界面，恰恰需要这种高度结构化、低歧义、易验证的中间层。

当产品需求来临时，AI 生成配置，引擎负责渲染，人类审查语义。

这，才是活字印刷术在 21 世纪的真正回响。

---

**MovableType —— 纯渲染型配置引擎，为 AI 而生。**
