// atoms.tsx — 跨屏复用的基础组件。
import React from 'react';
import { RIASEC, type Letter } from '../data/quiz';

// 屏幕外壳：纸纹底 + 安全区留白 + 内部滚动
export function ScreenShell({
  bg = 'var(--cream)', children, style = {}, dark = false,
}: {
  bg?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  dark?: boolean;
}) {
  return (
    <div
      className="paper-grain"
      style={{
        width: '100%', minHeight: '100%', background: bg, position: 'relative',
        color: dark ? 'var(--cream)' : 'var(--ink)', ...style,
      }}
    >
      <div
        style={{
          position: 'relative', zIndex: 2,
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
          minHeight: '100%', boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function Pill({
  children, color = 'var(--ink)', bg = 'transparent', border = true, size = 'm', style = {},
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  border?: boolean;
  size?: 's' | 'm' | 'l';
  style?: React.CSSProperties;
}) {
  const sizes = {
    s: { pad: '4px 10px', fs: 11 },
    m: { pad: '6px 12px', fs: 12 },
    l: { pad: '8px 16px', fs: 13 },
  } as const;
  const s = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: s.pad, fontSize: s.fs, fontWeight: 600, color, background: bg,
      border: border ? `1.4px solid ${color}` : 'none',
      borderRadius: 999, letterSpacing: '0.02em', whiteSpace: 'nowrap', ...style,
    }}>{children}</span>
  );
}

export function PrimaryButton({
  children, style = {}, dark = false, onClick, disabled = false,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  dark?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const press = (pressed: boolean) => {
    if (disabled || !innerRef.current) return;
    innerRef.current.style.transform = pressed ? 'translate(2px, 3px)' : 'translate(0, 0)';
  };
  return (
    <div
      onClick={disabled ? undefined : onClick}
      onPointerDown={() => press(true)}
      onPointerUp={() => press(false)}
      onPointerLeave={() => press(false)}
      style={{
        position: 'relative', display: 'inline-flex',
        cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
        opacity: disabled ? 0.4 : 1, ...style,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 999, transform: 'translate(3px, 4px)' }} />
      <div
        ref={innerRef}
        style={{
          position: 'relative', background: dark ? 'var(--ink)' : 'var(--primary)',
          color: dark ? 'var(--cream)' : '#fff',
          padding: '16px 26px', borderRadius: 999,
          fontWeight: 800, fontSize: 16, letterSpacing: '0.02em',
          border: '2px solid var(--ink)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          flex: 1,
          transition: 'transform 0.08s ease-out',
        }}
      >{children}</div>
    </div>
  );
}

// 倾斜的"贴纸"标签 — 与 Pill 共存，更"贴纸感"：粗体 900 + 倾斜 + 描边色填充
export function Sticker({
  children, color = 'var(--yellow)', textColor = 'var(--ink)', tilt = -3,
  size = 'm', style = {},
}: {
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  tilt?: number;
  size?: 's' | 'm' | 'l';
  style?: React.CSSProperties;
}) {
  const sizes = {
    s: { pad: '3px 9px',  fs: 10 },
    m: { pad: '6px 12px', fs: 12 },
    l: { pad: '8px 16px', fs: 14 },
  } as const;
  const s = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: s.pad, background: color, color: textColor,
      border: '1.8px solid var(--ink)', borderRadius: 999,
      fontWeight: 900, fontSize: s.fs, letterSpacing: '0.08em',
      transform: `rotate(${tilt}deg)`, whiteSpace: 'nowrap', lineHeight: 1.2,
      ...style,
    }}>{children}</span>
  );
}

export function BackBtn({ onClick, bg = 'transparent' }: { onClick?: () => void; bg?: string }) {
  return (
    <div onClick={onClick} aria-label="返回" role="button" style={{
      width: 32, height: 32, borderRadius: 999, border: '1.6px solid var(--ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      background: bg, flexShrink: 0,
    }}>
      <svg width="10" height="14" viewBox="0 0 10 14">
        <path d="M8 1L2 7l6 6" stroke="var(--ink)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// RIASEC 字母配色徽章
export function RiasecBadge({ letter, size = 26 }: { letter: Letter; size?: number }) {
  const r = RIASEC[letter];
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: r.c, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 900, fontSize: size * 0.55, fontFamily: 'Fraunces, serif',
      border: '1.4px solid var(--ink)', flexShrink: 0,
    }}>{letter}</div>
  );
}

export function SectionLabel({
  index, title, accent = 'var(--primary)',
}: { index: string; title: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
      <span className="h-en" style={{ fontSize: 14, color: accent }}>{index}</span>
      <span className="h-display" style={{ fontSize: 15, color: 'var(--ink)' }}>{title}</span>
      <span style={{ flex: 1, height: 1, background: 'rgba(26,34,53,0.15)' }} />
    </div>
  );
}
