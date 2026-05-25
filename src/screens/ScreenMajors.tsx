// 6. MAJORS — 完整专业报告 · 贴纸风
import type { ReactNode } from 'react';
import type { Major } from '../data/quiz';
import type { ScoreResult } from '../lib/score';
import { ScreenShell, PrimaryButton, BackBtn, RiasecBadge, Sticker } from '../components/atoms';
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

function MajorRow({ m, rank, tier, tierC, tilt }: { m: Major; rank: number; tier: string; tierC: string; tilt: number }) {
  return (
    <div style={{ position: 'relative', transform: `rotate(${tilt}deg)` }}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 12, transform: 'translate(3px, 4px)' }} />
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px',
        background: 'var(--paper)', border: '1.6px solid var(--ink)', borderRadius: 12,
      }}>
        <span className="num-display" style={{
          fontSize: 18, fontWeight: 900, color: tierC, minWidth: 26, letterSpacing: '0.02em', lineHeight: 1,
        }}>{String(rank).padStart(2, '0')}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span className="h-display" style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>{m.cat}</span>
            <span style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{m.disc}</span>
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 2 }}>
            {m.kw.slice(0, 3).join(' · ')} → {m.exits[0]} 等
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {m.riasec.slice(0, 3).map((l) => <RiasecBadge key={l} letter={l} size={16} />)}
        </div>
        <span style={{
          width: 24, height: 22, borderRadius: 6, border: `1.4px solid ${tierC}`,
          background: tier === 'A' ? tierC : 'var(--paper)', color: tier === 'A' ? '#fff' : tierC,
          fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{tier}</span>
      </div>
    </div>
  );
}

const ROW_TILTS = [-0.6, 0.8, -0.4, 0.5, -0.7, 0.3];

export default function ScreenMajors({ result, onNav }: { result: ScoreResult; onNav: OnNav }) {
  const p = result.persona;
  const { priorityMajors, continueMajors } = result;
  const shown = new Set([...priorityMajors, ...continueMajors].map((m) => m.cat));
  const deepExtra = result.deepReport.filter((m) => !shown.has(m.cat)).slice(0, 6);

  return (
    <ScreenShell bg="var(--cream)" style={{
      background: `linear-gradient(180deg, ${p.bg} 0%, var(--cream) 28%)`,
    }}>
      <div style={{ padding: '4px 16px 0' }}>
        {/* TOP */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <BackBtn onClick={() => onNav('back')} />
          <Sticker color="var(--yellow)" tilt={-3} size="s">专业报告</Sticker>
          <div style={{ width: 32 }} />
        </div>

        <div style={{ marginTop: 18 }}>
          <div className="h-script" style={{ fontSize: 22, color: p.c, transform: 'rotate(-2deg)', transformOrigin: 'left' }}>给 {p.name} 的</div>
          <h2 className="h-display" style={{
            margin: '4px 0 0', fontWeight: 900,
            fontSize: 30, lineHeight: 1.1, color: 'var(--ink)',
          }}>完整专业大类报告</h2>
        </div>

        {/* 路径面包屑 */}
        <div style={{
          position: 'relative', marginTop: 14, padding: '9px 12px',
          background: 'var(--paper)', border: '1.6px solid var(--ink)', borderRadius: 14,
        }}>
          <div className="h-en" style={{ fontSize: 12, color: 'var(--ink-faint)', marginBottom: 6 }}>your path</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            <Chip color={p.c} filled>{p.name} {p.code}</Chip>
            <span style={{ color: 'var(--ink-soft)' }}>→</span>
            <Chip color="var(--accent)">优先 {priorityMajors.length}</Chip>
            <span style={{ color: 'var(--ink-soft)' }}>→</span>
            <Chip color="var(--ink)">继续 {continueMajors.length}</Chip>
          </div>
        </div>

        {/* 01 优先探索 */}
        <div style={{ marginTop: 18, marginBottom: 10, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <Sticker color="var(--pink)" tilt={-3} size="s" style={{ padding: '3px 10px', fontSize: 10 }}>01 · 优先探索</Sticker>
          <span style={{ flex: 1, height: 2, borderTop: '2px dashed var(--ink-faint)' }} />
          <span className="h-fra" style={{ fontSize: 10, color: p.c, fontWeight: 800 }}>适配度最高</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {priorityMajors.map((m, i) => (
            <MajorRow key={m.cat} m={m} rank={i + 1} tier="A" tierC={p.c} tilt={ROW_TILTS[i % ROW_TILTS.length]} />
          ))}
        </div>

        {/* 02 继续了解 */}
        <div style={{ marginTop: 22, marginBottom: 10, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <Sticker color="var(--yellow)" tilt={2} size="s" style={{ padding: '3px 10px', fontSize: 10 }}>02 · 可以继续了解</Sticker>
          <span style={{ flex: 1, height: 2, borderTop: '2px dashed var(--ink-faint)' }} />
          <span className="h-fra" style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800 }}>相关方向</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {continueMajors.map((m, i) => (
            <MajorRow key={m.cat} m={m} rank={i + 4} tier="B" tierC="var(--accent)" tilt={ROW_TILTS[(i + 3) % ROW_TILTS.length]} />
          ))}
        </div>

        {/* 03 热门职业出口 */}
        <div style={{ marginTop: 22, marginBottom: 10, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <Sticker color="var(--green)" tilt={-2} size="s" style={{ padding: '3px 10px', fontSize: 10 }}>03 · 热门职业出口</Sticker>
          <span style={{ flex: 1, height: 2, borderTop: '2px dashed var(--ink-faint)' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {p.careers.slice(0, 6).map((c, i) => (
            <Sticker
              key={i}
              color={['var(--yellow)', 'var(--pink)', 'var(--primary-soft)', 'var(--accent)'][i % 4]}
              tilt={[-3, 2, -1, 3][i % 4]}
              size="s"
              style={{ padding: '4px 11px', fontSize: 11 }}
            >{c}</Sticker>
          ))}
        </div>

        {/* 04 深度报告 */}
        {deepExtra.length > 0 && (
          <>
            <div style={{ marginTop: 4, marginBottom: 10, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <Sticker color="var(--paper)" tilt={-2} size="s" style={{ padding: '3px 10px', fontSize: 10 }}>04 · 深度报告</Sticker>
              <span style={{ flex: 1, height: 2, borderTop: '2px dashed var(--ink-faint)' }} />
              <span className="h-fra" style={{ fontSize: 10, color: 'var(--ink-soft)', fontWeight: 800 }}>更多值得了解</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {deepExtra.map((m, i) => (
                <MajorRow key={m.cat} m={m} rank={i + 7} tier="C" tierC="var(--ink-soft)" tilt={ROW_TILTS[(i + 1) % ROW_TILTS.length]} />
              ))}
            </div>
          </>
        )}

        {/* 注意事项 */}
        <div style={{ border: '1.4px dashed var(--ink)', borderRadius: 14, padding: '9px 12px', display: 'flex', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 16 }}>📌</span>
          <div style={{ flex: 1, fontSize: 11, lineHeight: 1.55, color: 'var(--ink)' }}>
            <strong style={{ display: 'block', fontWeight: 800, marginBottom: 2 }}>注意事项</strong>
            不同学校同名专业的<span style={{ color: p.c, fontWeight: 700 }}>培养方向不同</span>。
            填报时需结合招生章程、课程设置、往年录取位次和省份志愿规则综合判断。
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <PrimaryButton style={{ flex: 1 }} onClick={() => onNav('poster')}>
            <span>领取完整报告</span>
            <span style={{ fontSize: 18 }}>🎉</span>
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
