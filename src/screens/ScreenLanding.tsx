// 1. LANDING — 首页（PRD §4.1）
import { PERSONAS } from '../data/quiz';
import { ScreenShell, Pill, PrimaryButton } from '../components/atoms';
import { Star4, Sparkle, Squiggle, Asterisk, CurvedArrow, MarkerBlob } from '../components/doodles';
import type { OnNav } from './nav';

export default function ScreenLanding({ onNav }: { onNav: OnNav }) {
  const previewPersonas = ['R-I', 'I-C', 'A-E', 'S-E']
    .map((c) => PERSONAS.find((p) => p.code === c)!)
    .filter(Boolean);

  return (
    <ScreenShell bg="var(--cream)">
      <Star4 size={14} color="var(--primary)" style={{ position: 'absolute', top: 70, right: 38 }} />
      <Sparkle size={24} color="var(--accent)" style={{ position: 'absolute', top: 96, left: 28, transform: 'rotate(-12deg)' }} />
      <Squiggle width={70} height={12} color="var(--green)" strokeWidth={2.5} style={{ position: 'absolute', top: 78, left: 78, transform: 'rotate(-6deg)' }} />
      <Asterisk size={18} color="var(--pink)" style={{ position: 'absolute', top: 110, right: 90 }} />

      <div style={{ padding: '14px 26px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Pill size="s" color="var(--ink)">2026 高考 · 专业探索特别企划</Pill>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
            已开放
          </div>
        </div>

        <div className="h-en" style={{ fontSize: 22, color: 'var(--primary)', marginBottom: 4, transform: 'rotate(-3deg)', transformOrigin: 'left' }}>
          Hi, future you ✦
        </div>

        <div className="h-display" style={{ fontSize: 32, lineHeight: 1.22, color: 'var(--ink)' }}>
          高考后，你适合
          <br />先看哪些
          <br />
          <MarkerBlob color="var(--primary-soft)" tilt={-2}>
            <span style={{ color: 'var(--primary-deep)' }}>专业大类</span>
          </MarkerBlob>
          <span style={{ color: 'var(--primary)', marginLeft: 4 }}>？</span>
        </div>

        <div style={{ marginTop: 18, fontSize: 13, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: 300 }}>
          18 道大学场景题，生成你的
          <span style={{ color: 'var(--ink)', fontWeight: 700 }}>「未来专业人格卡」</span>
          ：看看哪些专业方向更值得你优先探索。
        </div>

        {/* persona preview — 4 张倾斜叠加卡 */}
        <div style={{ position: 'relative', height: 178, marginTop: 22 }}>
          {previewPersonas.map((p, i) => {
            const layout = [
              { x: 8, y: 6, rot: -8 },
              { x: 88, y: 30, rot: -2 },
              { x: 170, y: 8, rot: 4 },
              { x: 240, y: 36, rot: 10 },
            ][i];
            return (
              <div key={p.code} style={{
                position: 'absolute', left: layout.x, top: layout.y, width: 94, height: 128,
                transform: `rotate(${layout.rot}deg)`,
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 14, transform: 'translate(2px, 3px)' }} />
                <div style={{
                  position: 'absolute', inset: 0, background: p.bg, borderRadius: 14, border: '2px solid var(--ink)',
                  padding: 9, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 24, lineHeight: 1 }}>{p.icon}</div>
                    <span className="h-en" style={{ fontSize: 9, color: p.c, fontWeight: 800, letterSpacing: '0.05em' }}>{p.code}</span>
                  </div>
                  <div>
                    <div className="h-display" style={{ fontSize: 14, lineHeight: 1.15, color: 'var(--ink)' }}>{p.name}</div>
                    <div style={{ fontSize: 8.5, color: 'var(--ink-soft)', marginTop: 2, lineHeight: 1.3 }}>{p.keywords[0]} · {p.keywords[1]}</div>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{
            position: 'absolute', right: 8, top: 60, transform: 'rotate(8deg)',
            background: 'var(--ink)', color: 'var(--cream)',
            padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 800, letterSpacing: '0.06em',
          }}>+12 张</div>
          <CurvedArrow width={50} height={42} color="var(--ink)" style={{ position: 'absolute', right: 60, bottom: -18, transform: 'scaleX(-1) rotate(-30deg)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
          <PrimaryButton onClick={() => onNav('start')}>
            <span>开始生成我的专业人格卡</span>
            <span style={{ fontSize: 18 }}>→</span>
          </PrimaryButton>
        </div>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 10.5, color: 'var(--ink-soft)', lineHeight: 1.55, padding: '0 12px' }}>
          本测试用于专业兴趣探索，
          <span style={{ color: 'var(--ink-faint)' }}>不代表能力评价</span>，
          也不构成志愿填报建议。
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14 }}>
          <div style={{ display: 'flex' }}>
            {['var(--primary)', 'var(--accent)', 'var(--green)', 'var(--pink)'].map((c, i) => (
              <div key={i} style={{
                width: 22, height: 22, borderRadius: '50%', background: c,
                border: '1.6px solid var(--cream)', marginLeft: i ? -7 : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 10, fontWeight: 800,
              }}>{'李王张陈'[i]}</div>
            ))}
          </div>
          <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
            <span className="num-display" style={{ color: 'var(--ink)', fontSize: 13, fontWeight: 800 }}>28,392</span> 位高考生已生成
          </span>
        </div>
      </div>
    </ScreenShell>
  );
}
