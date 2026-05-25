// 4. GENERATING — 开卡中：6 个字母弹跳 + 旋转 sparkle + 三阶段进度
import { useState, useEffect } from 'react';
import { RIASEC } from '../data/quiz';
import { ScreenShell, Sticker } from '../components/atoms';
import { Sparkle, MarkerBlob } from '../components/doodles';
import type { OnNav } from './nav';

const LETTERS: ('R' | 'I' | 'A' | 'S' | 'E' | 'C')[] = ['R', 'I', 'A', 'S', 'E', 'C'];
const PHASES = ['比对 18 题答案', '计算 6 维分布', '匹配 16 张人格卡'];

export default function ScreenGenerating({ live, onNav }: { live: boolean; onNav: OnNav }) {
  const [pg, setPg] = useState(live ? 0 : 87);
  const [phase, setPhase] = useState(live ? 0 : 2);

  useEffect(() => {
    if (!live) return;
    const start = performance.now();
    const dur = 3200;
    let raf = 0;
    let done = false;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / dur);
      const p = Math.round(t * 100);
      setPg(p);
      setPhase(t < 0.35 ? 0 : t < 0.7 ? 1 : t < 0.98 ? 2 : 3);
      if (t < 1) raf = requestAnimationFrame(tick);
      else if (!done) { done = true; setTimeout(() => onNav('done'), 360); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, onNav]);

  return (
    <ScreenShell bg="var(--cream)">
      {/* 顶部大色块脉冲 */}
      <div style={{
        position: 'absolute', left: '50%', top: '38%', transform: 'translate(-50%, -50%)',
        width: 320, height: 320, borderRadius: '50%',
        background: 'var(--primary)', opacity: 0.16,
        animation: 'wp-bounce 2s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', padding: '6px 22px 0' }}>
        {/* TOP META */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Sticker color="var(--yellow)" tilt={-3} size="s">开卡中…</Sticker>
          <Sticker color="var(--paper)" tilt={2} size="s">
            <span className="h-fra" style={{ fontWeight: 900 }}>{pg}%</span>
          </Sticker>
        </div>

        {/* TITLE */}
        <div style={{ marginTop: 22 }}>
          <div className="h-script" style={{
            fontSize: 26, color: 'var(--ink-soft)',
            transform: 'rotate(-2deg)', transformOrigin: 'left',
          }}>{PHASES[Math.min(phase, 2)]}…</div>
          <h2 className="h-display" style={{
            margin: '6px 0 0', fontWeight: 900,
            fontSize: 30, lineHeight: 1.1, color: 'var(--ink)',
          }}>
            16 张里,<br />你是
            <MarkerBlob color="var(--yellow)" tilt={-2}>
              <span style={{ color: 'var(--primary)' }}>那一张</span>
            </MarkerBlob>?
          </h2>
        </div>

        {/* 6 弹跳字母 */}
        <div style={{
          position: 'relative', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
          padding: '40px 4px 0', height: 160,
        }}>
          {LETTERS.map((L, i) => {
            const m = RIASEC[L];
            const filled = pg > i * 15;
            const hi = (L === 'I' || L === 'C');
            return (
              <div key={L} style={{
                width: 44, height: 60,
                animation: `wp-bounce ${0.7 + i * 0.12}s ease-in-out infinite`,
                animationDelay: `${i * 0.08}s`,
              }}>
                <div className="h-fra" style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: filled ? (hi ? m.c : m.bg) : 'var(--paper)',
                  border: '2px solid var(--ink)',
                  color: filled && hi ? '#fff' : m.c,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 22,
                  transition: 'background 0.4s, color 0.4s',
                  boxShadow: hi && pg > 50 ? '0 4px 0 var(--ink)' : 'none',
                }}>{L}</div>
              </div>
            );
          })}

          {/* 中央旋转 sparkle */}
          <div style={{
            position: 'absolute', left: '50%', top: 'calc(100% - 110px)',
            transform: 'translate(-50%, -50%)',
            animation: 'wp-spin 4s linear infinite',
            pointerEvents: 'none',
          }}>
            <Sparkle size={56} color="var(--primary)" />
          </div>
        </div>

        {/* 三阶段进度卡 */}
        <div style={{ marginTop: 40 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 16, transform: 'translate(3px, 4px)' }} />
            <div style={{
              position: 'relative',
              background: 'var(--paper)', border: '2px solid var(--ink)', borderRadius: 16,
              padding: 14, display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              {PHASES.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: phase > i ? 'var(--green)' : phase === i ? 'var(--yellow)' : 'var(--cream)',
                    border: '1.4px solid var(--ink)', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 900, color: 'var(--ink)',
                  }}>{phase > i ? '✓' : ''}</span>
                  <span style={{
                    color: phase >= i ? 'var(--ink)' : 'var(--ink-faint)',
                    fontWeight: phase === i ? 800 : 600,
                  }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 8, textAlign: 'center', fontSize: 10.5, color: 'var(--ink-faint)' }}>
            · RIASEC 兴趣分 · 专业大类提示分 · 双层加权
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
