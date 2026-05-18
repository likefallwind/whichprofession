# 分享海报设计

_Started 2026-05-18 01:28 UTC_

---

## User

1. 最终分享的海报设计一下
2. 给一个真实流程走一遍

## Assistant

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: update_todos]_

I'll redesign the share poster to be a striking, share-worthy artifact, then walk through the real flow.

_[tool: grep]_

_[tool: read_file]_

Now I'll redesign the poster screen. Replacing lines 947–1125 (the section banner + entire ScreenPoster function) with a more refined, share-worthy artwork — the action sheet moves below the poster instead of overlapping, and the hero gets the magazine-cover treatment.

_[tool: read_file]_

_[tool: grep]_

Now I'll replace the entire ScreenPoster function with a more iconic, share-worthy redesign — bigger title hierarchy, character panel, cleaner data viz, action sheet below the poster (not overlapping), and a polished QR + brand footer.

_[tool: read_file]_

I'll replace the entire ScreenPoster body with the new design. First let me grab a unique end pattern.

_[tool: read_file]_

I'll take a clean approach: append a new ScreenPoster definition at the end of the file (function declarations hoist + the later declaration wins), so the old one becomes dead code without me having to perfectly transcribe 175 lines. Then update app.jsx to land users in prototype mode.

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now switch the default mode to prototype so the user lands directly in the live flow:

_[tool: show_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: str_replace_edit]_

Babel strict mode rejects duplicate declarations. Let me rename the old ScreenPoster to deprecate it.

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: grep]_

_[tool: str_replace_edit]_

The quiz-bank.jsx isn't loaded in index.html. Adding it.

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

Clean. Let me snapshot the new poster and walk through the real flow.

_[tool: view_image]_

_[tool: save_screenshot]_

Top of the poster renders clean. Let me check the full phone view by scrolling.

_[tool: view_image]_

_[tool: str_replace_edit]_

The phone is fixed 844px tall but the iframe viewport may be shorter, cutting off the bottom action sheet. Let me add auto-scaling.

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

The full poster renders end-to-end now — title, character card, quote, stat tiles, direction bars, QR/brand footer, and the three action buttons all visible.

_[tool: view_image]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

已搞定 ✦

**1. 终稿分享海报（v2）**
- 杂志感封面：三行竖排大字标题 `未来 / 系统 / 设计师`（中字带荧光笔涂抹底）+ 角色卡块（🧩 + YOU 印章）
- 引文式描述 · 4 格能力数值（92 / 88 / 84 / 78）· TOP3 方向带进度条
- 底部 QR + 品牌「职业MBTI · jobmbti.cn」
- 操作条移到海报**外部**（保存 / 复制链接 / 发给朋友），不再遮挡内容
- 暗色舞台 + 暖色聚光，让海报本身像一张可被截屏分享的硬卡

**2. 真实流程走一遍**
- 默认进入 **真机模式** —— 打开页面直接落地到「STEP 1 / 7 首页」
- 加了 PhoneStage 自动缩放：手机帧（390×844）总能完整显示，海报底部三个按钮不再被裁切
- 用右上角「跳转 ▾」可任意跳屏；「↺ 重置」回到首页；「画布视图」回到 8 屏总览

旧版海报保留在代码里改名为 `ScreenPosterV1Deprecated`，方便比较。如果想再调，常见小改：①让人物 emoji 换成抽象图形 ②整张海报支持长按保存 ③加一行「我的朋友圈昵称」自定义。

