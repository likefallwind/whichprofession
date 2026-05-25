// 1. LANDING — 首页（PRD §4.1） · 贴纸/Z 世代视觉
import { PERSONAS } from '../data/quiz';
import { ScreenShell, PrimaryButton, Sticker } from '../components/atoms';
import { Star4, Sparkle, Asterisk, MarkerBlob } from '../components/doodles';
import type { OnNav } from './nav';

export default function ScreenLanding({ onNav }: { onNav: OnNav }) {
  // 中间焦点卡 + 两侧衬卡：detective(I-C) / trend-maker(A-E) / narrator(I-A)
  const previewCodes = ['I-A', 'I-C', 'A-E'];
  const previewPersonas = previewCodes
    .map((c) => PERSONAS.find((p) => p.code === c)!)
    .filter(Boolean);

  return (
    <ScreenShell bg="var(--cream)">
      {/* 大色块 blob — 顶部 primary，底部 yellow，营造贴纸氛围 */}
      <div style={{
        position: 'absolute', top: -60, right: -80, width: 240, height: 240,
        background: 'var(--primary)', borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%',
        opacity: 0.18, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -60, width: 200, height: 200,
        background: 'var(--yellow)', borderRadius: '50% 50% 60% 40% / 40% 60% 50% 50%',
        opacity: 0.45, pointerEvents: 'none',
      }} />

      {/* 飘浮装饰 */}
      <div style={{ position: 'absolute', top: 70, left: 28, animation: 'wp-bounce 3s ease-in-out infinite' }}>
        <Sparkle size={26} color="var(--accent)" />
      </div>
      <div style={{ position: 'absolute', top: 120, right: 28, animation: 'wp-spin 12s linear infinite' }}>
        <Star4 size={20} color="var(--primary)" />
      </div>
      <div style={{ position: 'absolute', top: 188, left: 36, animation: 'wp-wobble 4s ease-in-out infinite' }}>
        <Asterisk size={18} color="var(--pink)" />
      </div>

      <div style={{ position: 'relative', padding: '6px 22px 0' }}>
        {/* TOP META */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Sticker color="var(--yellow)" tilt={-3} size="s">2026 · 高考特别企划</Sticker>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--ink-soft)', fontWeight: 700 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)' }} />
            ONLINE
          </div>
        </div>

        {/* HERO */}
        <div style={{ marginTop: 28 }}>
          <div className="h-script" style={{
            fontSize: 26, color: 'var(--primary)',
            transform: 'rotate(-4deg)', transformOrigin: 'left', marginBottom: -2,
          }}>hello, 高考生 ✦</div>

          <h1 className="h-display" style={{
            margin: 0, fontWeight: 900,
            fontSize: 42, lineHeight: 1.05, color: 'var(--ink)', letterSpacing: '-0.02em',
          }}>
            你的<br />
            <span style={{
              display: 'inline-block', position: 'relative',
              background: 'var(--ink)', color: 'var(--cream)',
              padding: '0 8px', transform: 'rotate(-2deg)',
            }}>未来人格</span>
            <br />会是<MarkerBlob color="var(--primary-soft)" tilt={-2}>
              <span style={{ color: 'var(--primary-deep)' }}>哪一卡</span>
            </MarkerBlob>?
          </h1>
        </div>

        {/* Preview cards — 焦点 + 衬卡（融合 A 尺寸） */}
        <div style={{ position: 'relative', height: 218, marginTop: 26 }}>
          {previewPersonas.map((p, i) => {
            const layout = [
              { x: 0,   y: 22, rot: -10, z: 1, w: 115, h: 162, focal: false },
              { x: 100, y: 0,  rot: -2,  z: 3, w: 145, h: 195, focal: true  },
              { x: 230, y: 24, rot: 9,   z: 2, w: 115, h: 162, focal: false },
            ][i];
            const imgH = Math.round(layout.h * 0.62);
            return (
              <div key={p.code} style={{
                position: 'absolute', left: layout.x, top: layout.y,
                width: layout.w, height: layout.h, transform: `rotate(${layout.rot}deg)`,
                zIndex: layout.z,
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 14, transform: 'translate(3px, 4px)' }} />
                <div style={{
                  position: 'absolute', inset: 0, background: p.bg, borderRadius: 14,
                  border: '2.4px solid var(--ink)', padding: layout.focal ? 9 : 7, overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <img src={p.img} alt="" style={{
                    width: '100%', height: imgH, objectFit: 'cover', objectPosition: 'top',
                    borderRadius: 8, border: '1.4px solid var(--ink)', background: '#fff', display: 'block',
                  }} />
                  <div style={{ marginTop: layout.focal ? 8 : 5 }}>
                    <div className="h-fra" style={{
                      fontWeight: 900, color: p.c,
                      fontSize: layout.focal ? 10 : 8.5, letterSpacing: '0.14em',
                    }}>{p.code}</div>
                    <div className="h-display" style={{
                      fontWeight: 800, color: 'var(--ink)',
                      fontSize: layout.focal ? 14 : 11.5, lineHeight: 1.15, marginTop: 1,
                    }}>{p.name}</div>
                    {layout.focal && (
                      <div style={{
                        fontSize: 9, color: 'var(--ink-soft)', marginTop: 2,
                        letterSpacing: '0.02em',
                      }}>{p.keywords[0]} · {p.keywords[1]}</div>
                    )}
                  </div>

                  {/* 焦点卡的 YOU 贴纸 */}
                  {layout.focal && (
                    <div style={{
                      position: 'absolute', top: -10, left: -8,
                      background: 'var(--yellow)', color: 'var(--ink)',
                      padding: '3px 9px', fontWeight: 900, fontSize: 9,
                      border: '1.6px solid var(--ink)', borderRadius: 999,
                      transform: 'rotate(-8deg)', letterSpacing: '0.14em',
                    }}>YOU?</div>
                  )}
                </div>
              </div>
            );
          })}
          {/* +13 张 sticker */}
          <div style={{
            position: 'absolute', right: 14, bottom: 6, zIndex: 4,
            background: 'var(--ink)', color: 'var(--cream)',
            padding: '5px 12px', borderRadius: 999, fontWeight: 900, fontSize: 11,
            letterSpacing: '0.08em', transform: 'rotate(8deg)',
          }}>+13 张</div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 18 }}>
          <PrimaryButton onClick={() => onNav('start')} style={{ width: '100%' }}>
            <Sparkle size={18} color="#fff" />
            <span>开始抽我的人格卡</span>
            <span style={{ fontSize: 18 }}>→</span>
          </PrimaryButton>
        </div>

        {/* 底部说明 + 已有人数 */}
        <div style={{
          textAlign: 'center', marginTop: 14, fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.55,
        }}>
          已有
          <span style={{
            display: 'inline-block', margin: '0 4px', padding: '0 7px',
            background: 'var(--yellow)', color: 'var(--ink)', fontWeight: 900,
            border: '1.4px solid var(--ink)', borderRadius: 999, fontSize: 12,
            transform: 'rotate(-2deg)',
          }}>28,392</span>
          位高考生生成
        </div>
        <div style={{
          textAlign: 'center', marginTop: 6, fontSize: 10, color: 'var(--ink-faint)', lineHeight: 1.55,
        }}>
          仅用于专业兴趣探索 · 不代表能力评价 · 不构成志愿填报建议
        </div>
      </div>
    </ScreenShell>
  );
}
