# 未来专业人格卡 H5

高考后专业兴趣探索 H5 —— 18 道大学场景题，基于 RIASEC 职业兴趣模型生成「未来专业人格卡」，
推荐优先探索的专业大类与职业出口。实现自 PRD v1.1（`gaokao_future_major_personality_prd_v1_1.md`）。

## 技术栈

Vite + React 18 + TypeScript。全屏移动端 H5，单一「科技蓝」主题。

## 开发

```bash
npm install
npm run dev        # 本地开发 http://localhost:5173
npm run build      # 类型检查 + 生产构建
npm run preview    # 预览生产构建
npm run test       # 单元测试（vitest，63 个用例）
```

### 服务器管理脚本

`run.sh` 封装了开发服务器的启停：

```bash
./run.sh start     # 启动（已在运行则不重复启动）
./run.sh stop      # 停止所有本项目的服务实例（含历史遗留的多个进程）
./run.sh restart   # 重启
./run.sh status    # 查看运行状态
```

`stop` 会同时按 PID 文件和工作目录扫描，能把之前多次启动遗留的所有实例一并清理干净。

## 流程（8 屏）

`首页 → 题前说明 → 18 题双选答题 → 生成动画 → 人格卡结果 → 完整专业报告 → 16 张图鉴 → 分享海报`

## 目录

- `src/data/quiz.ts` — 18 题 / 16 人格卡 / 50 专业大类 / RIASEC 元数据
- `src/lib/score.ts` — 双层打分算法（PRD §8，含三处对齐修订）；算法详解见 [`docs/algorithm.md`](docs/algorithm.md)
- `src/components/` — 手绘 SVG 图元 + 共享原子组件
- `src/screens/` — 8 屏页面
- `src/App.tsx` — 屏幕状态机
- `design-reference/` — Claude Design 导出的原始设计稿存档

## 测试

`npm run test` 运行 63 个单元测试（vitest + Testing Library），覆盖：

- **数据层**（`data/quiz.test.ts`）—— 18 题 / 16 人格 / 50 大类的结构与引用完整性、合规词检查
- **打分算法**（`lib/score.test.ts`）—— PRD §8 主干 + 三处修订 + 边缘场景（空/部分作答、规范序、确定性）
- **屏幕状态机**（`App.test.tsx`）—— 双选答题、取消、自动进题、上一题、答满 18 题
- **8 屏组件**（`screens/screens.test.tsx`）—— 渲染冒烟与导航交互
- **基础组件**（`components/components.test.tsx`）—— atoms 与 doodles

## 合规

无 MBTI 字样；含免责声明；文案统一用「优先探索 / 当前吸引力较低」，不出现「最适合 / 不适合 / 命定」（PRD §13）。
