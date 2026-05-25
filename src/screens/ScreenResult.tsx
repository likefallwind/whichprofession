// 5. RESULT — 开卡揭晓页：Polaroid + confetti + constellation 六维
import { useState, useEffect } from 'react';
import { RIASEC } from '../data/quiz';
import type { ScoreResult } from '../lib/score';
import { ScreenShell, BackBtn, Sticker } from '../components/atoms';
import { Confetti } from '../components/doodles';
import type { OnNav } from './nav';

// 置信度文案（PRD §8.2，可叠加）
function confidenceLine(c: ScoreResult['confidence']): string {
  if (c.multi) return '你是未来多面手 · 给你 3 条探索线';
  const parts: string[] = [];
  if (c.mainClear) parts.push('你的主线很清晰');
  if (c.dualCore) parts.push('你是双核心人格 · 两线都值得探索');
  if (c.thirdColor) parts.push('还有一抹潜在第三色');
  return parts.join(' · ');
}

export default function ScreenResult({ result, onNav }: { result: ScoreResult; onNav: OnNav }) {
  const p = result.persona;
  const dims = result.ordered;
  const lowSet = new Set(result.confidence.lowDims);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <ScreenShell bg="var(--cream)" style={{
      background: `linear-gradient(180deg, ${p.bg} 0%, var(--cream) 36%)`,
    }}>
      {/* 顶部 confetti 爆开 */}
      {open && <Confetti count={20} area={{ w: 390, h: 520 }} />}

      <div style={{ position: 'relative', padding: '4px 16px 0' }}>
        {/* TOP */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <BackBtn onClick={() => onNav('back')} />
          <Sticker color="var(--yellow)" tilt={-4} size="s" style={{
            animation: open ? 'wp-pop 0.5s cubic-bezier(.34,1.56,.64,1)' : 'none',
          }}>★ OPENED ★</Sticker>
          <div onClick={() => onNav('library')} style={{
            width: 32, height: 32, borderRadius: 999, border: '1.8px solid var(--ink)',
            background: 'var(--paper)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="0.8" stroke="var(--ink)" strokeWidth="1.5" />
              <rect x="9" y="2" width="5" height="5" rx="0.8" stroke="var(--ink)" strokeWidth="1.5" />
              <rect x="2" y="9" width="5" height="5" rx="0.8" stroke="var(--ink)" strokeWidth="1.5" />
              <rect x="9" y="9" width="5" height="5" rx="0.8" stroke="var(--ink)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* MEME headline */}
        <div style={{ marginTop: 18 }}>
          <div className="h-script" style={{
            fontSize: 26, color: p.c,
            transform: 'rotate(-2deg)', transformOrigin: 'left',
            opacity: open ? 1 : 0, transition: 'opacity 0.6s',
          }}>你是这一卡 ⤵</div>
          <h1 className="h-display" style={{
            margin: '4px 0 0', fontWeight: 900,
            fontSize: 44, lineHeight: 1.0, color: 'var(--ink)', letterSpacing: '-0.02em',
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.7s cubic-bezier(.2,.8,.2,1)',
          }}>{p.name}</h1>
        </div>

        {/* POLAROID Hero */}
        <div style={{
          margin: '24px auto 0', position: 'relative', width: 260,
          transform: open ? 'rotate(-3deg) scale(1)' : 'rotate(-12deg) scale(0.7)',
          opacity: open ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(.34,1.56,.64,1)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 6, transform: 'translate(4px, 6px)' }} />
          <div style={{
            position: 'relative', background: 'var(--paper)', border: '2.5px solid var(--ink)',
            borderRadius: 6, padding: 12,
          }}>
            <img src={p.img} alt={p.name} style={{
              width: '100%', aspectRatio: '1/1', objectFit: 'cover',
              border: '1.5px solid var(--ink)', display: 'block', background: p.bg,
            }} />
            <div style={{ paddingTop: 12, paddingBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div className="h-fra" style={{ fontWeight: 900, fontSize: 14, color: p.c, letterSpacing: '0.16em' }}>{p.code}</div>
              <div className="h-script" style={{ fontSize: 16, color: 'var(--ink-soft)' }}>{p.en}</div>
            </div>
          </div>

          {/* YOU sticker */}
          <div style={{
            position: 'absolute', top: -16, left: -10,
            background: 'var(--yellow)', color: 'var(--ink)',
            padding: '5px 12px', fontWeight: 900, fontSize: 13,
            border: '2px solid var(--ink)', borderRadius: 999,
            transform: 'rotate(-10deg)', letterSpacing: '0.14em',
            animation: open ? 'wp-pop 0.6s ease-out 0.4s backwards' : 'none',
          }}>YOU ★</div>

          {/* "就是我!" sticker */}
          <div className="h-script" style={{
            position: 'absolute', bottom: -16, right: -16,
            background: 'var(--pink)', color: 'var(--ink)',
            padding: '10px 16px',
            fontSize: 22, fontWeight: 900,
            border: '2px solid var(--ink)', borderRadius: '50% 50% 50% 0',
            transform: 'rotate(8deg)',
            animation: open ? 'wp-pop 0.6s ease-out 0.7s backwards' : 'none',
          }}>就是我!</div>
        </div>

        {/* Summary + keyword stickers */}
        <div style={{ marginTop: 34 }}>
          <p className="h-display" style={{
            margin: 0, fontWeight: 600,
            fontSize: 16, lineHeight: 1.55, color: 'var(--ink)', textAlign: 'center',
          }}>{p.summary}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
            {p.keywords.map((k, i) => (
              <Sticker key={i} color={p.bg} tilt={[-4, 2, -2][i % 3]} size="s" style={{ padding: '5px 12px', fontSize: 12 }}>{k}</Sticker>
            ))}
          </div>
        </div>

        {/* 六维 RADAR */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
            <Sticker color="var(--green)" tilt={-3} size="s" style={{ padding: '3px 10px', fontSize: 10 }}>六维 RADAR</Sticker>
            <span style={{ flex: 1, height: 2, borderTop: '2px dashed var(--ink-faint)' }} />
            <span className="h-fra" style={{ fontSize: 11, color: 'var(--ink-faint)', fontWeight: 800 }}>{p.code}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dims.map(([L, v], i) => {
              const r = RIASEC[L];
              const max = dims[0][1] || 1;
              const pct = Math.max(8, Math.round((v / max) * 100));
              const isTop2 = i < 2;
              return (
                <div key={L} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="h-fra" style={{
                    width: isTop2 ? 44 : 32, height: isTop2 ? 44 : 32, borderRadius: '50%',
                    background: r.c, color: '#fff',
                    border: '2px solid var(--ink)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: isTop2 ? 20 : 14,
                    boxShadow: isTop2 ? '3px 4px 0 var(--ink)' : 'none',
                    transform: isTop2 ? 'rotate(-3deg)' : 'rotate(0)',
                    flexShrink: 0,
                  }}>{L}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: isTop2 ? 13 : 12, fontWeight: isTop2 ? 800 : 600, color: 'var(--ink)' }}>{r.label}</span>
                      <span className="h-fra" style={{
                        fontSize: isTop2 ? 16 : 12,
                        fontWeight: 900, color: r.c,
                      }}>{v}</span>
                    </div>
                    <div style={{
                      height: isTop2 ? 12 : 6, marginTop: 4, borderRadius: 99,
                      background: 'var(--paper)', border: '1.4px solid var(--ink)', overflow: 'hidden',
                    }}>
                      <div style={{
                        width: open ? `${pct}%` : '0%', height: '100%', background: r.c,
                        transition: 'width 1s cubic-bezier(.2,.8,.2,1)',
                        transitionDelay: `${0.4 + i * 0.08}s`,
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: 'var(--ink-soft)' }}>
            ✦ {confidenceLine(result.confidence)}
          </div>
          {lowSet.size > 0 && (
            <div style={{ marginTop: 3, fontSize: 10.5, color: 'var(--ink-faint)' }}>
              {[...lowSet].map((l) => RIASEC[l].label).join('、')} 当前吸引力较低 —— 兴趣会随体验变化，不必担心。
            </div>
          )}
        </div>

        {/* 优先专业 */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <Sticker color="var(--pink)" tilt={2} size="s" style={{ padding: '3px 10px', fontSize: 10 }}>先看这些专业</Sticker>
            <span style={{ flex: 1, height: 2, borderTop: '2px dashed var(--ink-faint)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {result.priorityMajors.slice(0, 3).map((m, i) => (
              <div key={m.cat} onClick={() => onNav('majors')} style={{
                position: 'relative', cursor: 'pointer',
                transform: `rotate(${[-0.6, 0.8, -0.4][i]}deg)`,
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 14, transform: 'translate(3px, 4px)' }} />
                <div style={{
                  position: 'relative', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', background: 'var(--paper)',
                  border: '2px solid var(--ink)', borderRadius: 14,
                }}>
                  <div className="h-fra" style={{
                    fontWeight: 900, fontSize: 28, color: p.c,
                    minWidth: 30, lineHeight: 1,
                  }}>{['①', '②', '③'][i]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="h-display" style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>{m.cat}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 1 }}>{m.kw.slice(0, 3).join(' · ')}</div>
                  </div>
                  <span style={{ fontSize: 18 }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 两周任务 */}
        <div style={{ marginTop: 24 }}>
          <div style={{ position: 'relative', transform: 'rotate(-1deg)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 16, transform: 'translate(3px, 4px)' }} />
            <div style={{
              position: 'relative', padding: 14,
              background: 'var(--yellow)',
              border: '2px solid var(--ink)', borderRadius: 16,
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>📅</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="h-script" style={{ fontSize: 18, color: 'var(--ink)' }}>给你的两周任务</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--ink)', marginTop: 4 }}>{p.task}</div>
              </div>
            </div>
          </div>
        </div>

        {/* "不要误解" caveat */}
        <div style={{
          marginTop: 14, padding: '8px 12px', border: '1.4px dashed var(--ink)', borderRadius: 12,
          fontSize: 11, lineHeight: 1.55, color: 'var(--ink-soft)',
        }}>
          <strong style={{ color: 'var(--ink)' }}>不要误解：</strong>
          这反映的是当前兴趣倾向，不代表能力评价。最终选择还要结合成绩、选科、家庭条件和真实体验。
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <div onClick={() => onNav('majors')} style={{ flex: 1, position: 'relative', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 999, transform: 'translate(3px, 4px)' }} />
            <div style={{
              position: 'relative', background: 'var(--primary)', color: '#fff',
              padding: '15px 0', textAlign: 'center', border: '2px solid var(--ink)', borderRadius: 999,
              fontWeight: 800, fontSize: 15, letterSpacing: '0.02em',
            }}>查看完整专业报告</div>
          </div>
          <div onClick={() => onNav('share')} style={{ position: 'relative', cursor: 'pointer', width: 54 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 999, transform: 'translate(3px, 4px)' }} />
            <div style={{
              position: 'relative', width: '100%', borderRadius: 999,
              background: 'var(--paper)', border: '2px solid var(--ink)',
              padding: '13px 0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 18 }}>🎉</span>
            </div>
          </div>
        </div>

        <div onClick={() => onNav('restart')} style={{
          marginTop: 14, textAlign: 'center', fontSize: 12, fontWeight: 600,
          color: 'var(--ink-soft)', cursor: 'pointer',
        }}>↺ 重新测一次</div>
      </div>
    </ScreenShell>
  );
}
