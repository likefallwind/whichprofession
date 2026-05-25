// 3. QUIZ — V1 大网格双选题（2×3 贴纸卡）
import { QUIZ_BANK, RIASEC, type Letter } from '../data/quiz';
import { ScreenShell, PrimaryButton, BackBtn, Sticker } from '../components/atoms';
import type { OnNav } from './nav';

export interface QuizState {
  qIndex: number;
  first: Letter | null;
  second: Letter | null;
  answeredCount: number;
}

// 6 张卡的静态倾斜（与设计稿一致）
const TILTS = [-3, 2, -1.5, 2.5, -2, 1.8];

export default function ScreenQuiz({ state, onNav }: { state: QuizState; onNav: OnNav }) {
  const { qIndex, first, second, answeredCount } = state;
  const total = QUIZ_BANK.length;
  const item = QUIZ_BANK[qIndex] ?? QUIZ_BANK[0];

  const pct = Math.round(((qIndex + (second ? 1 : first ? 0.5 : 0)) / total) * 100);

  // 底部 Ma Shan Zheng 提示
  const hint = !first
    ? '👆 选「最想做」'
    : !second
      ? '🤚 再选「第二想」'
      : '✨ 完美，下一题!';

  return (
    <ScreenShell bg="var(--cream)">
      <div style={{ padding: '4px 16px 0' }}>
        {/* TOP NAV + 进度条 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackBtn onClick={() => onNav('back')} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span className="h-script" style={{ fontSize: 16, color: 'var(--ink-soft)' }}>
                第 {qIndex + 1} / {total} 题
              </span>
              <Sticker color="var(--yellow)" tilt={-2} size="s" style={{ padding: '2px 9px', fontSize: 10 }}>{pct}%</Sticker>
            </div>
            {/* 18 个色块进度 */}
            <div style={{ display: 'flex', gap: 3 }}>
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 8, borderRadius: 4,
                  background:
                    i < qIndex ? 'var(--primary)'
                    : i === qIndex ? 'var(--primary)'
                    : 'var(--paper)',
                  opacity: i === qIndex ? (second ? 1 : first ? 0.7 : 0.4) : 1,
                  border: '1.4px solid var(--ink)',
                  transition: 'all 0.3s',
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* 题目区 */}
        <div style={{ marginTop: 16 }}>
          <Sticker color="var(--pink)" tilt={-3} size="s" style={{ padding: '3px 10px', fontSize: 11 }}>{item.kind}</Sticker>
          <h2 className="h-display" style={{
            margin: '10px 0 0', fontWeight: 900,
            fontSize: 22, lineHeight: 1.22, color: 'var(--ink)', letterSpacing: '-0.01em',
          }}>{item.scene}</h2>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>{item.q}</div>
        </div>

        {/* 2×3 大网格选项 */}
        <div style={{
          marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
        }}>
          {item.options.map((o, i) => {
            const isFirst = first === o.letter;
            const isSecond = second === o.letter;
            const isSel = isFirst || isSecond;
            const ri = RIASEC[o.letter];
            const baseTilt = TILTS[i];

            const setT = (el: HTMLDivElement, scale: number) => {
              el.style.transform = `rotate(${baseTilt}deg) scale(${scale})`;
            };

            return (
              <div
                key={o.letter}
                data-testid={`opt-${o.letter}`}
                onClick={() => onNav('pick', { letter: o.letter })}
                onPointerDown={e => setT(e.currentTarget, 0.95)}
                onPointerUp={e => setT(e.currentTarget, isSel ? 1.03 : 1)}
                onPointerLeave={e => setT(e.currentTarget, isSel ? 1.03 : 1)}
                style={{
                  position: 'relative', cursor: 'pointer',
                  transform: `rotate(${baseTilt}deg) scale(${isSel ? 1.03 : 1})`,
                  transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1)',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 16, transform: 'translate(3px, 4px)' }} />
                <div style={{
                  position: 'relative', padding: 12,
                  background: isSel ? ri.bg : 'var(--paper)',
                  border: '2.5px solid var(--ink)', borderRadius: 16,
                  display: 'flex', flexDirection: 'column',
                  minHeight: 158,
                }}>
                  {/* 顶部:字母圆 + 大 emoji */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="h-fra" style={{
                      width: 30, height: 30, borderRadius: '50%', background: ri.c,
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, fontSize: 15,
                      border: '1.6px solid var(--ink)',
                    }}>{o.letter}</div>
                    <span style={{ fontSize: 38, lineHeight: 1 }}>{o.icon}</span>
                  </div>

                  {/* 标题(底部) */}
                  <div className="h-display" style={{
                    marginTop: 'auto',
                    fontSize: 14, fontWeight: 800,
                    color: 'var(--ink)', lineHeight: 1.25,
                  }}>{o.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.3 }}>{o.hint}</div>

                  {/* 选中贴纸:"我"/"次" */}
                  {isSel && (
                    <div className="h-script" style={{
                      position: 'absolute', top: -12, right: -10,
                      width: 36, height: 36, borderRadius: '50%',
                      background: isFirst ? 'var(--ink)' : 'var(--accent)',
                      color: '#fff',
                      border: '2.5px solid var(--ink)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, fontWeight: 900,
                      animation: 'wp-pop 0.4s cubic-bezier(.34,1.56,.64,1)',
                      transform: 'rotate(-8deg)',
                    }}>{isFirst ? '我' : '次'}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部虚线分隔 + 提示语 + 下一题按钮 */}
        <div style={{
          marginTop: 14, paddingTop: 10,
          borderTop: '2px dashed var(--ink-faint)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="h-script" style={{ fontSize: 18, color: 'var(--ink)', lineHeight: 1.1 }}>{hint}</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-faint)', marginTop: 2 }}>
              已答 {answeredCount}/{total} · 点已选可取消
            </div>
          </div>
          <PrimaryButton
            style={{ transform: 'scale(0.88)', transformOrigin: 'right' }}
            onClick={() => onNav('next')}
            disabled={!(first && second)}
          >
            <span>{qIndex === total - 1 ? '开 卡' : '下一题'}</span>
            <span style={{ fontSize: 16 }}>→</span>
          </PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}
