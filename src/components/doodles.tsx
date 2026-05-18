// doodles.tsx — 手绘风 SVG 图元，跨屏复用。
import React from 'react';

type SvgProps = { size?: number; color?: string; style?: React.CSSProperties };

export function Sparkle({ size = 18, color = 'currentColor', style = {} }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none">
      <path d="M12 2 C12.6 8 16 11.4 22 12 C16 12.6 12.6 16 12 22 C11.4 16 8 12.6 2 12 C8 11.4 11.4 8 12 2 Z" fill={color} />
    </svg>
  );
}

export function Star4({ size = 14, color = 'currentColor', style = {} }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z" fill={color} />
    </svg>
  );
}

export function Asterisk({ size = 22, color = 'currentColor', style = {} }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 3 v18 M3 12 h18 M5.5 5.5 l13 13 M5.5 18.5 l13-13" />
    </svg>
  );
}

export function Squiggle({
  width = 80, height = 14, color = 'currentColor', style = {}, strokeWidth = 3,
}: { width?: number; height?: number; color?: string; style?: React.CSSProperties; strokeWidth?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 80 14" style={style} fill="none">
      <path d="M2 8 Q 10 1, 18 8 T 34 8 T 50 8 T 66 8 T 78 8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function Underline({
  width = 160, height = 16, color = 'currentColor', style = {}, sw = 4,
}: { width?: number; height?: number; color?: string; style?: React.CSSProperties; sw?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 160 16" style={style} fill="none" preserveAspectRatio="none">
      <path d="M3 11 Q 30 4, 60 9 T 120 8 T 157 6" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

export function CurvedArrow({
  width = 60, height = 50, color = 'currentColor', style = {},
}: { width?: number; height?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={width} height={height} viewBox="0 0 60 50" style={style} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6 Q 18 4, 30 14 T 52 36" />
      <path d="M46 30 L 53 37 L 44 40" />
    </svg>
  );
}

export function Confetti({
  count = 14, area = { w: 360, h: 200 }, style = {},
}: { count?: number; area?: { w: number; h: number }; style?: React.CSSProperties }) {
  const items = React.useMemo(() => {
    const list: { x: number; y: number; s: number; rot: number; type: string; hue: number }[] = [];
    let s = 31;
    const r = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return (s % 1000) / 1000;
    };
    for (let i = 0; i < count; i++) {
      list.push({
        x: r() * area.w, y: r() * area.h, s: 6 + r() * 12, rot: r() * 360,
        type: ['dot', 'star', 'squiggle', 'plus'][Math.floor(r() * 4)], hue: r(),
      });
    }
    return list;
  }, [count, area.w, area.h]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...style }}>
      {items.map((it, i) => (
        <div key={i} style={{
          position: 'absolute', left: it.x, top: it.y, transform: `rotate(${it.rot}deg)`,
          color: it.hue > 0.6 ? 'var(--accent)' : it.hue > 0.3 ? 'var(--primary)' : 'var(--green)',
          opacity: 0.85,
        }}>
          {it.type === 'star' && <Star4 size={it.s} />}
          {it.type === 'squiggle' && <Squiggle width={it.s * 3} height={it.s} strokeWidth={2} />}
          {it.type === 'plus' && <Asterisk size={it.s} />}
          {it.type === 'dot' && <div style={{ width: it.s / 2, height: it.s / 2, borderRadius: '50%', background: 'currentColor' }} />}
        </div>
      ))}
    </div>
  );
}

// 词背后的荧光笔涂抹底
export function MarkerBlob({
  children, color = 'var(--primary-soft)', tilt = -1, style = {},
}: { children: React.ReactNode; color?: string; tilt?: number; style?: React.CSSProperties }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', ...style }}>
      <span style={{
        position: 'absolute', inset: '8% -6% 4% -6%', background: color,
        transform: `rotate(${tilt}deg)`,
        borderRadius: '40% 60% 55% 45% / 50% 45% 55% 50%', zIndex: 0,
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </span>
  );
}
