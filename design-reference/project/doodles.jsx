// doodles.jsx — small hand-drawn SVG primitives used across screens.
// All accept size + color props; default to "currentColor" so they ride parent color.

function Sparkle({ size = 18, color = 'currentColor', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none">
      <path d="M12 2 C12.6 8 16 11.4 22 12 C16 12.6 12.6 16 12 22 C11.4 16 8 12.6 2 12 C8 11.4 11.4 8 12 2 Z"
        fill={color}/>
    </svg>
  );
}

function Star4({ size = 14, color = 'currentColor', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z" fill={color}/>
    </svg>
  );
}

function Asterisk({ size = 22, color = 'currentColor', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 3 v18 M3 12 h18 M5.5 5.5 l13 13 M5.5 18.5 l13-13"/>
    </svg>
  );
}

function Squiggle({ width = 80, height = 14, color = 'currentColor', style = {}, strokeWidth = 3 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 80 14" style={style} fill="none">
      <path d="M2 8 Q 10 1, 18 8 T 34 8 T 50 8 T 66 8 T 78 8"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}

function Underline({ width = 160, height = 16, color = 'currentColor', style = {}, sw = 4 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 160 16" style={style} fill="none" preserveAspectRatio="none">
      <path d="M3 11 Q 30 4, 60 9 T 120 8 T 157 6"
        stroke={color} strokeWidth={sw} strokeLinecap="round"/>
    </svg>
  );
}

function CurvedArrow({ width = 60, height = 50, color = 'currentColor', style = {}, dir = 'down-right' }) {
  // gentle hand-drawn arrow swooping from top-left → bottom-right
  return (
    <svg width={width} height={height} viewBox="0 0 60 50" style={style} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6 Q 18 4, 30 14 T 52 36"/>
      <path d="M46 30 L 53 37 L 44 40"/>
    </svg>
  );
}

function Sun({ size = 60, color = 'currentColor', fill = 'none', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={style}>
      <circle cx="30" cy="30" r="13" fill={fill === 'none' ? 'transparent' : fill} stroke={color} strokeWidth="2.4"/>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 8;
        const x1 = 30 + Math.cos(a) * 19;
        const y1 = 30 + Math.sin(a) * 19;
        const x2 = 30 + Math.cos(a) * 27;
        const y2 = 30 + Math.sin(a) * 27;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.4" strokeLinecap="round"/>;
      })}
    </svg>
  );
}

function Bolt({ size = 24, color = 'currentColor', fill = 'currentColor', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path d="M14 2 L4 14 H11 L9 22 L20 9 H13 Z" fill={fill} stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  );
}

function HandFrame({ children, color = 'var(--ink)', radius = 18, sw = 2.4, style = {}, padding = '20px 22px' }) {
  // wobbly hand-drawn rectangle frame (uses two slightly offset rounded outlines)
  return (
    <div style={{ position: 'relative', ...style }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} preserveAspectRatio="none">
        <rect x="3" y="4" width="calc(100% - 6px)" height="calc(100% - 8px)"
              rx={radius} ry={radius} fill="none" stroke={color} strokeWidth={sw}
              strokeDasharray="0"/>
      </svg>
      <div style={{ position: 'relative', padding }}>
        {children}
      </div>
    </div>
  );
}

function Confetti({ count = 14, area = { w: 360, h: 200 }, color = 'var(--primary)', style = {} }) {
  // deterministic positions so it doesn't reshuffle on rerender
  const items = React.useMemo(() => {
    const list = [];
    const seed = 31;
    let s = seed;
    const r = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return (s % 1000) / 1000;
    };
    for (let i = 0; i < count; i++) {
      list.push({
        x: r() * area.w,
        y: r() * area.h,
        s: 6 + r() * 12,
        rot: r() * 360,
        type: ['dot','star','squiggle','plus'][Math.floor(r() * 4)],
        hue: r(),
      });
    }
    return list;
  }, [count, area.w, area.h]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...style }}>
      {items.map((it, i) => (
        <div key={i} style={{
          position: 'absolute', left: it.x, top: it.y,
          transform: `rotate(${it.rot}deg)`,
          color: it.hue > 0.6 ? 'var(--accent)' : it.hue > 0.3 ? 'var(--primary)' : 'var(--green)',
          opacity: 0.85,
        }}>
          {it.type === 'star' && <Star4 size={it.s} />}
          {it.type === 'squiggle' && <Squiggle width={it.s * 3} height={it.s} strokeWidth={2} />}
          {it.type === 'plus' && <Asterisk size={it.s} />}
          {it.type === 'dot' && <div style={{ width: it.s/2, height: it.s/2, borderRadius: '50%', background: 'currentColor' }} />}
        </div>
      ))}
    </div>
  );
}

// A simple radar / star-chart visual used in the generation screen
function RadarChart({ size = 220, values = [0.85, 0.7, 0.55, 0.8, 0.6], axes = ['探索','创造','技术','管理','服务'], color = 'var(--primary)' }) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.40;
  const n = values.length;
  const pts = values.map((v, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + Math.cos(a) * r * v, cy + Math.sin(a) * r * v];
  });
  const axisPts = Array.from({ length: n }).map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* rings */}
      {[0.33, 0.66, 1].map((f, i) => {
        const ring = Array.from({ length: n }).map((_, j) => {
          const a = -Math.PI / 2 + (j * 2 * Math.PI) / n;
          return `${cx + Math.cos(a) * r * f},${cy + Math.sin(a) * r * f}`;
        }).join(' ');
        return <polygon key={i} points={ring} fill="none" stroke="var(--ink)" strokeWidth="1" strokeOpacity={0.18} />;
      })}
      {/* axes */}
      {axisPts.map(([x, y], i) => (
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--ink)" strokeWidth="1" strokeOpacity={0.18} />
      ))}
      {/* value polygon */}
      <polygon points={pts.map(p => p.join(',')).join(' ')}
        fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2.4" strokeLinejoin="round"/>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={color}/>
      ))}
      {/* labels */}
      {axes.map((label, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        const lx = cx + Math.cos(a) * (r + 16);
        const ly = cy + Math.sin(a) * (r + 16) + 4;
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle"
            style={{ font: '600 11px "Noto Sans SC"', fill: 'var(--ink)' }}>
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// Highlight blob behind a word
function MarkerBlob({ children, color = 'var(--primary-soft)', tilt = -1, style = {} }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', ...style }}>
      <span style={{
        position: 'absolute', inset: '8% -6% 4% -6%',
        background: color,
        transform: `rotate(${tilt}deg)`,
        borderRadius: '40% 60% 55% 45% / 50% 45% 55% 50%',
        zIndex: 0,
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </span>
  );
}

Object.assign(window, {
  Sparkle, Star4, Asterisk, Squiggle, Underline, CurvedArrow,
  Sun, Bolt, HandFrame, Confetti, RadarChart, MarkerBlob,
});
