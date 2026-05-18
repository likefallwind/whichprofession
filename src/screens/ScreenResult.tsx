// 5. RESULT — 结果页（PRD §10 + §8.2 / §8.3）
import { Fragment } from 'react';
import { RIASEC, type Letter } from '../data/quiz';
import type { ScoreResult } from '../lib/score';
import { ScreenShell, Pill, PrimaryButton, BackBtn, RiasecBadge, SectionLabel } from '../components/atoms';
import { Confetti, Sparkle, Star4 } from '../components/doodles';
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
  const dimEntries = result.ordered;
  const lowSet = new Set(result.confidence.lowDims);

  return (
    <ScreenShell bg="var(--cream)">
      <Confetti count={14} area={{ w: 390, h: 280 }} />
      <div style={{ padding: '4px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <BackBtn onClick={() => onNav('back')} />
          <Pill size="s" color="var(--ink-soft)" bg="var(--paper)">
            <Star4 size={10} color={p.c} /> 你的人格卡 · {p.code}
          </Pill>
          <div onClick={() => onNav('library')} style={{
            width: 32, height: 32, borderRadius: 999, border: '1.6px solid var(--ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)', cursor: 'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" stroke="var(--ink)" strokeWidth="1.6" />
              <rect x="9" y="2" width="5" height="5" rx="1" stroke="var(--ink)" strokeWidth="1.6" />
              <rect x="2" y="9" width="5" height="5" rx="1" stroke="var(--ink)" strokeWidth="1.6" />
              <rect x="9" y="9" width="5" height="5" rx="1" stroke="var(--ink)" strokeWidth="1.6" />
            </svg>
          </div>
        </div>

        {/* HERO CARD */}
        <div style={{ position: 'relative', marginTop: 4 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 22, transform: 'translate(4px, 5px)' }} />
          <div style={{ position: 'relative', background: p.bg, border: '2px solid var(--ink)', borderRadius: 22, padding: '14px 16px', overflow: 'hidden' }}>
            <Sparkle size={20} color={p.c} style={{ position: 'absolute', top: 10, right: 10 }} />
            <Star4 size={12} color={p.c} style={{ position: 'absolute', bottom: 10, left: 14 }} />

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span className="h-en" style={{ fontSize: 14, color: p.c, fontWeight: 700 }}>your future card</span>
              <span className="num-display" style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{p.en}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
              <div style={{
                width: 62, height: 62, borderRadius: 14, background: '#fff', border: '2px solid var(--ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 34,
              }}>{p.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                  {p.code !== '多线'
                    ? p.code.split('-').map((l, i) => (
                        <Fragment key={i}>
                          {i > 0 && <span style={{ color: 'var(--ink-soft)', fontWeight: 800 }}>·</span>}
                          <RiasecBadge letter={l as Letter} size={22} />
                        </Fragment>
                      ))
                    : <Pill size="s" color={p.c}>未来多面手</Pill>}
                  <span className="h-en" style={{ fontSize: 12, color: 'var(--ink-soft)', marginLeft: 4 }}>{p.code}</span>
                </div>
                <div className="h-display" style={{ fontSize: 24, lineHeight: 1.1, color: 'var(--ink)' }}>{p.name}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {p.keywords.map((k, i) => (
                <span key={i} style={{
                  fontSize: 11, padding: '3px 9px', background: '#fff',
                  border: '1.2px solid var(--ink)', borderRadius: 999, fontWeight: 700, color: 'var(--ink)',
                }}>{k}</span>
              ))}
            </div>

            <div style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.6, color: 'var(--ink)' }}>"{p.summary}"</div>

            {/* 6 维分布条 */}
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
              {dimEntries.map(([letter, v]) => {
                const ri = RIASEC[letter];
                const max = dimEntries[0][1] || 1;
                const pct = Math.max(8, Math.round((v / max) * 100));
                return (
                  <div key={letter} style={{ background: '#fff', border: '1px solid var(--ink)', borderRadius: 8, padding: '5px 0 4px', textAlign: 'center' }}>
                    <div className="h-fra" style={{ fontSize: 13, fontWeight: 900, color: ri.c, lineHeight: 1 }}>{letter}</div>
                    <div className="num-display" style={{ fontSize: 11, color: 'var(--ink)', fontWeight: 800, marginTop: 1 }}>{v}</div>
                    <div style={{ height: 3, marginTop: 3, marginInline: 4, borderRadius: 2, background: 'var(--cream)', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: ri.c }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 8, fontSize: 10, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>✦</span>{confidenceLine(result.confidence)}
            </div>
            {lowSet.size > 0 && (
              <div style={{ marginTop: 3, fontSize: 9.5, color: 'var(--ink-faint)' }}>
                {[...lowSet].map((l) => RIASEC[l].label).join('、')} 当前吸引力较低 —— 兴趣会随体验变化，不必担心。
              </div>
            )}
          </div>
        </div>

        {/* 优先探索专业大类 */}
        <div style={{ marginTop: 14 }}>
          <SectionLabel index="01" title="优先探索的专业大类" accent={p.c} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {result.priorityMajors.map((m, i) => (
              <div key={m.cat} onClick={() => onNav('majors')} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: 'var(--paper)',
                border: '1.6px solid var(--ink)', borderRadius: 12, cursor: 'pointer',
              }}>
                <span className="num-display" style={{ fontSize: 16, color: p.c, fontWeight: 900, width: 20 }}>{['①', '②', '③'][i]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)' }}>{m.cat}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 1 }}>{m.kw.slice(0, 3).join(' · ')}</div>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {m.riasec.map((l) => <RiasecBadge key={l} letter={l} size={16} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 热门职业出口 */}
        <div style={{ marginTop: 12 }}>
          <SectionLabel index="02" title="热门职业出口" accent={p.c} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {p.careers.slice(0, 5).map((c, i) => (
              <span key={i} style={{
                padding: '5px 11px', background: 'var(--paper)', border: '1.4px solid var(--ink)',
                borderRadius: 999, fontSize: 12, fontWeight: 700, color: 'var(--ink)',
              }}>{c}</span>
            ))}
          </div>
        </div>

        {/* 两周体验任务 */}
        <div style={{ marginTop: 12, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 14, transform: 'translate(3px, 4px)' }} />
          <div style={{ position: 'relative', background: '#FBEFB6', border: '2px solid var(--ink)', borderRadius: 14, padding: '10px 12px', display: 'flex', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: 'var(--ink)', color: '#FBEFB6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16,
            }}>✓</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-soft)', letterSpacing: '0.06em' }}>两周体验任务 · 2-WEEK QUEST</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink)', marginTop: 2 }}>{p.task}</div>
            </div>
          </div>
        </div>

        {/* "不要误解" caveat */}
        <div style={{
          marginTop: 10, padding: '8px 12px', border: '1.4px dashed var(--ink)', borderRadius: 12,
          fontSize: 11, lineHeight: 1.55, color: 'var(--ink-soft)',
        }}>
          <strong style={{ color: 'var(--ink)' }}>不要误解：</strong>
          这反映的是当前兴趣倾向，不代表能力评价。最终选择还要结合成绩、选科、家庭条件和真实体验。
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'stretch' }}>
          <PrimaryButton style={{ flex: 1 }} onClick={() => onNav('majors')}>
            <span>查看完整专业报告</span>
          </PrimaryButton>
          <div onClick={() => onNav('share')} style={{ width: 50, height: 54, position: 'relative', flexShrink: 0, cursor: 'pointer' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 999, transform: 'translate(3px, 4px)' }} />
            <div style={{
              position: 'relative', width: '100%', height: '100%', borderRadius: 999,
              background: 'var(--paper)', border: '2px solid var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                <circle cx="4" cy="11" r="3" stroke="var(--ink)" strokeWidth="1.8" />
                <circle cx="16" cy="4" r="3" stroke="var(--ink)" strokeWidth="1.8" />
                <circle cx="16" cy="18" r="3" stroke="var(--ink)" strokeWidth="1.8" />
                <path d="M6.5 9.5l7-4M6.5 12.5l7 4" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
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
