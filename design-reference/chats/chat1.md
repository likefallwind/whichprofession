# 高考志愿H5设计

_Started 2026-05-17 12:39 UTC_

---

## User

刚刚上传的 gaokao_career_h5_product_brief.md 是我的产品文档，请基于这个文档完成设计

## Assistant

_[tool: read_file]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: questions_v2]_

设计系统目录是空的，我需要从零开始设计视觉风格。我先快速确认几个关键问题，然后开始设计。

## User

Questions answered:
- deliverable: 几个关键页面的高保真静态稿（首页/测试/结果/职业方向，并排展示）
- visual_style: 明亮校园 / 米色奶油 / 手绘插画感（年轻松弛）
- fidelity_focus: 首页 Landing（吸引点击）, 测试答题页（互动体验、进度感）, 生成动画页（抽卡仪式感）, 结果页 / 职业画像卡（核心传播物）, 职业方向页（信息密度）, 专业推荐页
- persona_count: 未来系统设计师（文档中的示例）
- interactive_depth: 只展示 1-2 道示范题（节省时间，重点放在结果页）
- device_frame: 要，套 iOS 设备框（H5 通常在手机里看，更真实）
- share_poster: 暂时不做
- tweaks: 主题配色（科技蓝/暖橙/校园粉…）
- brand_assets: 没有，纯产品本身，画像/名字你创意

## Assistant

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

_[tool: read_file]_

_[tool: grep]_

_[tool: write_file]_

_[tool: write_file]_

Let me now build the design. I'll create a cream/handcrafted visual system with 6 iPhone screens on a design canvas, plus theme tweaks.

_[tool: write_file]_

_[tool: write_file]_

_[tool: grep]_

_[tool: str_replace_edit]_

Let me simplify the Tweaks (use TweakRadio for reliability) and preview the page.

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: done]_

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

Looking great! Let me check more screens by scrolling the canvas.

_[tool: grep]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: str_replace_edit]_

Screen 6 overflows by 42px. Let me tighten it.

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

All 6 screens render cleanly and fit. Let me also peek at the result page (the hero card — core传播物) up close.

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: done]_

The core传播物 (result page) looks polished with the "未来 / 系统设计师" hero, radar chart, trait bars, and 3 recommended directions. Everything is in good shape.

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

已基于 PRD 完成 6 屏高保真静态稿，并排在一张设计画布上：

**视觉系统**
- 米色奶油底 + 暖橙主色 + 手绘插画感（offset 投影 / Marker 涂抹高亮 / 手绘下划线 / Caveat + Fraunces 数字 / ZCOOL 中文标题）
- 全部组件原创搭建，无第三方风险元素

**6 屏**
1. **首页 Landing** — Hero 大字 + 4 张倾斜画像卡 + "已抽卡 28,392 位" 社会证据 + 主 CTA
2. **测试答题页** — 进度条 3/18、场景题、4 选项含选中态、上一题/下一题
3. **生成动画页（抽卡仪式感）** — 深色 cream 底 + 雷达图 + 5 类型标签漂浮 + 87% 进度
4. **结果页（核心传播物）** — "未来系统设计师" Hero 卡 + 雷达图 + 4 条特质评分 + 3 推荐方向 + 查看报告/分享
5. **职业方向详情** — AI 与数据分析方向 + 4 典型职业含薪资 + 适合理由（引文）+ 未来机会 + 风险提醒
6. **专业推荐** — Path 面包屑 + 7 个专业含学科代码与匹配度 (A+/A/B+) + 注意事项 + 双 CTA

**Tweaks**
- 右上角"主题配色"面板，4 套整体色系一键切换：**暖橙奶油 / 科技蓝 / 校园粉 / 森野绿**

**未做（按你确认）**
- 分享海报（暂时不做）
- 真实答题逻辑（只示范 1 题）

需要的话可以继续：海报样式 / 把某一屏拆出做更细的 UX 流 / 增加更多画像（目前 8 种里只详细做了 1 种）。

## User

继续

## Assistant

_[tool: read_file]_

_[tool: read_file]_

我来添加第 7 屏 —— **8 种未来卡图鉴**，让用户看到全部画像的全貌（PRD 里提到 8 种画像，目前只详细做了 1 种）。

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: done]_

The 7th screen (8 种画像图鉴) renders cleanly with the user's card highlighted ("YOU ✦" badge, orange offset shadow). Let me close focus and surface the final result.

_[tool: fork_verifier_agent]_

加了第 7 屏 —— **8 种未来画像图鉴**：

- 顶部 "8 种未来画像 · 1/8 已抽到"
- 2×4 网格展示全部 8 种：系统设计师 / 数据炼金师 / 故事建筑师 / 战略指挥官 / 探索研究者 / 人本连接师 / 跨界整合师 / 实干工匠师
- 每张卡含 emoji、画像号、一句话、3 个特质标签、抽到比例 %
- 用户的卡（系统设计师）用 offset 阴影 + "YOU ✦" 标签 + 主题色高亮
- 底部引导 "邀请朋友抽卡"

可以继续的方向（你说一句就做）：
- 把另一张画像（比如"故事建筑师"）也做成完整 result 详情，对比下不同色系下的视觉效果
- 给结果页加一个"主+副画像"组合形态（比如主：系统设计师 / 副：探索研究者）
- 做分享海报
- 加一组结果页布局变体（雷达图版 / 标签云版 / 星图版）的 Tweaks

## User

1. 设计一下分享海报
2. 按照真实流程走遍，有完整体验

