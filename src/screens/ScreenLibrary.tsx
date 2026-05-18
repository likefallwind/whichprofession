// 7. LIBRARY — 16 张人格卡图鉴
import { PERSONAS, type Letter } from '../data/quiz';
import type { ScoreResult } from '../lib/score';
import { ScreenShell, Pill, BackBtn, RiasecBadge } from '../components/atoms';
import { Asterisk, Star4, Sparkle } from '../components/doodles';
import type { OnNav } from './nav';

const PCT_MAP: Record<string, number> = {
  'R-I': 8, 'R-A': 6, 'R-S': 5, 'R-E': 6, 'R-C': 4,
  'I-A': 6, 'I-S': 9, 'I-E': 7, 'I-C': 10,
  'A-S': 7, 'A-E': 9, 'A-C': 4,
  'S-E': 8, 'S-C': 5, 'E-C': 5, 多线: 1,
};

export default function ScreenLibrary({ result, onNav }: { result: ScoreResult; onNav: OnNav }) {
  const youCode = result.persona.code;

  return (
    <ScreenShell bg="var(--cream)">
      <Asterisk size={16} color="var(--primary)" style={{ position: 'absolute', top: 72, right: 32 }} />
      <Star4 size={10} color="var(--accent)" style={{ position: 'absolute', top: 96, right: 100 }} />

      <div style={{ padding: '4px 14px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <BackBtn onClick={() => onNav('back')} />
          <div style={{ flex: 1 }}>
            <div className="h-en" style={{ fontSize: 14, color: 'var(--primary)', lineHeight: 1 }}>future cards · 图鉴</div>
            <div className="h-display" style={{ fontSize: 17, color: 'var(--ink)' }}>16 张未来专业人格卡</div>
          </div>
          <Pill size="s" color="var(--ink-soft)">
            <span className="num-display" style={{ color: 'var(--primary)' }}>1</span>/16 已抽到
          </Pill>
        </div>

        <div style={{
          padding: '7px 11px', marginBottom: 10, background: 'var(--paper)',
          border: '1.4px dashed var(--ink)', borderRadius: 12,
          fontSize: 11, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: 14 }}>💡</span>
          <span>
            15 个 <span style={{ color: 'var(--ink)', fontWeight: 700 }}>RIASEC 双维组合</span>
            + 1 个<span style={{ color: 'var(--primary-deep)', fontWeight: 700 }}>多线探索</span>。
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
          {PERSONAS.map((p) => {
            const isYou = p.code === youCode;
            return (
              <div key={p.code} onClick={() => onNav(isYou ? 'result' : 'locked', { code: p.code })} style={{ position: 'relative', cursor: 'pointer' }}>
                {isYou && <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 12, transform: 'translate(3px, 4px)' }} />}
                <div style={{
                  position: 'relative', boxSizing: 'border-box',
                  background: isYou ? p.bg : 'var(--paper)',
                  border: isYou ? '2px solid var(--ink)' : '1.4px solid rgba(26,34,53,0.25)',
                  borderRadius: 12, overflow: 'hidden',
                }}>
                  {/* 角色插画缩略图 */}
                  <div style={{ position: 'relative', aspectRatio: '16 / 11', overflow: 'hidden', borderBottom: '1.4px solid var(--ink)' }}>
                    <img src={p.img} alt={p.name} style={{
                      width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 28%', display: 'block',
                      filter: isYou ? 'none' : 'grayscale(0.7) opacity(0.55)',
                    }} />
                    <span className="h-fra" style={{
                      position: 'absolute', top: 6, right: 6, fontSize: 10, fontWeight: 900, letterSpacing: '0.04em',
                      color: isYou ? p.c : 'var(--ink-faint)', background: 'rgba(255,255,255,0.86)',
                      padding: '1px 5px', borderRadius: 6,
                    }}>{p.code}</span>
                  </div>
                  {/* 信息区 */}
                  <div style={{ padding: '7px 10px 8px' }}>
                    <div className="h-display" style={{ fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.15 }}>
                      {p.name}
                      {isYou && <Sparkle size={10} color={p.c} style={{ marginLeft: 4, verticalAlign: 'top' }} />}
                    </div>
                    <div style={{ fontSize: 9.5, color: 'var(--ink-soft)', marginTop: 2, lineHeight: 1.4 }}>{p.keywords.slice(0, 2).join(' · ')}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4, marginTop: 6 }}>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {p.code !== '多线'
                          ? p.code.split('-').map((l) => <RiasecBadge key={l} letter={l as Letter} size={13} />)
                          : <Pill size="s" color={p.c} bg={p.bg} border={false} style={{ padding: '1px 6px', fontSize: 9 }}>MULTI</Pill>}
                      </div>
                      <span className="num-display" style={{ fontSize: 11, color: p.c, fontWeight: 800 }}>{PCT_MAP[p.code] ?? 5}%</span>
                    </div>
                  </div>
                </div>
                {isYou && (
                  <div style={{
                    position: 'absolute', top: -7, right: 9, background: 'var(--ink)', color: 'var(--cream)',
                    padding: '2px 7px', borderRadius: 999, fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
                    transform: 'rotate(4deg)', zIndex: 2,
                  }}>YOU ✦</div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, padding: '8px 4px 4px' }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-soft)' }}>分布数据 · demo · 实际版本以上线后口径为准</div>
          <div onClick={() => onNav('poster')} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 800, color: 'var(--primary)', cursor: 'pointer' }}>
            邀请朋友抽卡 →
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
