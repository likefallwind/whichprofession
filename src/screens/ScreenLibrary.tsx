// 7. LIBRARY — 16 张人格卡图鉴 · 散落贴纸版
import { useState } from 'react';
import { PERSONAS, type Persona } from '../data/quiz';
import type { ScoreResult } from '../lib/score';
import { ScreenShell, BackBtn, Sticker } from '../components/atoms';
import { MarkerBlob } from '../components/doodles';
import type { OnNav } from './nav';

// 16 张卡各自的小倾斜（贴纸感）
const TILTS = [-2.5, 1.8, -1.4, 2.2, -0.8, 1.5, -2, 1.2, -1.6, 2.4, -2.2, 0.9, -1.5, 2.1, -2.6, 1.4];

export default function ScreenLibrary({ result, onNav }: { result: ScoreResult; onNav: OnNav }) {
  const youCode = result.persona.code;
  const [focus, setFocus] = useState<Persona | null>(null);

  return (
    <ScreenShell bg="var(--bg)">
      {/* sticky top */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5, background: 'var(--bg)',
        padding: '8px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <BackBtn onClick={() => onNav('back')} />
        <Sticker color="var(--pink)" tilt={-3} size="s">16 张大图鉴</Sticker>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ padding: '18px 18px 0' }}>
        <h2 className="h-display" style={{
          margin: 0, fontWeight: 900,
          fontSize: 28, lineHeight: 1.08, color: 'var(--ink)', letterSpacing: '-0.02em',
        }}>
          你抽到<MarkerBlob color="var(--yellow)" tilt={-2}>
            <span style={{ color: 'var(--primary)' }}>1 张</span>
          </MarkerBlob>,<br />
          还有 15 张<br />等你解锁
        </h2>

        <div style={{
          marginTop: 14, padding: '7px 11px', background: 'var(--paper)',
          border: '1.4px dashed var(--ink)', borderRadius: 12,
          fontSize: 11, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: 14 }}>💡</span>
          <span>
            15 个 <span style={{ color: 'var(--ink)', fontWeight: 700 }}>RIASEC 双维组合</span>
            + 1 个<span style={{ color: 'var(--primary-deep)', fontWeight: 700 }}>多线探索</span>
          </span>
        </div>
      </div>

      {/* scattered cards */}
      <div style={{
        padding: '18px 14px 28px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
      }}>
        {PERSONAS.map((p, i) => {
          const isYou = p.code === youCode;
          const locked = !isYou;
          const tilt = TILTS[i];
          return (
            <div
              key={p.code}
              onClick={() => !locked ? setFocus(p) : setFocus(p)}
              style={{
                position: 'relative', cursor: 'pointer',
                transform: `rotate(${tilt}deg)`,
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = `rotate(${tilt}deg) scale(1.04)`)}
              onMouseLeave={e => (e.currentTarget.style.transform = `rotate(${tilt}deg) scale(1)`)}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 12, transform: 'translate(3px, 4px)' }} />
              <div style={{
                position: 'relative', background: locked ? 'var(--paper)' : p.bg,
                border: '2px solid var(--ink)', borderRadius: 12, padding: 8,
                opacity: locked ? 0.55 : 1,
              }}>
                <div style={{ position: 'relative' }}>
                  <img src={p.img} alt={p.name} style={{
                    width: '100%', aspectRatio: '1/1', objectFit: 'cover',
                    border: '1.4px solid var(--ink)', borderRadius: 6,
                    filter: locked ? 'grayscale(1)' : 'none', display: 'block', background: '#fff',
                  }} />
                  {locked && (
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 32, pointerEvents: 'none',
                    }}>🔒</div>
                  )}
                </div>
                <div style={{ marginTop: 6 }}>
                  <div className="h-fra" style={{
                    fontSize: 10, fontWeight: 900,
                    color: locked ? 'var(--ink-faint)' : p.c, letterSpacing: '0.14em',
                  }}>{p.code}</div>
                  <div className="h-display" style={{
                    fontWeight: 800, fontSize: 13, color: 'var(--ink)',
                    marginTop: 1, lineHeight: 1.15,
                  }}>{p.name}</div>
                </div>

                {isYou && (
                  <div style={{
                    position: 'absolute', top: -10, right: -8,
                    background: 'var(--yellow)', color: 'var(--ink)',
                    padding: '3px 9px', fontWeight: 900, fontSize: 10,
                    border: '1.6px solid var(--ink)', borderRadius: 999,
                    transform: 'rotate(8deg)', letterSpacing: '0.14em',
                  }}>YOU ✦</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 18px 18px',
      }}>
        <div style={{ fontSize: 10.5, color: 'var(--ink-soft)' }}>分布数据 · demo · 实际以上线后口径为准</div>
        <div onClick={() => onNav('poster')} style={{
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
          fontWeight: 800, color: 'var(--primary)', cursor: 'pointer',
        }}>晒卡邀请朋友 →</div>
      </div>

      {/* 弹窗详情 */}
      {focus && (
        <div onClick={() => setFocus(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 26, zIndex: 100,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            position: 'relative', background: focus.bg, padding: 14,
            border: '2.5px solid var(--ink)', borderRadius: 12,
            animation: 'wp-pop 0.4s cubic-bezier(.34,1.56,.64,1)',
            transform: 'rotate(-2deg)', maxWidth: 300, width: '100%',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 12, transform: 'translate(4px, 5px)', zIndex: -1 }} />
            <img src={focus.img} alt="" style={{
              width: '100%', aspectRatio: '1/1', objectFit: 'cover',
              border: '2px solid var(--ink)', borderRadius: 6,
              filter: focus.code !== youCode ? 'grayscale(1)' : 'none',
            }} />
            <div style={{ marginTop: 10 }}>
              <div className="h-fra" style={{ fontSize: 11, fontWeight: 900, color: focus.c, letterSpacing: '0.18em' }}>{focus.code}</div>
              <div className="h-display" style={{ fontWeight: 900, fontSize: 22, color: 'var(--ink)', marginTop: 2 }}>{focus.name}</div>
              {focus.code !== youCode && (
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>🔒 还未解锁 · 重测可能抽到</div>
              )}
              <p style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.55, marginTop: 6, marginBottom: 0 }}>{focus.summary}</p>
            </div>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
