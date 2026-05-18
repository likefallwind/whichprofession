// 3. QUIZ — 测试页（最想 + 第二想 双选）
import { QUIZ_BANK, RIASEC, type Letter } from '../data/quiz';
import { ScreenShell, PrimaryButton, BackBtn, RiasecBadge } from '../components/atoms';
import type { OnNav } from './nav';

export interface QuizState {
  qIndex: number;
  first: Letter | null;
  second: Letter | null;
  answeredCount: number;
}

export default function ScreenQuiz({ state, onNav }: { state: QuizState; onNav: OnNav }) {
  const { qIndex, first, second, answeredCount } = state;
  const total = QUIZ_BANK.length;
  const item = QUIZ_BANK[qIndex] ?? QUIZ_BANK[0];

  const pct = Math.round(((qIndex + (second ? 1 : first ? 0.5 : 0)) / total) * 100);

  const stepHint = !first
    ? { num: '1', text: '选你最想负责的一件事', c: 'var(--primary)' }
    : !second
      ? { num: '2', text: '再选第二想做的一件事', c: 'var(--accent)' }
      : { num: '✓', text: '已选完，进入下一题', c: 'var(--green)' };

  return (
    <ScreenShell bg="var(--cream)">
      <div style={{ padding: '8px 18px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <BackBtn onClick={() => onNav('back')} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', letterSpacing: '0.06em' }}>
                第 {qIndex + 1} / {total} 题 · {item.kind}
              </span>
              <span className="num-display" style={{ fontSize: 13, color: 'var(--primary)' }}>{pct}%</span>
            </div>
            <div style={{ position: 'relative', height: 8, background: 'var(--paper)', borderRadius: 999, border: '1.2px solid var(--ink)' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: 'var(--primary)', borderRadius: 999, transition: 'width 0.35s ease' }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span className="h-en" style={{ fontSize: 14, color: 'var(--primary)', flexShrink: 0 }}>
            scene · {String(item.id).padStart(2, '0')}
          </span>
          <span style={{ height: 1, flex: 1, background: 'rgba(26,34,53,0.15)' }} />
        </div>
        <div className="h-display" style={{ fontSize: 19, lineHeight: 1.35, color: 'var(--ink)', marginTop: 2 }}>
          {item.scene}
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 2, marginBottom: 8 }}>{item.q}</div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', marginBottom: 8,
          background: stepHint.c === 'var(--green)' || first ? '#DBE6CF' : 'var(--primary-soft)',
          borderRadius: 10, border: `1.4px solid ${stepHint.c}`,
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%', background: stepHint.c, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800,
          }}>{stepHint.num}</div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{stepHint.text}</span>
          {first && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--ink-soft)' }}>点已选项可取消</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {item.options.map((o) => {
            const isFirst = first === o.letter;
            const isSecond = second === o.letter;
            const isSel = isFirst || isSecond;
            const ri = RIASEC[o.letter];
            return (
              <div key={o.letter} data-testid={`opt-${o.letter}`} onClick={() => onNav('pick', { letter: o.letter })} style={{ position: 'relative', cursor: 'pointer' }}>
                {isSel && <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 14, transform: 'translate(2.5px, 3.5px)' }} />}
                <div style={{
                  position: 'relative', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 11px',
                  background: isSel ? ri.bg : 'var(--paper)',
                  border: `${isSel ? 2 : 1.4}px solid ${isSel ? 'var(--ink)' : 'rgba(26,34,53,0.18)'}`,
                  borderRadius: 14, transition: 'background 0.15s',
                }}>
                  <RiasecBadge letter={o.letter} size={28} />
                  <div style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{o.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25 }}>{o.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 1, lineHeight: 1.3 }}>{o.hint}</div>
                  </div>
                  {isSel ? (
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: isFirst ? 'var(--primary)' : 'var(--accent)',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 900, border: '1.4px solid var(--ink)', flexShrink: 0,
                    }}>{isFirst ? '1' : '2'}</div>
                  ) : (
                    <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1.4px dashed rgba(26,34,53,0.35)', flexShrink: 0 }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <button onClick={() => onNav('back')} style={{
            background: 'transparent', border: 'none', color: 'var(--ink-soft)',
            fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: 0,
            display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
          }}>← 上一题</button>
          <div style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
            已答 <span className="num-display" style={{ color: 'var(--ink-soft)' }}>{answeredCount}</span>/{total}
          </div>
          <PrimaryButton style={{ transform: 'scale(0.88)' }} onClick={() => onNav('next')} disabled={!(first && second)}>
            <span>{qIndex === total - 1 ? '生成' : '下一题'}</span>
            <span style={{ fontSize: 18 }}>→</span>
          </PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}
