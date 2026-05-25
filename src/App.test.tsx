import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

const click = (t: string | RegExp) => fireEvent.click(screen.getByText(t));

describe('App 屏幕状态机', () => {
  it('初始展示首页', () => {
    render(<App />);
    expect(screen.getByText('开始抽我的人格卡')).toBeInTheDocument();
  });

  it('首页 → 题前说明', () => {
    render(<App />);
    click('开始抽我的人格卡');
    expect(screen.getByText('来 抽 第 1 题!')).toBeInTheDocument();
  });

  it('题前说明 → 第 1 题', () => {
    render(<App />);
    click('开始抽我的人格卡');
    click('来 抽 第 1 题!');
    expect(screen.getByText(/第 1 \/ 18 题/)).toBeInTheDocument();
  });

  it('答题：选第一项后步骤提示切换、再点同项可取消', () => {
    render(<App />);
    click('开始抽我的人格卡');
    click('来 抽 第 1 题!');
    expect(screen.getByText(/选「最想做」/)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('opt-R'));
    expect(screen.getByText(/再选「第二想」/)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('opt-R')); // 取消
    expect(screen.getByText(/选「最想做」/)).toBeInTheDocument();
  });

  it('答题：选满两项后自动进入下一题', () => {
    vi.useFakeTimers();
    try {
      render(<App />);
      click('开始抽我的人格卡');
      click('来 抽 第 1 题!');
      fireEvent.click(screen.getByTestId('opt-R'));
      fireEvent.click(screen.getByTestId('opt-I'));
      act(() => { vi.advanceTimersByTime(600); });
      expect(screen.getByText(/第 2 \/ 18 题/)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('答题：可返回上一题', () => {
    vi.useFakeTimers();
    try {
      render(<App />);
      click('开始抽我的人格卡');
      click('来 抽 第 1 题!');
      fireEvent.click(screen.getByTestId('opt-R'));
      fireEvent.click(screen.getByTestId('opt-I'));
      act(() => { vi.advanceTimersByTime(600); });
      expect(screen.getByText(/第 2 \/ 18 题/)).toBeInTheDocument();
      fireEvent.click(screen.getAllByLabelText('返回')[0]);
      expect(screen.getByText(/第 1 \/ 18 题/)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('答满 18 题后进入生成页', () => {
    vi.useFakeTimers();
    try {
      render(<App />);
      click('开始抽我的人格卡');
      click('来 抽 第 1 题!');
      for (let i = 0; i < 18; i++) {
        fireEvent.click(screen.getByTestId('opt-R'));
        fireEvent.click(screen.getByTestId('opt-I'));
        act(() => { vi.advanceTimersByTime(600); });
      }
      expect(screen.getByText(/那一张/)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
