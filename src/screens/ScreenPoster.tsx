// 8. POSTER — 分享海报 · 贴纸风
import { useState } from 'react';
import { PERSONAS } from '../data/quiz';
import type { ScoreResult } from '../lib/score';
import { ScreenShell, BackBtn, Sticker } from '../components/atoms';
import type { OnNav } from './nav';

export default function ScreenPoster({ result, onNav }: { result: ScoreResult; onNav: OnNav }) {
  const p = result.persona;
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const majors = result.priorityMajors.slice(0, 3);
  const careers = p.careers.slice(0, 3);
  const no = p.code === '多线' ? '16' : String(PERSONAS.findIndex((x) => x.code === p.code) + 1).padStart(2, '0');

  return (
    <ScreenShell bg="var(--cream)" style={{
      background: 'linear-gradient(180deg, var(--yellow) 0%, var(--cream) 42%)',
    }}>
      <div style={{ padding: '4px 18px 0' }}>
        {/* TOP */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <BackBtn onClick={() => onNav('back')} />
          <Sticker color="var(--paper)" tilt={2} size="s">分享海报</Sticker>
          <div style={{ width: 32 }} />
        </div>

        {/* POSTER CARD */}
        <div style={{ position: 'relative', marginTop: 22, transform: 'rotate(-2deg)' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 14, transform: 'translate(5px, 7px)' }} />
          <div className="paper-grain" style={{
            position: 'relative', background: p.bg, padding: 16,
            border: '2.5px solid var(--ink)', borderRadius: 14,
          }}>
            {/* 顶部双贴纸 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Sticker color="var(--paper)" tilt={-3} size="s">未来专业人格卡 #{p.code}</Sticker>
              <Sticker color="var(--pink)" tilt={4} size="s">NO.{no}</Sticker>
            </div>

            {/* 人物图 + YOU 贴纸 */}
            <div style={{ marginTop: 14, position: 'relative' }}>
              <img src={p.img} alt="" style={{
                width: '100%', aspectRatio: '1/1', objectFit: 'cover',
                border: '2px solid var(--ink)', borderRadius: 6, display: 'block', background: '#fff',
              }} />
              <div style={{
                position: 'absolute', top: -10, right: -10,
                background: 'var(--yellow)', color: 'var(--ink)',
                padding: '6px 12px', fontWeight: 900, fontSize: 13,
                border: '2px solid var(--ink)', borderRadius: 999,
                transform: 'rotate(10deg)', letterSpacing: '0.14em',
              }}>YOU ★</div>
            </div>

            {/* 名字 */}
            <h2 className="h-display" style={{
              margin: '14px 0 0', fontWeight: 900,
              fontSize: 28, lineHeight: 1.05, color: 'var(--ink)', textAlign: 'center',
            }}>{p.name}</h2>

            {/* Summary */}
            <p className="h-display" style={{
              margin: '8px 0 0', fontSize: 12, lineHeight: 1.55, color: 'var(--ink)',
              textAlign: 'center', fontWeight: 500,
            }}>{p.summary}</p>

            {/* 推荐 / 扫码 */}
            <div style={{
              marginTop: 14, padding: '8px 0',
              borderTop: '1.4px dashed var(--ink)', borderBottom: '1.4px dashed var(--ink)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="h-fra" style={{
                  fontSize: 9, color: 'var(--ink-soft)', letterSpacing: '0.14em', fontWeight: 700,
                }}>RECOMMENDED</div>
                <div className="h-script" style={{ fontSize: 14, color: p.c, marginTop: 2 }}>
                  {majors[0]?.cat}
                </div>
                <div style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 2 }}>
                  {careers.slice(0, 2).join(' · ')}
                </div>
              </div>
              {/* QR 占位 */}
              <div style={{
                width: 56, height: 56, flexShrink: 0, background: '#fff',
                border: '1.4px solid var(--ink)', borderRadius: 8, padding: 4,
                display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 1, boxSizing: 'border-box',
              }}>
                {Array.from({ length: 64 }).map((_, i) => {
                  const row = Math.floor(i / 8), col = i % 8;
                  const isCorner = (row < 2 && col < 2) || (row < 2 && col > 5) || (row > 5 && col < 2);
                  const seed = (i * 13 + 7) % 11;
                  return <div key={i} style={{ background: isCorner || seed < 5 ? 'var(--ink)' : 'transparent' }} />;
                })}
              </div>
            </div>

            <div className="h-fra" style={{
              marginTop: 8, textAlign: 'center',
              fontSize: 9, color: 'var(--ink-soft)', letterSpacing: '0.2em', fontWeight: 700,
            }}>未来专业人格卡 · 2026</div>
          </div>
        </div>

        {/* ACTION 两键 */}
        <div style={{ marginTop: 22, display: 'flex', gap: 8 }}>
          <div
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800); }}
            style={{ flex: 1, position: 'relative', cursor: 'pointer' }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 999, transform: 'translate(3px, 4px)' }} />
            <div style={{
              position: 'relative', background: 'var(--primary)', color: '#fff',
              padding: '15px 0', border: '2px solid var(--ink)', borderRadius: 999,
              textAlign: 'center', fontWeight: 800, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <span>📥</span><span>{saved ? '已保存到相册' : '保存图片'}</span>
            </div>
          </div>
          <div
            onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }}
            style={{ flex: 1, position: 'relative', cursor: 'pointer' }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', borderRadius: 999, transform: 'translate(3px, 4px)' }} />
            <div style={{
              position: 'relative', background: 'var(--pink)', color: 'var(--ink)',
              padding: '15px 0', border: '2px solid var(--ink)', borderRadius: 999,
              textAlign: 'center', fontWeight: 800, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <span>🔗</span><span>{copied ? '链接已复制' : '复制链接'}</span>
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
