# 打分算法说明

本文档说明「未来专业人格卡」的打分算法。实现见 `src/lib/score.ts`，
对应测试见 `src/lib/score.test.ts`，依据 PRD v1.1 §8 / §9 / §10。

算法对外只有一个入口：

```ts
scoreAll(answers: Answer[]): ScoreResult
```

`answers` 是用户对 18 道题的作答，每题一条：

```ts
interface Answer {
  qIndex: number;        // 题目下标 0–17
  first:  Letter | null; // 「最想做」选项的 RIASEC 字母
  second: Letter | null; // 「第二想做」选项的 RIASEC 字母
}
```

`Letter` 为 RIASEC 六维之一：`R` 现实型 / `I` 研究型 / `A` 艺术型 / `S` 社会型 / `E` 企业型 / `C` 常规型。

---

## 总览：两层计分

PRD §8.1 的核心思路是「先判人格，再推专业」：

| 层 | 算什么 | 用途 |
|---|---|---|
| 第一层 | RIASEC 兴趣分 | 决定**人格卡**（稳定、易分享） |
| 第二层 | 专业大类提示分 | 让**专业推荐**贴近学生的具体作答（可细化） |

两层结果再加权成「专业推荐分」，对专业大类排序。

---

## 第一层 · RIASEC 兴趣分

每道题用户选两次，按 PRD §8.1 计分：

```
最想做（first） → 对应维度 +2
第二想做（second） → 对应维度 +1
```

18 题、每题 `2 + 1 = 3` 分，**六维总分恒为 54**（单元测试有断言）。

六维累计后**降序排序**；同分时按 RIASEC 规范序 `R < I < A < S < E < C` 固定先后，
保证同一组答案每次得到完全一致的结果（确定性）。

排序后的前两维拼成**人格代码**。代码按 RIASEC 规范序书写，而非按得分高低，
因此「C 排第 1、I 排第 2」与「I 排第 1、C 排第 2」都得到代码 `I-C`，
命中 PRD §9 的 15 个双维人格之一；满足「多面手」条件时则取第 16 张「未来多面手」（见下文）。

---

## 第二层 · 专业大类提示分

每个选项除了一个 RIASEC 字母，还绑定若干「专业大类标签」（见 `quiz.ts` 中每个 option 的 `majors`）。
用户选中该选项时，对这些专业大类累加提示分（PRD §8.1）：

```
最想做选项绑定的每个专业大类 → +1.0
第二想做选项绑定的每个专业大类 → +0.5
```

累计结果记为 `hintScore[专业大类]`。

---

## 专业推荐分

对每个专业大类，按 PRD §8.1 的公式算综合推荐分：

```
推荐分 = 0.65 × RIASEC匹配分 + 0.35 × 题目专业提示分
```

其中 **RIASEC 匹配分** `r` 按学生维度排名命中专业的 RIASEC 标签计：

```
专业的 RIASEC 标签命中学生第 1 维度 → r += 5
                       第 2 维度 → r += 3
                       第 3 维度 → r += 1
```

「命中」指专业的标签集合**包含**该维度，与标签在集合中的位置无关。
`题目专业提示分` 即上一节的 `hintScore[该专业大类]`。

---

## 置信度（PRD §8.2）

PRD §8.2 给出 5 条**相互独立、可同时成立**的展示规则。算法返回一组布尔标记，
而不是单一枚举，结果页据此可叠加展示多条文案：

```ts
interface Confidence {
  mainClear:  boolean;  // 第1名比第2名高 ≥5 分 → 主线很清晰
  dualCore:   boolean;  // 第1名与第2名差 0–4 分 → 双核心人格
  thirdColor: boolean;  // 第2名与第3名差 0–2 分 → 潜在第三色
  multi:      boolean;  // 最高与最低差 <8 分 → 未来多面手
  lowDims:    Letter[]; // 显著偏低的维度
}
```

判定细节：

| 标记 | 条件 |
|---|---|
| `mainClear` | 非多面手，且 `gap12 = 第1名 − 第2名 ≥ 5` |
| `dualCore` | 非多面手，且 `gap12 ≤ 4` |
| `thirdColor` | 非多面手，且 `gap23 = 第2名 − 第3名 ≤ 2` |
| `multi` | `spread = 最高分 − 最低分 < 8` |
| `lowDims` | 非多面手时，所有满足 `最高分 − 该维度 ≥ 10` 的维度 |

`mainClear` 与 `dualCore` 互斥（`gap12` 要么 ≥5 要么 ≤4），但 `dualCore` 与 `thirdColor` 可并存。
对 `lowDims` 里的维度，结果页用「当前吸引力较低」措辞，**禁止**写「不适合」（PRD §13.4）。

---

## 修订说明：三处与原型设计稿的偏差

设计稿（`design-reference/`）里的原型打分函数与 PRD 有三处不一致，本实现已修订。

### 修订 1 · 优先 / 继续了解的取值范围

原型从**全量 50 个专业大类**的排名里切前 3 / 第 4–6。但 PRD §10 的结果页模板明确是
**人格卡专属的专业大类**（§9 每张卡的「优先探索专业大类」列、§12.3 的 `recommended_major_categories`）。

本实现：

- **候选集** = 当前人格卡的 `persona.majors`（6–7 项）
- 用「专业推荐分」对候选集排序：前 3 → `priorityMajors`，第 4–6 → `continueMajors`
- 全量 50 大类的推荐分排名单独保留为 `deepReport`（取前 10），仅供「完整专业报告页」的
  深度报告区按需展开（PRD §8.3「深度报告 8–12 个」），**不进结果页首屏**

### 修订 2 · 置信度可叠加

原型把置信度做成单选枚举（`multi > dual > third > clear` 取一个）。
PRD §8.2 是 5 条独立规则，已改为上文的布尔标记组。

### 修订 3 · 未来多面手动态生成探索线

原型在「多面手」时用第 16 张卡的固定 `majors` 列表。PRD §9 多线行要求
「根据前三高维度生成组合，展示 3 条专业探索线」。

本实现：`multi` 为真时人格取「未来多面手」卡，但额外按**前三高维度**各生成一条探索线 ——
每条线 = `{ 该维度, 该维度下推荐分最高的 1–2 个专业大类 }`，三条线之间去重，存入 `multiTracks`。

---

## 返回结构

```ts
interface ScoreResult {
  dim:    Record<Letter, number>;   // 六维原始分
  ordered: [Letter, number][];      // 六维降序（含同分确定性排序）
  top: Letter; second: Letter; third: Letter;
  persona: Persona;                 // 命中的人格卡
  confidence: Confidence;           // 置信度标记组
  priorityMajors: Major[];          // 修订1：人格卡范围内推荐分前 3
  continueMajors: Major[];          // 修订1：人格卡范围内推荐分第 4–6
  deepReport: Major[];              // 全量 50 排名前 10，供深度报告
  multiTracks?: MultiTrack[];       // 修订3：仅多面手时有，3 条探索线
}
```

`DEMO_RESULT`（结果页在「尚未作答」时的占位数据）也通过对一组真实答案跑 `scoreAll` 生成，
避免演示数据与算法逻辑漂移。

---

## 验证

`src/lib/score.test.ts` 覆盖：

1. 六维总分恒为 54
2. 人格代码落在 §9 的 16 张之内
3. **修订 1**：`priorityMajors` / `continueMajors` 全部 ⊆ `persona.majors`
4. **修订 2**：构造 `gap12 ≤ 4` 且 `gap23 ≤ 2` 的答案，`dualCore` 与 `thirdColor` 同时为 true
5. **修订 3**：构造 `spread < 8` 的答案，`multi` 为 true 且 `multiTracks` 含 3 条线

运行：`npm run test`
