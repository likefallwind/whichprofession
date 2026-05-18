// 2. INTRO — 题前说明（PRD §4.3 + §13 合规底线）
import { ScreenShell, PrimaryButton, BackBtn } from '../components/atoms';
import { MarkerBlob } from '../components/doodles';
import type { OnNav } from './nav';

const RULES = [
  { n: '01', icon: '🎯', title: '每题选两次', body: '先选你"最想负责"的一件事，再选"第二想做"的一件事。', tag: '最想 +2 · 第二 +1', tagC: 'var(--primary)' },
  { n: '02', icon: '💭', title: '不用考虑你"现在会不会"', body: '只问你"愿不愿意尝试"。能力可以训练，兴趣是出发点。', tag: '凭直觉作答', tagC: 'var(--accent)' },
  { n: '03', icon: '🧭', title: '结果只是探索建议', body: '不代表能力评价，也不是志愿填报结论。', tag: '仅供参考', tagC: 'var(--green)' },
];

export default function ScreenIntro({ onNav }: { onNav: OnNav }) {
  return (
    <ScreenShell bg="var(--cream)">
      <div style={{ padding: '4px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <BackBtn onClick={() => onNav('back')} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)' }}>开始之前</span>
        </div>

        <div className="h-en" style={{ fontSize: 18, color: 'var(--primary)', transform: 'rotate(-2deg)', display: 'inline-block' }}>
          before we start ✦
        </div>
        <div className="h-display" style={{ fontSize: 28, lineHeight: 1.22, marginTop: 6, marginBottom: 14, color: 'var(--ink)' }}>
          接下来你会看到
          <br /><MarkerBlob color="var(--primary-soft)" tilt={-1.5}>
            <span style={{ color: 'var(--primary-deep)' }}>18 个大学场景</span>
          </MarkerBlob>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 8 }}>
          {RULES.map((s) => (
            <div key={s.n} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 16, transform: 'translate(3px, 4px)' }} />
              <div style={{
                position: 'relative', background: 'var(--paper)', border: '2px solid var(--ink)',
                borderRadius: 16, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, background: s.tagC, color: '#fff',
                  border: '1.6px solid var(--ink)', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontSize: 20, lineHeight: 1 }}>{s.icon}</span>
                  <span className="h-en" style={{ fontSize: 9, marginTop: 1, fontWeight: 800 }}>{s.n}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ink)' }}>{s.title}</span>
                    <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: s.tagC, color: '#fff' }}>{s.tag}</span>
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.55, color: 'var(--ink-soft)', marginTop: 4 }}>{s.body}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 14, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10,
          border: '1.4px dashed var(--ink)', borderRadius: 14,
        }}>
          <span style={{ fontSize: 18 }}>⏱️</span>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
            预计 <span className="num-display" style={{ color: 'var(--ink)', fontWeight: 800 }}>3-5</span> 分钟 · 中途自动保存进度
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <PrimaryButton onClick={() => onNav('start')}>
            <span>我准备好了</span><span style={{ fontSize: 18 }}>→</span>
          </PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}
