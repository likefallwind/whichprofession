// 4. GENERATING — 生成动画
import { useState, useEffect } from 'react';
import { RIASEC, type Letter } from '../data/quiz';
import { ScreenShell } from '../components/atoms';
import { Star4 } from '../components/doodles';
import type { OnNav } from './nav';

function RadarChartDark() {
  const size = 220, cx = size / 2, cy = size / 2, r = size * 0.4;
  const values = [0.5, 0.45, 0.92, 0.68, 0.4, 0.55];
  const n = values.length;
  const pts = values.map((v, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + Math.cos(a) * r * v, cy + Math.sin(a) * r * v];
  });
  return (
    <svg width={size} height={size}>
      {[0.33, 0.66, 1].map((f, i) => {
        const ring = Array.from({ length: n }).map((_, j) => {
          const a = -Math.PI / 2 + (j * 2 * Math.PI) / n;
          return `${cx + Math.cos(a) * r * f},${cy + Math.sin(a) * r * f}`;
        }).join(' ');
        return <polygon key={i} points={ring} fill="none" stroke="rgba(244,233,210,0.2)" strokeWidth="1" />;
      })}
      {Array.from({ length: n }).map((_, j) => {
        const a = -Math.PI / 2 + (j * 2 * Math.PI) / n;
        return <line key={j} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke="rgba(244,233,210,0.15)" strokeWidth="1" />;
      })}
      <polygon points={pts.map((p) => p.join(',')).join(' ')} fill="var(--primary)" fillOpacity="0.35" stroke="var(--primary)" strokeWidth="2.4" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="var(--yellow)" stroke="var(--primary-deep)" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

const FLOAT_LABELS: { letter: Letter; x: number; y: number; rot: number; fade: number; hi?: boolean }[] = [
  { letter: 'R', x: 30, y: 30, rot: -10, fade: 0.55 },
  { letter: 'A', x: 230, y: 50, rot: 8, fade: 0.55 },
  { letter: 'I', x: 50, y: 230, rot: 6, fade: 1, hi: true },
  { letter: 'C', x: 240, y: 250, rot: -7, fade: 1, hi: true },
  { letter: 'S', x: 130, y: 460, rot: 4, fade: 0.5 },
  { letter: 'E', x: 60, y: 480, rot: -3, fade: 0.5 },
];

export default function ScreenGenerating({ live, onNav }: { live: boolean; onNav: OnNav }) {
  const [progress, setProgress] = useState(live ? 0 : 87);

  useEffect(() => {
    if (!live) return;
    const start = performance.now();
    const dur = 3200;
    let raf = 0;
    let done = false;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / dur);
      setProgress(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else if (!done) { done = true; setTimeout(() => onNav('done'), 350); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, onNav]);

  return (
    <ScreenShell bg="#141A2B" dark>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background:
        'radial-gradient(circle at 50% 38%, rgba(46,91,229,0.4) 0%, transparent 50%),'
        + 'radial-gradient(circle at 70% 80%, rgba(233,107,60,0.22) 0%, transparent 55%)' }} />
      {[[50, 110, 8], [330, 130, 10], [320, 420, 7], [70, 480, 9], [200, 90, 6], [40, 600, 8], [340, 580, 9], [180, 700, 7], [310, 720, 8]].map(([x, y, s], i) => (
        <Star4 key={i} size={s} color="rgba(244,200,74,0.7)" style={{ position: 'absolute', top: y, left: x }} />
      ))}

      <div style={{ padding: '20px 24px 0', color: 'var(--cream)', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)' }} />
          <span style={{ fontSize: 11, letterSpacing: '0.16em', color: 'rgba(237,241,247,0.7)' }}>ANALYZING · 第 4/4 维度</span>
        </div>

        <div className="h-display" style={{ fontSize: 24, lineHeight: 1.35, color: 'var(--cream)' }}>
          正在比对你的 18 题答案
          <br />与 <span style={{ color: 'var(--primary)' }}>16 张</span>未来专业人格卡
          <span style={{ color: 'var(--primary)' }}>……</span>
        </div>

        <div style={{ position: 'relative', marginTop: 24, height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1.5px dashed rgba(237,241,247,0.25)' }} />
          <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(237,241,247,0.15)' }} />
          <div style={{ position: 'relative', filter: 'drop-shadow(0 8px 24px rgba(46,91,229,0.45))' }}>
            <RadarChartDark />
          </div>
          {FLOAT_LABELS.map((l, i) => {
            const r = RIASEC[l.letter];
            return (
              <div key={i} style={{ position: 'absolute', left: l.x, top: l.y, transform: `rotate(${l.rot}deg)`, opacity: l.fade }}>
                <div style={{
                  background: l.hi ? r.bg : 'var(--paper)', color: r.c, padding: '6px 12px',
                  borderRadius: 999, border: `1.6px solid ${l.hi ? 'var(--primary)' : 'rgba(26,34,53,0.2)'}`,
                  fontSize: 12, fontWeight: 700,
                  boxShadow: l.hi ? '0 6px 18px rgba(46,91,229,0.45)' : '0 4px 10px rgba(0,0,0,0.2)',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <span className="h-fra" style={{ fontWeight: 900 }}>{l.letter}</span>
                  <span>{r.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{
            background: 'rgba(237,241,247,0.06)', border: '1px solid rgba(237,241,247,0.18)',
            borderRadius: 18, padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(237,241,247,0.7)' }}>正在生成你的专业人格卡</span>
              <span className="num-display" style={{ fontSize: 16, color: 'var(--primary)', fontWeight: 800 }}>{progress}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: 'rgba(237,241,247,0.15)', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, var(--yellow) 100%)', transition: 'width 0.12s linear' }} />
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(237,241,247,0.55)' }}>
              · RIASEC 兴趣分 · 专业大类提示分 · 双层加权完成
            </div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
