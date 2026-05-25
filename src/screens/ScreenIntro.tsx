// 2. INTRO — 题前说明（PRD §4.3 + §13 合规底线）· 贴纸风
import { ScreenShell, PrimaryButton, BackBtn, Sticker } from '../components/atoms';
import { MarkerBlob } from '../components/doodles';
import type { OnNav } from './nav';

const RULES = [
  { n: '01', emoji: '👆', title: '每题选两次', body: '先选你"最想负责"的一件事，再选"第二想做"的一件事。' },
  { n: '02', emoji: '✨', title: '不用考虑"会不会"', body: '只问你"愿不愿意尝试"。能力可以训练，兴趣是出发点。' },
  { n: '03', emoji: '🧭', title: '结果只是探索建议', body: '不代表能力评价，也不是志愿填报结论。' },
];

export default function ScreenIntro({ onNav }: { onNav: OnNav }) {
  return (
    <ScreenShell bg="var(--cream)">
      {/* 顶部色块 */}
      <div style={{
        position: 'absolute', top: -100, right: -60, width: 280, height: 280,
        background: 'var(--pink)', borderRadius: '50%', opacity: 0.32, pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', padding: '4px 22px 0' }}>
        {/* TOP NAV */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <BackBtn onClick={() => onNav('back')} />
          <Sticker color="var(--pink)" tilt={2} size="s">玩法说明</Sticker>
          <div style={{ width: 32 }} />
        </div>

        {/* HERO */}
        <div style={{ marginTop: 28 }}>
          <h2 className="h-display" style={{
            margin: 0, fontWeight: 900,
            fontSize: 34, lineHeight: 1.08, color: 'var(--ink)', letterSpacing: '-0.015em',
          }}>
            就<MarkerBlob color="var(--yellow)" tilt={-1.5}>3 步</MarkerBlob>,<br />
            来抽你的<br />未来人格
          </h2>
        </div>

        {/* 3 张步骤卡 */}
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {RULES.map((it, i) => (
            <div key={it.n} style={{ position: 'relative', transform: `rotate(${i === 1 ? 1 : -0.6}deg)` }}>
              <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 16, transform: 'translate(3px, 4px)' }} />
              <div style={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', background: 'var(--paper)',
                border: '2px solid var(--ink)', borderRadius: 16,
              }}>
                <div className="h-fra" style={{
                  fontWeight: 900, fontSize: 26,
                  color: 'var(--primary)', minWidth: 36, lineHeight: 1,
                }}>{it.n}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="h-display" style={{ fontWeight: 800, fontSize: 15.5, color: 'var(--ink)' }}>{it.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2, lineHeight: 1.55 }}>{it.body}</div>
                </div>
                <div style={{
                  fontSize: 28, flexShrink: 0,
                  animation: `wp-bounce ${2 + i * 0.4}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}>{it.emoji}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 时长虚线提示 */}
        <div style={{
          marginTop: 18, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10,
          border: '1.4px dashed var(--ink)', borderRadius: 14,
        }}>
          <span style={{ fontSize: 18 }}>⏱️</span>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
            预计 <span className="num-display" style={{ color: 'var(--ink)', fontWeight: 800 }}>3-5</span> 分钟 · 中途自动保存进度
          </span>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 18 }}>
          <PrimaryButton onClick={() => onNav('start')} style={{ width: '100%' }}>
            <span>来 抽 第 1 题!</span>
            <span style={{ fontSize: 20 }}>→</span>
          </PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}
