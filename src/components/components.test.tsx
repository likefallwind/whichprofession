import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ScreenShell, Pill, PrimaryButton, BackBtn, RiasecBadge, SectionLabel,
} from './atoms';
import {
  Sparkle, Star4, Asterisk, Squiggle, Underline, CurvedArrow, Confetti, MarkerBlob,
} from './doodles';

describe('组件 · 基础原子 atoms', () => {
  it('ScreenShell 渲染子内容', () => {
    render(<ScreenShell><div>内容区</div></ScreenShell>);
    expect(screen.getByText('内容区')).toBeInTheDocument();
  });

  it('Pill 渲染子内容', () => {
    render(<Pill>标签文字</Pill>);
    expect(screen.getByText('标签文字')).toBeInTheDocument();
  });

  it('PrimaryButton 点击触发 onClick', () => {
    const onClick = vi.fn();
    render(<PrimaryButton onClick={onClick}>提交</PrimaryButton>);
    fireEvent.click(screen.getByText('提交'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('PrimaryButton 禁用时点击不触发 onClick', () => {
    const onClick = vi.fn();
    render(<PrimaryButton onClick={onClick} disabled>提交</PrimaryButton>);
    fireEvent.click(screen.getByText('提交'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('BackBtn 点击触发 onClick', () => {
    const onClick = vi.fn();
    const { container } = render(<BackBtn onClick={onClick} />);
    fireEvent.click(container.firstChild as Element);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('RiasecBadge 显示对应字母', () => {
    render(<RiasecBadge letter="I" />);
    expect(screen.getByText('I')).toBeInTheDocument();
  });

  it('SectionLabel 渲染序号与标题', () => {
    render(<SectionLabel index="01" title="优先探索" />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('优先探索')).toBeInTheDocument();
  });
});

describe('组件 · 手绘图元 doodles', () => {
  it('SVG 图元均能渲染出 <svg>', () => {
    for (const el of [
      <Sparkle key="1" />, <Star4 key="2" />, <Asterisk key="3" />,
      <Squiggle key="4" />, <Underline key="5" />, <CurvedArrow key="6" />,
    ]) {
      const { container } = render(el);
      expect(container.querySelector('svg')).toBeTruthy();
    }
  });

  it('Confetti 按 count 渲染对应数量的碎屑', () => {
    const { container } = render(<Confetti count={9} area={{ w: 300, h: 200 }} />);
    expect((container.firstChild as Element).childElementCount).toBe(9);
  });

  it('MarkerBlob 渲染高亮的子内容', () => {
    render(<MarkerBlob>重点词</MarkerBlob>);
    expect(screen.getByText('重点词')).toBeInTheDocument();
  });
});
