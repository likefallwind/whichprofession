// 8. POSTER — 分享海报（PRD §11）
import { useState } from 'react';
import { PERSONAS, type Letter } from '../data/quiz';
import type { ScoreResult } from '../lib/score';
import { ScreenShell, Pill, RiasecBadge } from '../components/atoms';
import { Star4, Sparkle, Asterisk, Squiggle, Underline, MarkerBlob } from '../components/doodles';
import type { OnNav } from './nav';

function ActionBtn({
  icon, label, onClick, primary = false, highlighted = false,
}: { icon: string; label: string; onClick: () => void; primary?: boolean; highlighted?: boolean }) {
  return (
    <div onClick={onClick} style={{
      flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      padding: '8px 4px', borderRadius: 12,
      background: highlighted ? 'var(--primary)' : primary ? 'rgba(46,91,229,0.22)' : 'rgba(255,255,255,0.04)',
      border: highlighted ? '1px solid var(--primary)' : primary ? '1px solid rgba(46,91,229,0.6)' : '1px solid rgba(255,255,255,0.08)',
      color: highlighted ? '#fff' : 'var(--cream)', transition: 'all 0.18s',
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 700 }}>{label}</span>
    </div>
  );
}

export default function ScreenPoster({ result, onNav }: { result: ScoreResult; onNav: OnNav }) {
  const p = result.persona;
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const majors = result.priorityMajors.slice(0, 3);
  const careers = p.careers.slice(0, 3);
  const no = p.code === '多线' ? '16' : String(PERSONAS.findIndex((x) => x.code === p.code) + 1).padStart(2, '0');

  return (
    <ScreenShell bg="#141A2B" dark>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background:
        'radial-gradient(ellipse 60% 42% at 50% 36%, rgba(46,91,229,0.32) 0%, transparent 60%),'
        + 'radial-gradient(ellipse 55% 30% at 50% 92%, rgba(233,107,60,0.2) 0%, transparent 70%)' }} />
      {[[36, 96, 7], [338, 110, 8], [22, 720, 9], [350, 700, 7], [200, 740, 6]].map(([x, y, s], i) => (
        <Star4 key={i} size={s} color="rgba(244,200,74,0.55)" style={{ position: 'absolute', top: y, left: x }} />
      ))}

      <div style={{ position: 'relative', padding: '4px 14px 0', color: 'var(--cream)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 4px', marginBottom: 4 }}>
          <div onClick={() => onNav('back')} style={{
            width: 30, height: 30, borderRadius: 999, background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff', fontSize: 20, fontWeight: 300, lineHeight: 1,
          }}>×</div>
          <span className="h-en" style={{ fontSize: 15, color: 'rgba(255,255,255,0.62)' }}>save & share</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.42)' }}>08 / 08</span>
        </div>

        {/* POSTER CARD */}
        <div style={{ position: 'relative', margin: '6px 0 0' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#070A12', borderRadius: 22, transform: 'translate(5px, 8px)' }} />
          <div className="paper-grain" style={{
            position: 'relative', borderRadius: 22, overflow: 'hidden',
            background: 'var(--cream)', border: '2px solid var(--ink)', padding: '13px 14px 11px',
          }}>
            <Star4 size={11} color={p.c} style={{ position: 'absolute', top: 50, right: 116 }} />
            <Sparkle size={18} color="var(--primary)" style={{ position: 'absolute', top: 78, right: 14, transform: 'rotate(14deg)' }} />
            <Asterisk size={12} color="var(--green)" style={{ position: 'absolute', top: 152, left: 6 }} />
            <Star4 size={9} color="var(--pink)" style={{ position: 'absolute', top: 38, left: 110 }} />
            <Squiggle width={36} height={9} color="var(--accent)" strokeWidth={2.2} style={{ position: 'absolute', top: 168, right: 16, transform: 'rotate(-10deg)' }} />

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Pill size="s" color="var(--ink)">未来专业人格卡</Pill>
              <span className="num-display" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.08em', fontWeight: 800 }}>NO.{no} / 16</span>
            </div>

            {/* HERO row */}
            <div style={{ position: 'relative', marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="h-en" style={{ fontSize: 16, color: p.c, display: 'inline-block', transform: 'rotate(-3deg)', lineHeight: 1, marginLeft: 2, marginBottom: 6, fontWeight: 700 }}>
                  I am · {p.en}
                </div>
                <div className="h-display" style={{ fontSize: 30, lineHeight: 1.02, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{p.name.slice(0, 2)}</div>
                <div style={{ marginTop: 2 }}>
                  <MarkerBlob color={p.bg} tilt={-2}>
                    <span className="h-display" style={{ fontSize: 30, lineHeight: 1.02, color: p.c, letterSpacing: '-0.02em' }}>{p.name.slice(2)}</span>
                  </MarkerBlob>
                </div>
                <Underline width={120} height={11} color={p.c} sw={2.6} style={{ marginTop: 2, marginLeft: -2 }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                  {p.code !== '多线'
                    ? p.code.split('-').map((l, i) => (
                        <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {i > 0 && <span style={{ color: 'var(--ink-faint)', fontWeight: 800 }}>·</span>}
                          <RiasecBadge letter={l as Letter} size={22} />
                        </span>
                      ))
                    : <Pill size="s" color={p.c}>MULTI</Pill>}
                  <span className="h-en" style={{ fontSize: 13, color: 'var(--ink-soft)', marginLeft: 4, fontWeight: 700 }}>{p.code}</span>
                </div>
              </div>

              {/* character block */}
              <div style={{ position: 'relative', width: 96, flexShrink: 0, marginTop: 4 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 14, transform: 'translate(3px, 4px)' }} />
                <div style={{
                  position: 'relative', height: 112, background: p.bg, border: '2px solid var(--ink)', borderRadius: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', inset: 6, borderRadius: 10, border: '1.2px dashed rgba(26,34,53,0.35)' }} />
                  <div style={{ fontSize: 50, lineHeight: 1, position: 'relative' }}>{p.icon}</div>
                  <div className="h-en" style={{ fontSize: 9.5, color: p.c, marginTop: 4, position: 'relative', fontWeight: 700, letterSpacing: '0.06em' }}>
                    {p.en.toUpperCase()}
                  </div>
                </div>
                <div style={{
                  position: 'absolute', top: -10, left: -14, background: 'var(--ink)', color: 'var(--cream)',
                  fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', padding: '3px 9px', borderRadius: 999, transform: 'rotate(-12deg)',
                }}>YOU ✦</div>
              </div>
            </div>

            {/* KEYWORDS */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
              {p.keywords.map((k, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && <span style={{ color: 'var(--ink-faint)', margin: '0 7px', fontWeight: 700 }}>｜</span>}
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)' }}>{k}</span>
                </span>
              ))}
            </div>

            {/* SUMMARY */}
            <div style={{ position: 'relative', marginTop: 8, padding: '7px 11px 7px 12px', borderLeft: `3px solid ${p.c}` }}>
              <div style={{ fontSize: 11.5, lineHeight: 1.55, color: 'var(--ink)' }}>"{p.summary}"</div>
            </div>

            {/* MAJORS row (3 only, PRD §11.1) */}
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                <span style={{ height: 1, width: 14, background: 'var(--ink-faint)' }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--ink-soft)', letterSpacing: '0.16em' }}>优先探索专业大类</span>
                <span style={{ flex: 1, height: 1, background: 'var(--ink-faint)' }} />
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {majors.map((m, i) => (
                  <div key={i} style={{
                    flex: 1, background: 'var(--paper)', border: '1.4px solid var(--ink)', borderRadius: 10,
                    padding: '6px 4px', textAlign: 'center', minWidth: 0,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink)' }}>{m.cat}</div>
                    <div style={{ fontSize: 9, color: 'var(--ink-soft)', marginTop: 2 }}>{m.kw[0]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CAREERS row (3 only) */}
            <div style={{ marginTop: 9 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                <span style={{ height: 1, width: 14, background: 'var(--ink-faint)' }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--ink-soft)', letterSpacing: '0.16em' }}>热门职业出口</span>
                <span style={{ flex: 1, height: 1, background: 'var(--ink-faint)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', fontSize: 11.5, fontWeight: 700, color: 'var(--ink)' }}>
                {careers.map((c, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    {i > 0 && <span style={{ color: 'var(--ink-faint)', margin: '0 5px' }}>｜</span>}
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* FOOTER QR */}
            <div style={{ marginTop: 11, paddingTop: 9, borderTop: '1.4px dashed rgba(26,34,53,0.35)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 50, height: 50, flexShrink: 0, background: '#fff', border: '1.4px solid var(--ink)', borderRadius: 8,
                display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 1, padding: 3, boxSizing: 'border-box',
              }}>
                {Array.from({ length: 64 }).map((_, i) => {
                  const row = Math.floor(i / 8), col = i % 8;
                  const isCorner = (row < 2 && col < 2) || (row < 2 && col > 5) || (row > 5 && col < 2);
                  const seed = (i * 13 + 7) % 11;
                  return <div key={i} style={{ background: isCorner || seed < 5 ? 'var(--ink)' : 'transparent' }} />;
                })}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="h-display" style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.2 }}>测测你是哪种未来专业人格</div>
                <div style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 2 }}>18 道大学场景题 · 3 分钟生成你的卡</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="h-display" style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.01em' }}>未来专业人格卡</div>
                <div className="h-en" style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2, letterSpacing: '0.04em' }}>major-card.cn</div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION SHEET */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 7 }}>
            <span style={{ height: 1, width: 24, background: 'rgba(255,255,255,0.25)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.18em' }}>SHARE</span>
            <span style={{ height: 1, width: 24, background: 'rgba(255,255,255,0.25)' }} />
          </div>
          <div style={{
            display: 'flex', gap: 8, padding: 8,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 16,
          }}>
            <ActionBtn icon="⬇" label={saved ? '已保存到相册' : '保存图片'} primary highlighted={saved}
              onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800); }} />
            <ActionBtn icon="🔗" label={copied ? '链接已复制' : '复制链接'} highlighted={copied}
              onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }} />
            <ActionBtn icon="✉" label="发给朋友" onClick={() => {}} />
          </div>
          <div onClick={() => onNav('restart')} style={{
            marginTop: 14, textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
          }}>↺ 重新测一次</div>
        </div>
      </div>
    </ScreenShell>
  );
}
