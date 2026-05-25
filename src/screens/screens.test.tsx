import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DEMO_RESULT } from '../lib/score';
import ScreenLanding from './ScreenLanding';
import ScreenIntro from './ScreenIntro';
import ScreenQuiz, { type QuizState } from './ScreenQuiz';
import ScreenGenerating from './ScreenGenerating';
import ScreenResult from './ScreenResult';
import ScreenMajors from './ScreenMajors';
import ScreenLibrary from './ScreenLibrary';
import ScreenPoster from './ScreenPoster';

describe('屏幕 · 冒烟与交互', () => {
  it('ScreenLanding 渲染主标题，点 CTA 触发 start', () => {
    const onNav = vi.fn();
    render(<ScreenLanding onNav={onNav} />);
    expect(screen.getByText('哪一卡')).toBeInTheDocument();
    fireEvent.click(screen.getByText('开始抽我的人格卡'));
    expect(onNav).toHaveBeenCalledWith('start');
  });

  it('ScreenIntro 渲染三条规则，点按钮触发 start', () => {
    const onNav = vi.fn();
    render(<ScreenIntro onNav={onNav} />);
    expect(screen.getByText('每题选两次')).toBeInTheDocument();
    expect(screen.getByText('结果只是探索建议')).toBeInTheDocument();
    fireEvent.click(screen.getByText('来 抽 第 1 题!'));
    expect(onNav).toHaveBeenCalledWith('start');
  });

  it('ScreenQuiz 渲染题目，点选项触发 pick 并带字母', () => {
    const onNav = vi.fn();
    const state: QuizState = { qIndex: 0, first: null, second: null, answeredCount: 0 };
    render(<ScreenQuiz state={state} onNav={onNav} />);
    expect(screen.getByText(/第 1 \/ 18 题/)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('opt-A'));
    expect(onNav).toHaveBeenCalledWith('pick', { letter: 'A' });
  });

  it('ScreenGenerating（静态）渲染且不崩溃', () => {
    render(<ScreenGenerating live={false} onNav={vi.fn()} />);
    expect(screen.getByText(/那一张/)).toBeInTheDocument();
  });

  it('ScreenResult 渲染人格卡、两周任务与免责声明', () => {
    const onNav = vi.fn();
    render(<ScreenResult result={DEMO_RESULT} onNav={onNav} />);
    expect(screen.getByText(DEMO_RESULT.persona.name)).toBeInTheDocument();
    expect(screen.getByText(/给你的两周任务/)).toBeInTheDocument();
    expect(screen.getByText(/不要误解/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('查看完整专业报告'));
    expect(onNav).toHaveBeenCalledWith('majors');
  });

  it('ScreenResult 优先探索专业全部来自人格卡专属范围（修订1）', () => {
    render(<ScreenResult result={DEMO_RESULT} onNav={vi.fn()} />);
    const allowed = new Set(DEMO_RESULT.persona.majors);
    for (const m of DEMO_RESULT.priorityMajors) {
      expect(allowed.has(m.cat)).toBe(true);
      expect(screen.getAllByText(m.cat).length).toBeGreaterThan(0);
    }
  });

  it('ScreenMajors 渲染三段报告，点按钮触发 poster', () => {
    const onNav = vi.fn();
    render(<ScreenMajors result={DEMO_RESULT} onNav={onNav} />);
    expect(screen.getByText('01 · 优先探索')).toBeInTheDocument();
    expect(screen.getByText('02 · 可以继续了解')).toBeInTheDocument();
    expect(screen.getByText('注意事项')).toBeInTheDocument();
    fireEvent.click(screen.getByText('领取完整报告'));
    expect(onNav).toHaveBeenCalledWith('poster');
  });

  it('ScreenLibrary 渲染 16 张卡且高亮用户人格', () => {
    render(<ScreenLibrary result={DEMO_RESULT} onNav={vi.fn()} />);
    expect(screen.getByText('16 张大图鉴')).toBeInTheDocument();
    expect(screen.getByText('YOU ✦')).toBeInTheDocument();
  });

  it('ScreenPoster 渲染海报，点保存切换文案', () => {
    render(<ScreenPoster result={DEMO_RESULT} onNav={vi.fn()} />);
    expect(screen.getAllByText(/未来专业人格卡/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText('保存图片'));
    expect(screen.getByText('已保存到相册')).toBeInTheDocument();
  });

  it('结果页与海报页文案无 MBTI / 最适合等违规词（PRD §13）', () => {
    const { container } = render(<ScreenResult result={DEMO_RESULT} onNav={vi.fn()} />);
    const text = container.textContent ?? '';
    for (const w of ['MBTI', '最适合', '不适合', '命定']) {
      expect(text.includes(w)).toBe(false);
    }
  });
});
