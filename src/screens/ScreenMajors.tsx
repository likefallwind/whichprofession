// 6. MAJORS — 完整专业报告（优先 + 继续 + 职业出口 + 深度报告 + 注意事项）
import type { ReactNode } from 'react';
import type { Major } from '../data/quiz';
import type { ScoreResult } from '../lib/score';
import { ScreenShell, Pill, PrimaryButton, BackBtn, RiasecBadge, SectionLabel } from '../components/atoms';
import type { OnNav } from './nav';

function Chip({ children, color, filled = false }: { children: ReactNode; color: string; filled?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 999,
      border: `1.4px solid ${color}`, background: filled ? color : 'transparent',
      color: filled ? '#fff' : color, fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

function Arrow() {
  return (
    <svg width="14" height="9" viewBox="0 0 18 10" fill="none">
      <path d="M1 5h15m0 0l-4-4m4 4l-4 4" stroke="var(--ink-soft)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MajorRow({ m, rank, tier, tierC }: { m: Major; rank: number; tier: string; tierC: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9, padding: '8px 11px', background: 'var(--paper)',
      border: '1.4px solid var(--ink)', borderRadius: 12,
    }}>
      <span className="num-display" style={{ fontSize: 11, color: 'var(--ink-faint)', width: 24, letterSpacing: '0.04em' }}>
        {String(rank).padStart(2, '0')}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)' }}>{m.cat}</span>
          <span style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{m.disc}</span>
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 1 }}>
          {m.kw.slice(0, 3).join(' · ')} → {m.exits[0]} 等
        </div>
      </div>
      <div style={{ display: 'flex', gap: 2 }}>
        {m.riasec.slice(0, 3).map((l) => <RiasecBadge key={l} letter={l} size={16} />)}
      </div>
      <span style={{
        width: 26, height: 22, borderRadius: 6, border: `1.4px solid ${tierC}`,
        background: tier === 'A' ? tierC : 'var(--paper)', color: tier === 'A' ? '#fff' : tierC,
        fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{tier}</span>
    </div>
  );
}

export default function ScreenMajors({ result, onNav }: { result: ScoreResult; onNav: OnNav }) {
  const p = result.persona;
  const { priorityMajors, continueMajors } = result;
  // 深度报告：全量排名里去掉已在优先/继续中出现的，再取若干（PRD §8.3 8-12 个）
  const shown = new Set([...priorityMajors, ...continueMajors].map((m) => m.cat));
  const deepExtra = result.deepReport.filter((m) => !shown.has(m.cat)).slice(0, 6);

  return (
    <ScreenShell bg="var(--cream)">
      <div style={{ padding: '4px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <BackBtn onClick={() => onNav('back')} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.08em' }}>YOUR FULL REPORT</div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>完整专业探索报告</div>
          </div>
          <Pill size="s" color="var(--ink-soft)">2026 专业目录</Pill>
        </div>

        {/* 路径面包屑 */}
        <div style={{ position: 'relative', marginBottom: 10, padding: '9px 12px', background: 'var(--paper)', border: '1.6px solid var(--ink)', borderRadius: 14 }}>
          <div className="h-en" style={{ fontSize: 12, color: 'var(--ink-faint)', marginBottom: 6 }}>your path</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            <Chip color={p.c} filled>{p.name} {p.code}</Chip>
            <Arrow />
            <Chip color="var(--accent)">优先 {priorityMajors.length}</Chip>
            <Arrow />
            <Chip color="var(--ink)">继续 {continueMajors.length}</Chip>
          </div>
        </div>

        {/* 01 优先探索 */}
        <SectionLabel index="01" title="优先探索 · 适配度最高" accent={p.c} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
          {priorityMajors.map((m, i) => <MajorRow key={m.cat} m={m} rank={i + 1} tier="A" tierC={p.c} />)}
        </div>

        {/* 02 继续了解 */}
        <SectionLabel index="02" title="可以继续了解 · 相关方向" accent="var(--accent)" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
          {continueMajors.map((m, i) => <MajorRow key={m.cat} m={m} rank={i + 4} tier="B" tierC="var(--accent)" />)}
        </div>

        {/* 03 热门职业出口 */}
        <SectionLabel index="03" title="热门职业出口 · 你这类人格" accent="var(--green)" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
          {p.careers.slice(0, 5).map((c, i) => (
            <span key={i} style={{
              padding: '5px 11px', background: 'var(--paper)', border: '1.4px solid var(--ink)', borderRadius: 999,
              fontSize: 12, fontWeight: 700, color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} />
              {c}
            </span>
          ))}
        </div>

        {/* 04 深度报告 · 更多值得了解（PRD §8.3）*/}
        {deepExtra.length > 0 && (
          <>
            <SectionLabel index="04" title="深度报告 · 更多值得了解" accent="var(--ink-soft)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              {deepExtra.map((m, i) => <MajorRow key={m.cat} m={m} rank={i + 7} tier="C" tierC="var(--ink-soft)" />)}
            </div>
          </>
        )}

        {/* 注意事项（PRD §13.4）*/}
        <div style={{ border: '1.4px solid var(--ink)', borderRadius: 14, padding: '9px 12px', display: 'flex', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 16 }}>📌</span>
          <div style={{ flex: 1, fontSize: 11, lineHeight: 1.55, color: 'var(--ink)' }}>
            <strong style={{ display: 'block', fontWeight: 800, marginBottom: 2 }}>注意事项</strong>
            不同学校同名专业的<span style={{ color: p.c, fontWeight: 700 }}>培养方向不同</span>。
            填报时需结合招生章程、课程设置、往年录取位次和省份志愿规则综合判断。
            <span style={{ color: 'var(--ink-soft)' }}>试验班类（工科 / 理科 / 经管类等）属于"招生包"，请展开后再做匹配。</span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 8 }}>
          <PrimaryButton style={{ flex: 1 }} onClick={() => onNav('poster')}>
            <span>领取完整报告</span>
          </PrimaryButton>
          <div onClick={() => onNav('consult')} style={{ flex: 1, position: 'relative', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 999, transform: 'translate(3px, 4px)' }} />
            <div style={{
              position: 'relative', background: 'var(--paper)', border: '2px solid var(--ink)', borderRadius: 999,
              padding: '16px 0', textAlign: 'center', fontWeight: 800, fontSize: 14, color: 'var(--ink)',
            }}>预约 1v1 咨询</div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
