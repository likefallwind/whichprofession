# 产品视觉设计完善

_Started 2026-05-18 03:44 UTC_

---

## User

视觉效果类似于现在的设计，同时 @gaokao_future_major_personality_prd_v1_1.md 是产品文档，请进一步完善

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: update_todos]_

我先理解一下：当前设计已经有完整的视觉骨架（暖橙奶油 + 手绘 + iOS 框架 + 8 屏流程），但内容与 PRD v1.1 有较大差异。我会保持视觉风格不变，把 PRD 的所有产品逻辑灌进去。

**主要待修复的差异：**

| 项目 | 现状 | PRD v1.1 要求 |
|---|---|---|
| 产品名 | 未来职业画像 / 职业MBTI | **未来专业人格卡**（且不可出现 MBTI 字样）|
| 题目 | 18 题通用直觉题 | 18 题**大学专业场景题**（每题 6 选项 R/I/A/S/E/C）|
| 答题方式 | 单选 | **选「最想做」+「第二想做」**两次 |
| 人格 | 8 种虚构画像 | **16 种 RIASEC 双维人格**（如 数据侦探 I-C, 硬核造物家 R-I）|
| 结果页 | 抽象方向 + 拟合度 | 优先探索专业大类 + 热门职业出口 + **两周体验任务** + 不要误解 |
| 推荐页 | 直接给具体专业 | 优先探索3 / 可以继续了解3 / 热门职业出口 3-5 |
| 分享卡 | 含"职业MBTI"品牌 | 3 大类 + 3 出口，无 MBTI 字样 |
| 缺失 | — | **题前说明页**、置信度规则、免责声明 |

我开始落地修改。

_[tool: write_file]_

让我开始重写。先做最大的一块——`quiz-bank.jsx`：PRD 的 18 道大学场景题 + 16 张 RIASEC 人格卡 + 50 个专业大类元数据 + 双选打分。

_[tool: grep]_

_[tool: grep]_

_[tool: write_file]_

Now let me rewrite `screens.jsx` with the new PRD-aligned content. I'll keep all visual atoms and decorations, just swap content/structure.

_[tool: write_file]_

Now update `app.jsx` to wire up the new intro screen, dual-select quiz mechanic, and pass computed results downstream.Now let me update `index.html` title and check the result.

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: done]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

已按 PRD v1.1 完成全面改造。视觉风格（暖橙奶油 + 手绘装饰 + 黑边偏移卡 + iOS 框架）保留不变，内容全部对齐 PRD：

**结构升级（8 屏 → 9 屏）**
- 新增 **题前说明页**：3 条规则卡（每题选两次 / 不用考虑会不会 / 仅供探索参考）+ 时间预估
- 答题机制改为 **双选**：先点「最想做」(+2 分) 再点「第二想做」(+1 分)，6 个 RIASEC 选项带字母色彩徽章
- 结果页对齐 PRD §10：**人格卡 + 6 维分布条 + 优先探索 3 大类 + 热门职业出口 + 两周体验任务 + "不要误解"提醒**
- 完整专业报告页：**优先探索 3 + 可以继续了解 3 + 热门职业出口 + 注意事项**
- 图鉴页扩展到 **16 张人格卡**（15 个 RIASEC 双维 + 1 个未来多面手）

**数据层**（`quiz-bank.jsx`）
- PRD 完整的 **18 道大学专业场景题**，每题 6 选项带 RIASEC 字母 + 专业大类标签
- **16 张人格卡** 配套（代码 / 名称 / 关键词 / 优先专业 / 职业出口 / 两周任务）
- PRD §7.1 的 **50 个热门专业大类** 元数据
- PRD §8.1 双层打分器：`scoreAll()` 返回兴趣分 + 专业推荐 + 置信度

**合规整改**
- 移除全部 "MBTI / 职业MBTI" 字样，统一为 **未来专业人格卡**
- 加入 PRD §13.4 的免责底线（不代表能力评价、不构成志愿填报建议）
- 文案严格用"优先探索 / 当前吸引力较低"，不出现"最适合 / 不适合 / 命定"

主题切换（暖橙奶油 / 科技蓝 / 校园粉 / 森野绿）和画布 ⇄ 真机模式切换保留。等验证子代理报告。

## User

Verifier agent check completed

## Assistant

## Assistant

_[tool: read_file]_

清理一下被状态文件缓存的旧标题：

_[tool: delete_file]_

验证通过，9 屏全部按 PRD v1.1 正确渲染，没有 MBTI 字样残留，控制台干净。我顺手清掉了一份缓存旧标题的画布状态文件，现在 section 标题会正确显示为"未来专业人格卡 H5 · 全流程"。

可以打开顶部的 "▶ 走完整流程" 体验双选答题→生成→人格卡结果的完整 PRD 流程，或在 Tweaks 里切换 4 套主题色系。

