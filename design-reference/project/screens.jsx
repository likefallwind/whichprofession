// screens.jsx — 未来专业人格卡 H5 · PRD v1.1
// 9 屏高保真稿（landing / intro / quiz / generating / result / majors / library / poster）
// 每屏可独立渲染在 390×844 iOS 框架里

const { Sparkle, Star4, Asterisk, Squiggle, Underline, CurvedArrow,
        Sun, Bolt, HandFrame, Confetti, RadarChart, MarkerBlob } = window;
const { QUIZ_BANK, PERSONAS, MAJORS, RIASEC, scoreAll, findMajor } = window;
const { IOSStatusBar } = window;

// ─── 演示用静态结果（画布模式 / 默认）─────────────────────
const DEMO_PERSONA = PERSONAS.find(p => p.code === 'I-C');
const DEMO_RESULT = {
  dim: { I: 17, C: 12, E: 9, R: 7, S: 5, A: 4 },
  ordered: [['I',17],['C',12],['E',9],['R',7],['S',5],['A',4]],
  top: 'I', second: 'C', confidence: 'clear',
  persona: DEMO_PERSONA,
  priorityMajors: [findMajor('计算机类'), findMajor('统计学类'), findMajor('数学类')],
  continueMajors: [findMajor('金融学类'), findMajor('管理科学与工程类'), findMajor('电子信息类')],
};

// ────────────────────────────────────────────────────────────
// 通用原子
// ────────────────────────────────────────────────────────────
function ScreenShell({ bg = 'var(--cream)', children, style = {}, statusBarDark = false }) {
  return (
    <div className="paper-grain" style={{
      width: '100%', height: '100%', background: bg, position: 'relative',
      overflow: 'hidden', color: 'var(--ink)', ...style,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 62, zIndex: 1 }}>
        <IOSStatusBar dark={statusBarDark} time="6:24" />
      </div>
      <div style={{
        position: 'relative', zIndex: 2, paddingTop: 50, height: '100%', boxSizing: 'border-box',
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

function Pill({ children, color = 'var(--ink)', bg = 'transparent', border = true, size = 'm', style = {} }) {
  const sizes = { s:{pad:'4px 10px',fs:11}, m:{pad:'6px 12px',fs:12}, l:{pad:'8px 16px',fs:13} };
  const s = sizes[size];
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:4,
      padding:s.pad, fontSize:s.fs, fontWeight:600, color, background:bg,
      border: border ? `1.4px solid ${color}` : 'none',
      borderRadius:999, letterSpacing:'0.02em', whiteSpace:'nowrap', ...style,
    }}>{children}</span>
  );
}

function PrimaryButton({ children, style = {}, dark = false, onClick, disabled = false }) {
  const op = disabled ? 0.4 : 1;
  return (
    <div onClick={disabled ? undefined : onClick} style={{
      position:'relative', display:'inline-flex',
      cursor: disabled ? 'not-allowed' : (onClick ? 'pointer':'default'),
      opacity: op, ...style,
    }}>
      <div style={{ position:'absolute', inset:0, background:'var(--ink)', borderRadius:999, transform:'translate(3px, 4px)' }} />
      <div style={{
        position:'relative', background: dark ? 'var(--ink)' : 'var(--primary)',
        color: dark ? 'var(--cream)' : '#fff',
        padding:'16px 26px', borderRadius:999,
        fontWeight:800, fontSize:16, letterSpacing:'0.02em',
        border:'2px solid var(--ink)',
        display:'inline-flex', alignItems:'center', gap:10,
      }}>{children}</div>
    </div>
  );
}

function HomeIndicator({ dark = false }) {
  return (
    <div style={{
      position:'absolute', bottom:0, left:0, right:0, height:34,
      display:'flex', justifyContent:'center', alignItems:'flex-end',
      paddingBottom:8, pointerEvents:'none', zIndex:60,
    }}>
      <div style={{
        width:139, height:5, borderRadius:100,
        background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(42,34,24,0.4)',
      }} />
    </div>
  );
}

function SectionLabel({ index, title, accent = 'var(--primary)' }) {
  return (
    <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:6 }}>
      <span className="h-en" style={{ fontSize:14, color: accent }}>{index}</span>
      <span className="h-display" style={{ fontSize:15, color:'var(--ink)' }}>{title}</span>
      <span style={{ flex:1, height:1, background:'rgba(42,34,24,0.15)' }} />
    </div>
  );
}

function BackBtn({ onClick, bg = 'transparent' }) {
  return (
    <div onClick={onClick} style={{
      width:32, height:32, borderRadius:999, border:'1.6px solid var(--ink)',
      display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
      background:bg, flexShrink:0,
    }}>
      <svg width="10" height="14" viewBox="0 0 10 14"><path d="M8 1L2 7l6 6" stroke="var(--ink)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  );
}

// 小标签：RIASEC 字母配色徽章
function RiasecBadge({ letter, size = 26 }) {
  const r = RIASEC[letter] || RIASEC.I;
  return (
    <div style={{
      width:size, height:size, borderRadius:size/2,
      background: r.c, color:'#fff',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontWeight:900, fontSize: size*0.55, fontFamily:'Fraunces, serif',
      border:'1.4px solid var(--ink)', flexShrink:0,
    }}>{letter}</div>
  );
}

// ────────────────────────────────────────────────────────────
// 1. LANDING — 首页
// ────────────────────────────────────────────────────────────
function ScreenLanding({ onNav = () => {} } = {}) {
  // 4 张预览卡（从 16 张里挑代表色）
  const previewPersonas = [
    PERSONAS.find(p => p.code === 'R-I'),
    PERSONAS.find(p => p.code === 'I-C'),
    PERSONAS.find(p => p.code === 'A-E'),
    PERSONAS.find(p => p.code === 'S-E'),
  ];
  return (
    <ScreenShell bg="var(--cream)">
      {/* corner decorations */}
      <Star4 size={14} color="var(--primary)" style={{ position:'absolute', top:70, right:38 }} />
      <Sparkle size={24} color="var(--accent)" style={{ position:'absolute', top:96, left:28, transform:'rotate(-12deg)' }} />
      <Squiggle width={70} height={12} color="var(--green)" strokeWidth={2.5} style={{ position:'absolute', top:78, left:78, transform:'rotate(-6deg)' }} />
      <Asterisk size={18} color="var(--pink)" style={{ position:'absolute', top:110, right:90 }} />

      <div style={{ padding:'14px 26px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <Pill size="s" color="var(--ink)">2026 高考 · 专业探索特别企划</Pill>
          <div style={{ fontSize:11, color:'var(--ink-soft)', display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--primary)' }} />
            已开放
          </div>
        </div>

        <div className="h-en" style={{ fontSize:22, color:'var(--primary)', marginBottom:4, transform:'rotate(-3deg)', transformOrigin:'left' }}>
          Hi, future you ✦
        </div>

        {/* 主标题（PRD 4.1）*/}
        <div className="h-display" style={{ fontSize:32, lineHeight:1.22, color:'var(--ink)' }}>
          高考后，你适合
          <br />先看哪些
          <br />
          <MarkerBlob color="var(--primary-soft)" tilt={-2}>
            <span style={{ color:'var(--primary-deep)' }}>专业大类</span>
          </MarkerBlob>
          <span style={{ color:'var(--primary)', marginLeft:4 }}>？</span>
        </div>

        {/* 副标题（PRD 4.1）*/}
        <div style={{ marginTop:18, fontSize:13, lineHeight:1.7, color:'var(--ink-soft)', maxWidth:300 }}>
          18 道大学场景题，生成你的
          <span style={{ color:'var(--ink)', fontWeight:700 }}>「未来专业人格卡」</span>
          ：看看哪些专业方向更值得你优先探索。
        </div>

        {/* persona preview — 4 张倾斜叠加卡 */}
        <div style={{ position:'relative', height:178, marginTop:22 }}>
          {previewPersonas.map((p, i) => {
            const layout = [
              { x:8,   y:6,   rot:-8 },
              { x:88,  y:30,  rot:-2 },
              { x:170, y:8,   rot:4  },
              { x:240, y:36,  rot:10 },
            ][i];
            return (
              <div key={p.code} style={{
                position:'absolute', left:layout.x, top:layout.y, width:94, height:128,
                transform:`rotate(${layout.rot}deg)`,
              }}>
                <div style={{ position:'absolute', inset:0, background:'var(--ink)', borderRadius:14, transform:'translate(2px, 3px)' }} />
                <div style={{
                  position:'absolute', inset:0, background:p.bg, borderRadius:14, border:'2px solid var(--ink)',
                  padding:9, boxSizing:'border-box', display:'flex', flexDirection:'column', justifyContent:'space-between',
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div style={{ fontSize:24, lineHeight:1 }}>{p.icon}</div>
                    <span className="h-en" style={{ fontSize:9, color:p.c, fontWeight:800, letterSpacing:'0.05em' }}>{p.code}</span>
                  </div>
                  <div>
                    <div className="h-display" style={{ fontSize:14, lineHeight:1.15, color:'var(--ink)' }}>{p.name}</div>
                    <div style={{ fontSize:8.5, color:'var(--ink-soft)', marginTop:2, lineHeight:1.3 }}>{p.keywords[0]} · {p.keywords[1]}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* "+12 张" 暗示 */}
          <div style={{
            position:'absolute', right:8, top:60, transform:'rotate(8deg)',
            background:'var(--ink)', color:'var(--cream)',
            padding:'4px 10px', borderRadius:999, fontSize:10, fontWeight:800,
            letterSpacing:'0.06em',
          }}>+12 张</div>
          <CurvedArrow width={50} height={42} color="var(--ink)" style={{ position:'absolute', right:60, bottom:-18, transform:'scaleX(-1) rotate(-30deg)' }} />
        </div>

        {/* CTA（PRD 4.1）*/}
        <div style={{ display:'flex', justifyContent:'center', marginTop:18 }}>
          <PrimaryButton onClick={() => onNav('start')}>
            <span>开始生成我的专业人格卡</span>
            <span style={{ fontSize:18 }}>→</span>
          </PrimaryButton>
        </div>

        {/* 底部小字（PRD 4.1）*/}
        <div style={{ textAlign:'center', marginTop:14, fontSize:10.5, color:'var(--ink-soft)', lineHeight:1.55, padding:'0 12px' }}>
          本测试用于专业兴趣探索，
          <span style={{ color:'var(--ink-faint)' }}>不代表能力评价</span>，
          也不构成志愿填报建议。
        </div>

        {/* social proof */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:14 }}>
          <div style={{ display:'flex' }}>
            {['var(--primary)','var(--accent)','var(--green)','var(--pink)'].map((c,i) => (
              <div key={i} style={{
                width:22, height:22, borderRadius:'50%', background:c,
                border:'1.6px solid var(--cream)', marginLeft: i ? -7 : 0,
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#fff', fontSize:10, fontWeight:800,
              }}>{'李王张陈'[i]}</div>
            ))}
          </div>
          <span style={{ fontSize:11, color:'var(--ink-soft)' }}>
            <span className="num-display" style={{ color:'var(--ink)', fontSize:13, fontWeight:800 }}>28,392</span> 位高考生已生成
          </span>
        </div>
      </div>
      <HomeIndicator />
    </ScreenShell>
  );
}

// ────────────────────────────────────────────────────────────
// 2. INTRO — 题前说明（PRD 4.3 + 13 合规底线）
// ────────────────────────────────────────────────────────────
function ScreenIntro({ onNav = () => {} } = {}) {
  return (
    <ScreenShell bg="var(--cream)">
      <div style={{ padding:'4px 22px 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
          <BackBtn onClick={() => onNav('back')} />
          <span style={{ fontSize:13, fontWeight:700, color:'var(--ink-soft)' }}>开始之前</span>
        </div>

        <div className="h-en" style={{ fontSize:18, color:'var(--primary)', transform:'rotate(-2deg)', display:'inline-block' }}>
          before we start ✦
        </div>
        <div className="h-display" style={{ fontSize:28, lineHeight:1.22, marginTop:6, marginBottom:14, color:'var(--ink)' }}>
          接下来你会看到
          <br /><MarkerBlob color="var(--primary-soft)" tilt={-1.5}>
            <span style={{ color:'var(--primary-deep)' }}>18 个大学场景</span>
          </MarkerBlob>
        </div>

        {/* 三步规则卡 */}
        <div style={{ display:'flex', flexDirection:'column', gap:9, marginTop:8 }}>
          {[
            { n:'01', icon:'🎯', title:'每题选两次',
              body:'先选你"最想负责"的一件事，再选"第二想做"的一件事。',
              tag:'最想 +2 · 第二 +1', tagC:'var(--primary)' },
            { n:'02', icon:'💭', title:'不用考虑你"现在会不会"',
              body:'只问你"愿不愿意尝试"。能力可以训练，兴趣是出发点。',
              tag:'凭直觉作答', tagC:'var(--accent)' },
            { n:'03', icon:'🧭', title:'结果只是探索建议',
              body:'不代表能力评价，也不是志愿填报结论。',
              tag:'仅供参考', tagC:'var(--green)' },
          ].map((s, i) => (
            <div key={i} style={{ position:'relative' }}>
              <div style={{ position:'absolute', inset:0, background:'var(--ink)', borderRadius:16, transform:'translate(3px, 4px)' }} />
              <div style={{
                position:'relative', background:'var(--paper)', border:'2px solid var(--ink)',
                borderRadius:16, padding:'12px 14px', display:'flex', gap:12, alignItems:'flex-start',
              }}>
                <div style={{
                  width:42, height:42, borderRadius:12, background:s.tagC, color:'#fff',
                  border:'1.6px solid var(--ink)', display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  <span style={{ fontSize:20, lineHeight:1 }}>{s.icon}</span>
                  <span className="h-en" style={{ fontSize:9, marginTop:1, fontWeight:800 }}>{s.n}</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                    <span style={{ fontSize:14.5, fontWeight:800, color:'var(--ink)' }}>{s.title}</span>
                    <span style={{
                      fontSize:9.5, fontWeight:700, padding:'2px 7px',
                      borderRadius:999, background:s.tagC, color:'#fff',
                    }}>{s.tag}</span>
                  </div>
                  <div style={{ fontSize:12, lineHeight:1.55, color:'var(--ink-soft)', marginTop:4 }}>
                    {s.body}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 时间预估 */}
        <div style={{
          marginTop:14, padding:'8px 12px', display:'flex', alignItems:'center', gap:10,
          background:'transparent', border:'1.4px dashed var(--ink)', borderRadius:14,
        }}>
          <span style={{ fontSize:18 }}>⏱️</span>
          <span style={{ fontSize:12, color:'var(--ink-soft)' }}>预计 <span className="num-display" style={{ color:'var(--ink)', fontWeight:800 }}>3-5</span> 分钟 · 中途自动保存进度</span>
        </div>

        <div style={{ display:'flex', justifyContent:'center', marginTop:16 }}>
          <PrimaryButton onClick={() => onNav('start')}>
            <span>我准备好了</span><span style={{ fontSize:18 }}>→</span>
          </PrimaryButton>
        </div>
      </div>
      <HomeIndicator />
    </ScreenShell>
  );
}

// ────────────────────────────────────────────────────────────
// 3. QUIZ — 测试页（最想 + 第二想 双选）
// ────────────────────────────────────────────────────────────
function ScreenQuiz({ state = {}, onNav = () => {} } = {}) {
  const qIndex   = typeof state.qIndex === 'number' ? state.qIndex : 0;
  const first    = state.first  ?? null;
  const second   = state.second ?? null;
  const total    = QUIZ_BANK.length;
  const item     = QUIZ_BANK[qIndex] || QUIZ_BANK[0];
  const answered = state.answeredCount ?? 0;

  // 进度：first 选了算 +0.5 题，second 选了算 +1 题
  const pct = Math.round(((qIndex + (second ? 1 : first ? 0.5 : 0)) / total) * 100);

  // 步骤提示
  const stepHint = !first
    ? { num:1, text:'选你最想负责的一件事', c:'var(--primary)' }
    : !second
      ? { num:2, text:'再选第二想做的一件事', c:'var(--accent)' }
      : { num:'✓', text:'已选完，进入下一题', c:'var(--green)' };

  return (
    <ScreenShell bg="var(--cream)">
      <div style={{ padding:'8px 18px 0' }}>
        {/* top bar — back + progress */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <BackBtn onClick={() => onNav('back')} />
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
              <span style={{ fontSize:11, fontWeight:600, color:'var(--ink-soft)', letterSpacing:'0.06em' }}>
                第 {qIndex + 1} / {total} 题 · {item.kind}
              </span>
              <span className="num-display" style={{ fontSize:13, color:'var(--primary)' }}>{pct}%</span>
            </div>
            <div style={{ position:'relative', height:8, background:'var(--paper)', borderRadius:999, border:'1.2px solid var(--ink)' }}>
              <div style={{ position:'absolute', left:0, top:0, bottom:0, width: pct + '%',
                background:'var(--primary)', borderRadius:999, transition:'width 0.35s ease' }} />
            </div>
          </div>
        </div>

        {/* 场景 */}
        <div style={{ marginTop:10, display:'flex', alignItems:'baseline', gap:6 }}>
          <span className="h-en" style={{ fontSize:14, color:'var(--primary)', flexShrink:0 }}>scene · {String(item.id).padStart(2,'0')}</span>
          <span style={{ height:1, flex:1, background:'rgba(42,34,24,0.15)' }} />
        </div>
        <div className="h-display" style={{ fontSize:19, lineHeight:1.35, color:'var(--ink)', marginTop:2 }}>
          {item.scene}
        </div>
        <div style={{ fontSize:14, color:'var(--ink-soft)', marginTop:2, marginBottom:8 }}>
          {item.q}
        </div>

        {/* 步骤提示条 */}
        <div style={{
          display:'flex', alignItems:'center', gap:8, padding:'6px 10px', marginBottom:8,
          background: stepHint.c === 'var(--green)' ? '#E1EBD3' : (first ? '#E1EBD3' : 'var(--primary-soft)'),
          borderRadius:10, border:`1.4px solid ${stepHint.c}`,
        }}>
          <div style={{
            width:20, height:20, borderRadius:'50%', background:stepHint.c, color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800,
          }}>{stepHint.num}</div>
          <span style={{ fontSize:12, fontWeight:700, color:'var(--ink)' }}>{stepHint.text}</span>
          {first && (
            <span style={{ marginLeft:'auto', fontSize:10, color:'var(--ink-soft)' }}>
              点已选项可取消
            </span>
          )}
        </div>

        {/* 6 options（RIASEC）*/}
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          {item.options.map((o) => {
            const isFirst  = first  === o.letter;
            const isSecond = second === o.letter;
            const isSel    = isFirst || isSecond;
            const ri       = RIASEC[o.letter];
            return (
              <div key={o.letter}
                onClick={() => onNav('pick', { letter: o.letter })}
                style={{ position:'relative', cursor:'pointer' }}>
                {isSel && (
                  <div style={{ position:'absolute', inset:0, background:'var(--ink)', borderRadius:14, transform:'translate(2.5px, 3.5px)' }} />
                )}
                <div style={{
                  position:'relative', display:'flex', alignItems:'center', gap:9,
                  padding:'8px 11px',
                  background: isSel ? ri.bg : 'var(--paper)',
                  border: `${isSel ? 2 : 1.4}px solid ${isSel ? 'var(--ink)' : 'rgba(42,34,24,0.18)'}`,
                  borderRadius:14, transition:'background 0.15s',
                }}>
                  {/* letter badge */}
                  <RiasecBadge letter={o.letter} size={28} />
                  {/* emoji */}
                  <div style={{ fontSize:20, lineHeight:1, flexShrink:0 }}>{o.icon}</div>
                  {/* text */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', lineHeight:1.25 }}>{o.title}</div>
                    <div style={{ fontSize:10, color:'var(--ink-soft)', marginTop:1, lineHeight:1.3 }}>{o.hint}</div>
                  </div>
                  {/* selection badge */}
                  {isSel ? (
                    <div style={{
                      width:24, height:24, borderRadius:'50%',
                      background: isFirst ? 'var(--primary)' : 'var(--accent)',
                      color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:11, fontWeight:900, border:'1.4px solid var(--ink)', flexShrink:0,
                    }}>{isFirst ? '1' : '2'}</div>
                  ) : (
                    <div style={{
                      width:22, height:22, borderRadius:'50%',
                      border:'1.4px dashed rgba(42,34,24,0.35)', flexShrink:0,
                    }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* footer nav */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12 }}>
          <button onClick={() => onNav('back')} style={{
            background:'transparent', border:'none', color:'var(--ink-soft)',
            fontFamily:'inherit', fontSize:13, fontWeight:600, padding:0,
            display:'flex', alignItems:'center', gap:4, cursor:'pointer',
          }}>← 上一题</button>
          <div style={{ fontSize:11, color:'var(--ink-faint)' }}>
            已答 <span className="num-display" style={{ color:'var(--ink-soft)' }}>{answered}</span>/{total}
          </div>
          <PrimaryButton
            style={{ transform:'scale(0.88)' }}
            onClick={() => onNav('next')}
            disabled={!(first && second)}>
            <span>{qIndex === total - 1 ? '生成' : '下一题'}</span>
            <span style={{ fontSize:18 }}>→</span>
          </PrimaryButton>
        </div>
      </div>
      <HomeIndicator />
    </ScreenShell>
  );
}

// ────────────────────────────────────────────────────────────
// 4. GENERATING — 生成动画
// ────────────────────────────────────────────────────────────
function ScreenGenerating({ live = false, onNav = () => {} } = {}) {
  const [progress, setProgress] = React.useState(live ? 0 : 87);
  React.useEffect(() => {
    if (!live) return;
    const start = performance.now(); const dur = 3200; let raf;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / dur);
      setProgress(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => onNav('done'), 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live]);

  // 6 个 RIASEC 维度漂浮，主导维度高亮
  const floatLabels = [
    { letter:'R', x:30,  y:30,  rot:-10, fade:0.55 },
    { letter:'A', x:230, y:50,  rot:8,   fade:0.55 },
    { letter:'I', x:50,  y:230, rot:6,   fade:1,    hi:true },
    { letter:'C', x:240, y:250, rot:-7,  fade:1,    hi:true },
    { letter:'S', x:130, y:460, rot:4,   fade:0.5 },
    { letter:'E', x:60,  y:480, rot:-3,  fade:0.5 },
  ];

  return (
    <ScreenShell bg="#2A2218" statusBarDark={true}>
      <div style={{ position:'absolute', inset:0, background:
        'radial-gradient(circle at 50% 38%, rgba(233,107,60,0.35) 0%, transparent 50%),'
        + 'radial-gradient(circle at 70% 80%, rgba(74,111,165,0.25) 0%, transparent 55%)',
        pointerEvents:'none' }} />
      {[[50,110,8],[330,130,10],[320,420,7],[70,480,9],[200,90,6],[40,600,8],[340,580,9],[180,700,7],[310,720,8]].map(([x,y,s],i)=>(
        <Star4 key={i} size={s} color="rgba(244,200,74,0.7)" style={{ position:'absolute', top:y, left:x }} />
      ))}

      <div style={{ padding:'20px 24px 0', color:'var(--cream)', position:'relative', height:'100%', boxSizing:'border-box' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--primary)' }} />
          <span style={{ fontSize:11, letterSpacing:'0.16em', color:'rgba(244,233,210,0.7)' }}>ANALYZING · 第 4/4 维度</span>
        </div>

        <div className="h-display" style={{ fontSize:24, lineHeight:1.35, color:'var(--cream)' }}>
          正在比对你的 18 题答案
          <br />与 <span style={{ color:'var(--primary)' }}>16 张</span>未来专业人格卡
          <span style={{ color:'var(--primary)' }}>……</span>
        </div>

        {/* radar center */}
        <div style={{ position:'relative', marginTop:24, height:320, display:'flex', justifyContent:'center', alignItems:'center' }}>
          <div style={{ position:'absolute', width:280, height:280, borderRadius:'50%', border:'1.5px dashed rgba(244,233,210,0.25)' }} />
          <div style={{ position:'absolute', width:220, height:220, borderRadius:'50%', border:'1px solid rgba(244,233,210,0.15)' }} />
          <div style={{ position:'relative', filter:'drop-shadow(0 8px 24px rgba(233,107,60,0.4))' }}>
            <RadarChartDark />
          </div>
          {/* floating RIASEC chips */}
          {floatLabels.map((l, i) => {
            const r = RIASEC[l.letter];
            return (
              <div key={i} style={{
                position:'absolute', left:l.x, top:l.y,
                transform:`rotate(${l.rot}deg)`, opacity:l.fade,
              }}>
                <div style={{
                  background: l.hi ? r.bg : 'var(--paper)', color: r.c,
                  padding:'6px 12px',
                  borderRadius:999, border:`1.6px solid ${l.hi ? 'var(--primary)' : 'rgba(42,34,24,0.2)'}`,
                  fontSize:12, fontWeight:700,
                  boxShadow: l.hi ? '0 6px 18px rgba(233,107,60,0.45)' : '0 4px 10px rgba(0,0,0,0.2)',
                  display:'flex', alignItems:'center', gap:5,
                }}>
                  <span className="h-fra" style={{ fontWeight:900 }}>{l.letter}</span>
                  <span>{r.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* progress bar */}
        <div style={{ position:'absolute', left:24, right:24, bottom:64 }}>
          <div style={{
            background:'rgba(244,233,210,0.06)', border:'1px solid rgba(244,233,210,0.18)',
            borderRadius:18, padding:'14px 16px', backdropFilter:'blur(6px)',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
              <span style={{ fontSize:12, color:'rgba(244,233,210,0.7)' }}>正在生成你的专业人格卡</span>
              <span className="num-display" style={{ fontSize:16, color:'var(--primary)', fontWeight:800 }}>{progress}%</span>
            </div>
            <div style={{ height:6, borderRadius:999, background:'rgba(244,233,210,0.15)', overflow:'hidden' }}>
              <div style={{ width: progress + '%', height:'100%', background:'linear-gradient(90deg, var(--primary) 0%, var(--yellow) 100%)', transition:'width 0.12s linear' }} />
            </div>
            <div style={{ marginTop:10, fontSize:11, color:'rgba(244,233,210,0.55)' }}>
              · RIASEC 兴趣分 · 专业大类提示分 · 双层加权完成
            </div>
          </div>
        </div>
      </div>
      <HomeIndicator dark={true} />
    </ScreenShell>
  );
}

function RadarChartDark() {
  const size = 220, cx = size/2, cy = size/2, r = size*0.4;
  const values = [0.5, 0.45, 0.92, 0.68, 0.4, 0.55];  // R I A S E C
  const n = values.length;
  const pts = values.map((v, i) => {
    const a = -Math.PI/2 + (i*2*Math.PI)/n;
    return [cx + Math.cos(a)*r*v, cy + Math.sin(a)*r*v];
  });
  return (
    <svg width={size} height={size}>
      {[0.33, 0.66, 1].map((f, i) => {
        const ring = Array.from({length:n}).map((_, j) => {
          const a = -Math.PI/2 + (j*2*Math.PI)/n;
          return `${cx + Math.cos(a)*r*f},${cy + Math.sin(a)*r*f}`;
        }).join(' ');
        return <polygon key={i} points={ring} fill="none" stroke="rgba(244,233,210,0.2)" strokeWidth="1" />;
      })}
      {Array.from({length:n}).map((_, j) => {
        const a = -Math.PI/2 + (j*2*Math.PI)/n;
        return <line key={j} x1={cx} y1={cy} x2={cx + Math.cos(a)*r} y2={cy + Math.sin(a)*r}
          stroke="rgba(244,233,210,0.15)" strokeWidth="1" />;
      })}
      <polygon points={pts.map(p => p.join(',')).join(' ')}
        fill="var(--primary)" fillOpacity="0.35" stroke="var(--primary)" strokeWidth="2.4"/>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="var(--yellow)" stroke="var(--primary-deep)" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// 5. RESULT — 结果页（PRD 10 + 8.3）
// ────────────────────────────────────────────────────────────
function ScreenResult({ result = DEMO_RESULT, onNav = () => {} } = {}) {
  const p = result.persona || DEMO_PERSONA;
  const dimEntries = result.ordered || [];

  // 置信度文案（PRD 8.2）
  const confText = {
    clear:  '你的主线很清晰',
    dual:   '你是双核心人格 · 两线都值得探索',
    third:  '你还有一抹潜在第三色',
    multi:  '你是未来多面手 · 给你 3 条线',
  }[result.confidence || 'clear'];

  return (
    <ScreenShell bg="var(--cream)">
      <Confetti count={14} area={{ w:390, h:280 }} />
      <div style={{ padding:'4px 16px 0' }}>
        {/* top bar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <BackBtn onClick={() => onNav('back')} />
          <Pill size="s" color="var(--ink-soft)" bg="var(--paper)" border={true}>
            <Star4 size={10} color={p.c} /> 你的人格卡 · {p.code}
          </Pill>
          <div onClick={() => onNav('library')} style={{
            width:32, height:32, borderRadius:999, border:'1.6px solid var(--ink)',
            display:'flex', alignItems:'center', justifyContent:'center', background:'var(--paper)', cursor:'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" stroke="var(--ink)" strokeWidth="1.6"/>
              <rect x="9" y="2" width="5" height="5" rx="1" stroke="var(--ink)" strokeWidth="1.6"/>
              <rect x="2" y="9" width="5" height="5" rx="1" stroke="var(--ink)" strokeWidth="1.6"/>
              <rect x="9" y="9" width="5" height="5" rx="1" stroke="var(--ink)" strokeWidth="1.6"/>
            </svg>
          </div>
        </div>

        {/* HERO CARD */}
        <div style={{ position:'relative', marginTop:4 }}>
          <div style={{ position:'absolute', inset:0, background:'var(--ink)', borderRadius:22, transform:'translate(4px, 5px)' }} />
          <div style={{
            position:'relative', background: p.bg, border:'2px solid var(--ink)',
            borderRadius:22, padding:'14px 16px 14px', overflow:'hidden',
          }}>
            <Sparkle size={20} color={p.c} style={{ position:'absolute', top:10, right:10 }} />
            <Star4 size={12} color={p.c} style={{ position:'absolute', bottom:10, left:14 }} />

            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
              <span className="h-en" style={{ fontSize:14, color:p.c, fontWeight:700 }}>your future card</span>
              <span className="num-display" style={{ fontSize:11, color:'var(--ink-soft)' }}>{p.en}</span>
            </div>

            {/* name + code + icon */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:6 }}>
              <div style={{
                width:62, height:62, borderRadius:14, background:'#fff', border:'2px solid var(--ink)',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:34,
              }}>{p.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:2 }}>
                  {p.code !== '多线'
                    ? p.code.split('-').map((l, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <span style={{ color:'var(--ink-soft)', fontWeight:800 }}>·</span>}
                          <RiasecBadge letter={l} size={22} />
                        </React.Fragment>
                      ))
                    : <Pill size="s" color={p.c}>未来多面手</Pill>
                  }
                  <span className="h-en" style={{ fontSize:12, color:'var(--ink-soft)', marginLeft:4 }}>{p.code}</span>
                </div>
                <div className="h-display" style={{ fontSize:24, lineHeight:1.1, color:'var(--ink)' }}>{p.name}</div>
              </div>
            </div>

            {/* keywords */}
            <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
              {p.keywords.map((k, i) => (
                <span key={i} style={{
                  fontSize:11, padding:'3px 9px', background:'#fff',
                  border:'1.2px solid var(--ink)', borderRadius:999, fontWeight:700,
                  color:'var(--ink)',
                }}>{k}</span>
              ))}
            </div>

            {/* summary */}
            <div style={{ marginTop:10, fontSize:12.5, lineHeight:1.6, color:'var(--ink)' }}>
              "{p.summary}"
            </div>

            {/* 6 dim mini-bars */}
            <div style={{ marginTop:10, display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:4 }}>
              {dimEntries.map(([letter, v], i) => {
                const ri = RIASEC[letter];
                const max = dimEntries[0]?.[1] || 1;
                const pct = Math.max(8, Math.round((v/max) * 100));
                return (
                  <div key={letter} style={{
                    background:'#fff', border:'1px solid var(--ink)', borderRadius:8,
                    padding:'5px 0 4px', textAlign:'center',
                  }}>
                    <div className="h-fra" style={{ fontSize:13, fontWeight:900, color:ri.c, lineHeight:1 }}>{letter}</div>
                    <div className="num-display" style={{ fontSize:11, color:'var(--ink)', fontWeight:800, marginTop:1 }}>{v}</div>
                    <div style={{ height:3, marginTop:3, marginInline:4, borderRadius:2, background:'var(--cream)', overflow:'hidden' }}>
                      <div style={{ width:pct + '%', height:'100%', background:ri.c }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 置信度小字 */}
            <div style={{ marginTop:8, fontSize:10, color:'var(--ink-soft)', display:'flex', alignItems:'center', gap:4 }}>
              <span>✦</span>{confText}
            </div>
          </div>
        </div>

        {/* 优先探索专业大类 */}
        <div style={{ marginTop:14 }}>
          <SectionLabel index="01" title="优先探索的专业大类" accent={p.c} />
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {(result.priorityMajors || []).slice(0,3).map((m, i) => m && (
              <div key={m.cat} onClick={() => onNav('majors')} style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'9px 12px', background:'var(--paper)',
                border:'1.6px solid var(--ink)', borderRadius:12, cursor:'pointer',
              }}>
                <span className="num-display" style={{ fontSize:16, color:p.c, fontWeight:900, width:20 }}>{['①','②','③'][i]}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13.5, fontWeight:800, color:'var(--ink)' }}>{m.cat}</div>
                  <div style={{ fontSize:10.5, color:'var(--ink-soft)', marginTop:1 }}>
                    {m.kw.slice(0,3).join(' · ')}
                  </div>
                </div>
                <div style={{ display:'flex', gap:2 }}>
                  {m.riasec.map(l => <RiasecBadge key={l} letter={l} size={16} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 热门职业出口 */}
        <div style={{ marginTop:12 }}>
          <SectionLabel index="02" title="热门职业出口" accent={p.c} />
          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
            {(p.careers || []).slice(0, 5).map((c, i) => (
              <span key={i} style={{
                padding:'5px 11px', background:'var(--paper)',
                border:'1.4px solid var(--ink)', borderRadius:999,
                fontSize:12, fontWeight:700, color:'var(--ink)',
              }}>{c}</span>
            ))}
          </div>
        </div>

        {/* 两周体验任务 */}
        <div style={{ marginTop:12, position:'relative' }}>
          <div style={{ position:'absolute', inset:0, background:'var(--ink)', borderRadius:14, transform:'translate(3px, 4px)' }} />
          <div style={{
            position:'relative', background:'#FEEFA8', border:'2px solid var(--ink)',
            borderRadius:14, padding:'10px 12px', display:'flex', gap:10,
          }}>
            <div style={{
              width:32, height:32, borderRadius:'50%', background:'var(--ink)', color:'#FEEFA8',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:16,
            }}>✓</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, fontWeight:800, color:'var(--ink-soft)', letterSpacing:'0.06em' }}>
                两周体验任务 · 2-WEEK QUEST
              </div>
              <div style={{ fontSize:12.5, lineHeight:1.5, color:'var(--ink)', marginTop:2 }}>{p.task}</div>
            </div>
          </div>
        </div>

        {/* "不要误解" caveat */}
        <div style={{
          marginTop:10, padding:'8px 12px',
          background:'transparent', border:'1.4px dashed var(--ink)', borderRadius:12,
          fontSize:11, lineHeight:1.55, color:'var(--ink-soft)',
        }}>
          <strong style={{ color:'var(--ink)' }}>不要误解：</strong>
          这反映的是当前兴趣倾向，不代表能力评价。最终选择还要结合成绩、选科、家庭条件和真实体验。
        </div>

        {/* CTA */}
        <div style={{ display:'flex', gap:10, marginTop:12, alignItems:'stretch' }}>
          <PrimaryButton style={{ flex:1 }} onClick={() => onNav('majors')}>
            <span style={{ flex:1, textAlign:'center' }}>查看完整专业报告</span>
          </PrimaryButton>
          <div onClick={() => onNav('share')} style={{ width:50, height:54, position:'relative', flexShrink:0, cursor:'pointer' }}>
            <div style={{ position:'absolute', inset:0, background:'var(--ink)', borderRadius:999, transform:'translate(3px, 4px)' }} />
            <div style={{
              position:'relative', width:'100%', height:'100%', borderRadius:999,
              background:'var(--paper)', border:'2px solid var(--ink)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                <circle cx="4" cy="11" r="3" stroke="var(--ink)" strokeWidth="1.8"/>
                <circle cx="16" cy="4" r="3" stroke="var(--ink)" strokeWidth="1.8"/>
                <circle cx="16" cy="18" r="3" stroke="var(--ink)" strokeWidth="1.8"/>
                <path d="M6.5 9.5l7-4M6.5 12.5l7 4" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div style={{ height:24 }} />
      </div>
      <HomeIndicator />
    </ScreenShell>
  );
}

// ────────────────────────────────────────────────────────────
// 6. MAJORS — 完整专业报告（优先 + 继续 + 出口 + 注意）
// ────────────────────────────────────────────────────────────
function ScreenMajors({ result = DEMO_RESULT, onNav = () => {} } = {}) {
  const p = result.persona || DEMO_PERSONA;
  const priority = (result.priorityMajors || []).filter(Boolean);
  const continueList = (result.continueMajors || []).filter(Boolean);
  return (
    <ScreenShell bg="var(--cream)">
      <div style={{ padding:'4px 16px 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <BackBtn onClick={() => onNav('back')} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:'var(--ink-faint)', letterSpacing:'0.08em' }}>YOUR FULL REPORT</div>
            <div style={{ fontSize:15, fontWeight:800 }}>完整专业探索报告</div>
          </div>
          <Pill size="s" color="var(--ink-soft)">2026 专业目录</Pill>
        </div>

        {/* 路径面包屑 */}
        <div style={{ position:'relative', marginBottom:10, padding:'9px 12px',
          background:'var(--paper)', border:'1.6px solid var(--ink)', borderRadius:14 }}>
          <div className="h-en" style={{ fontSize:12, color:'var(--ink-faint)', marginBottom:6 }}>your path</div>
          <div style={{ display:'flex', alignItems:'center', gap:5, flexWrap:'wrap' }}>
            <Chip color={p.c} filled>{p.name} {p.code}</Chip>
            <Arrow />
            <Chip color="var(--accent)">优先 {priority.length}</Chip>
            <Arrow />
            <Chip color="var(--ink)">继续 {continueList.length}</Chip>
          </div>
        </div>

        {/* 01 优先探索 */}
        <SectionLabel index="01" title="优先探索 · 适配度最高" accent={p.c} />
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:10 }}>
          {priority.map((m, i) => (
            <MajorRow key={m.cat} m={m} rank={i+1} tier="A" tierC={p.c} />
          ))}
        </div>

        {/* 02 继续了解 */}
        <SectionLabel index="02" title="可以继续了解 · 相关方向" accent="var(--accent)" />
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:10 }}>
          {continueList.map((m, i) => (
            <MajorRow key={m.cat} m={m} rank={i+4} tier="B" tierC="var(--accent)" />
          ))}
        </div>

        {/* 03 热门职业出口 */}
        <SectionLabel index="03" title="热门职业出口 · 你这类人格" accent="var(--green)" />
        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:12 }}>
          {p.careers.slice(0, 5).map((c, i) => (
            <span key={i} style={{
              padding:'5px 11px', background:'var(--paper)',
              border:'1.4px solid var(--ink)', borderRadius:999,
              fontSize:12, fontWeight:700, color:'var(--ink)',
              display:'inline-flex', alignItems:'center', gap:4,
            }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--green)' }} />
              {c}
            </span>
          ))}
        </div>

        {/* 注意事项（PRD 13.4）*/}
        <div style={{
          background:'transparent', border:'1.4px solid var(--ink)',
          borderRadius:14, padding:'9px 12px', display:'flex', gap:10, marginBottom:10,
        }}>
          <span style={{ fontSize:16 }}>📌</span>
          <div style={{ flex:1, fontSize:11, lineHeight:1.55, color:'var(--ink)' }}>
            <strong style={{ display:'block', fontWeight:800, marginBottom:2 }}>注意事项</strong>
            不同学校同名专业的<span style={{ color:p.c, fontWeight:700 }}>培养方向不同</span>。
            填报时需结合招生章程、课程设置、往年录取位次和省份志愿规则综合判断。
            <span style={{ color:'var(--ink-soft)' }}>试验班类（工科 / 理科 / 经管类等）属于"招生包"，请展开后再做匹配。</span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display:'flex', gap:8, marginBottom:24 }}>
          <PrimaryButton style={{ flex:1 }} onClick={() => onNav('poster')}>
            <span style={{ flex:1, textAlign:'center' }}>领取完整报告</span>
          </PrimaryButton>
          <div onClick={() => onNav('consult')} style={{ flex:1, position:'relative', cursor:'pointer' }}>
            <div style={{ position:'absolute', inset:0, background:'var(--ink)', borderRadius:999, transform:'translate(3px, 4px)' }} />
            <div style={{
              position:'relative', background:'var(--paper)',
              border:'2px solid var(--ink)', borderRadius:999,
              padding:'16px 0', textAlign:'center', fontWeight:800, fontSize:14, color:'var(--ink)',
            }}>预约 1v1 咨询</div>
          </div>
        </div>
      </div>
      <HomeIndicator />
    </ScreenShell>
  );
}

function MajorRow({ m, rank, tier, tierC }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:9,
      padding:'8px 11px', background:'var(--paper)',
      border:'1.4px solid var(--ink)', borderRadius:12,
    }}>
      <span className="num-display" style={{
        fontSize:11, color:'var(--ink-faint)', width:24, letterSpacing:'0.04em',
      }}>{String(rank).padStart(2,'0')}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
          <span style={{ fontSize:13.5, fontWeight:800, color:'var(--ink)' }}>{m.cat}</span>
          <span style={{ fontSize:10, color:'var(--ink-faint)' }}>{m.disc}</span>
        </div>
        <div style={{ fontSize:10.5, color:'var(--ink-soft)', marginTop:1 }}>
          {m.kw.slice(0,3).join(' · ')} → {m.exits[0]} 等
        </div>
      </div>
      <div style={{ display:'flex', gap:2 }}>
        {m.riasec.slice(0,3).map(l => <RiasecBadge key={l} letter={l} size={16} />)}
      </div>
      <span style={{
        width:26, height:22, borderRadius:6, border:`1.4px solid ${tierC}`,
        background: tier === 'A' ? tierC : 'var(--paper)',
        color: tier === 'A' ? '#fff' : tierC,
        fontSize:11, fontWeight:900,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>{tier}</span>
    </div>
  );
}

function Chip({ children, color, filled = false }) {
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', padding:'4px 10px',
      borderRadius:999, border:`1.4px solid ${color}`,
      background: filled ? color : 'transparent',
      color: filled ? '#fff' : color,
      fontSize:11, fontWeight:800, whiteSpace:'nowrap',
    }}>{children}</span>
  );
}

function Arrow() {
  return (
    <svg width="14" height="9" viewBox="0 0 18 10" fill="none">
      <path d="M1 5h15m0 0l-4-4m4 4l-4 4" stroke="var(--ink-soft)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// 7. LIBRARY — 16 张人格卡图鉴
// ────────────────────────────────────────────────────────────
function ScreenLibrary({ result = DEMO_RESULT, onNav = () => {} } = {}) {
  const youCode = result.persona?.code || 'I-C';
  // 模拟人群分布百分比（demo 数据）
  const pctMap = {
    'R-I':8,'R-A':6,'R-S':5,'R-E':6,'R-C':4,
    'I-A':6,'I-S':9,'I-E':7,'I-C':10,
    'A-S':7,'A-E':9,'A-C':4,
    'S-E':8,'S-C':5,'E-C':5,'多线':1,
  };
  return (
    <ScreenShell bg="var(--cream)">
      <Asterisk size={16} color="var(--primary)" style={{ position:'absolute', top:72, right:32 }} />
      <Star4 size={10} color="var(--accent)" style={{ position:'absolute', top:96, right:100 }} />

      <div style={{ padding:'4px 14px 0' }}>
        {/* top bar */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <BackBtn onClick={() => onNav('back')} />
          <div style={{ flex:1 }}>
            <div className="h-en" style={{ fontSize:14, color:'var(--primary)', lineHeight:1 }}>future cards · 图鉴</div>
            <div className="h-display" style={{ fontSize:17, color:'var(--ink)' }}>16 张未来专业人格卡</div>
          </div>
          <Pill size="s" color="var(--ink-soft)">
            <span className="num-display" style={{ color:'var(--primary)' }}>1</span>/16 已抽到
          </Pill>
        </div>

        {/* hint */}
        <div style={{
          padding:'7px 11px', marginBottom:10,
          background:'var(--paper)', border:'1.4px dashed var(--ink)', borderRadius:12,
          fontSize:11, color:'var(--ink-soft)', display:'flex', alignItems:'center', gap:6,
        }}>
          <span style={{ fontSize:14 }}>💡</span>
          <span>
            15 个 <span style={{ color:'var(--ink)', fontWeight:700 }}>RIASEC 双维组合</span>
            + 1 个<span style={{ color:'var(--primary-deep)', fontWeight:700 }}>多线探索</span>。
          </span>
        </div>

        {/* 4×4 grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:6 }}>
          {PERSONAS.map((p) => {
            const isYou = p.code === youCode;
            return (
              <div key={p.code}
                onClick={() => onNav(isYou ? 'result' : 'locked', { code: p.code })}
                style={{ position:'relative', cursor:'pointer' }}>
                {isYou && (
                  <div style={{ position:'absolute', inset:0, background:'var(--ink)', borderRadius:12, transform:'translate(3px, 4px)' }} />
                )}
                <div style={{
                  position:'relative', height:124, boxSizing:'border-box',
                  background: isYou ? p.bg : 'var(--paper)',
                  border: isYou ? '2px solid var(--ink)' : '1.4px solid rgba(42,34,24,0.25)',
                  borderRadius:12, padding:'9px 10px',
                  display:'flex', flexDirection:'column', justifyContent:'space-between',
                  overflow:'hidden',
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div style={{
                      width:26, height:26, borderRadius:7, background: isYou ? '#fff' : 'var(--cream)',
                      border:'1.4px solid var(--ink)',
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:15,
                    }}>{p.icon}</div>
                    <span className="h-fra" style={{ fontSize:10.5, color: isYou ? p.c : 'var(--ink-faint)', fontWeight:900, letterSpacing:'0.04em' }}>
                      {p.code}
                    </span>
                  </div>
                  <div>
                    <div className="h-display" style={{ fontSize:14.5, color:'var(--ink)', lineHeight:1.15 }}>
                      {p.name}
                      {isYou && <Sparkle size={10} color={p.c} style={{ marginLeft:4, verticalAlign:'top' }} />}
                    </div>
                    <div style={{ fontSize:9.5, color:'var(--ink-soft)', marginTop:2, lineHeight:1.4 }}>{p.keywords.slice(0,2).join(' · ')}</div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:4 }}>
                    <div style={{ display:'flex', gap:2 }}>
                      {p.code !== '多线' ? p.code.split('-').map(l => <RiasecBadge key={l} letter={l} size={13} />) :
                        <Pill size="s" color={p.c} bg={p.bg} border={false} style={{ padding:'1px 6px', fontSize:9 }}>MULTI</Pill>
                      }
                    </div>
                    <span className="num-display" style={{ fontSize:11, color:p.c, fontWeight:800 }}>{pctMap[p.code] || 5}%</span>
                  </div>
                  {isYou && (
                    <div style={{
                      position:'absolute', top:-7, right:9,
                      background:'var(--ink)', color:'var(--cream)',
                      padding:'2px 7px', borderRadius:999,
                      fontSize:9, fontWeight:800, letterSpacing:'0.1em',
                      transform:'rotate(4deg)',
                    }}>YOU ✦</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* footer */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10, padding:'8px 4px 24px' }}>
          <div style={{ fontSize:10.5, color:'var(--ink-soft)' }}>
            分布数据·demo · 实际版本以上线后口径为准
          </div>
          <div onClick={() => onNav('poster')} style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:800, color:'var(--primary)', cursor:'pointer' }}>
            邀请朋友抽卡 →
          </div>
        </div>
      </div>
      <HomeIndicator />
    </ScreenShell>
  );
}

// ────────────────────────────────────────────────────────────
// 8. POSTER — 分享海报（PRD 11）
// ────────────────────────────────────────────────────────────
function ScreenPoster({ result = DEMO_RESULT, onNav = () => {} } = {}) {
  const p = result.persona || DEMO_PERSONA;
  const [saved, setSaved]   = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const majors  = (result.priorityMajors || []).filter(Boolean).slice(0, 3);
  const careers = (p.careers || []).slice(0, 3);

  return (
    <ScreenShell bg="#1A1610" statusBarDark={true}>
      <div style={{ position:'absolute', inset:0, background:
        'radial-gradient(ellipse 60% 42% at 50% 36%, rgba(233,107,60,0.32) 0%, transparent 60%),'
        + 'radial-gradient(ellipse 55% 30% at 50% 92%, rgba(74,111,165,0.22) 0%, transparent 70%)',
        pointerEvents:'none' }} />
      {[[36,96,7],[338,110,8],[22,720,9],[350,700,7],[200,740,6]].map(([x,y,s],i)=>(
        <Star4 key={i} size={s} color="rgba(244,200,74,0.55)" style={{ position:'absolute', top:y, left:x }} />
      ))}

      <div style={{ position:'relative', padding:'4px 14px 0', height:'100%', boxSizing:'border-box', color:'var(--cream)', display:'flex', flexDirection:'column' }}>
        {/* top close bar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'2px 4px', marginBottom:4 }}>
          <div onClick={() => onNav('back')} style={{
            width:30, height:30, borderRadius:999, background:'rgba(255,255,255,0.10)',
            border:'1px solid rgba(255,255,255,0.18)',
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
            color:'#fff', fontSize:20, fontWeight:300, lineHeight:1,
          }}>×</div>
          <span className="h-en" style={{ fontSize:15, color:'rgba(255,255,255,0.62)' }}>save &amp; share</span>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', color:'rgba(255,255,255,0.42)' }}>09 / 09</span>
        </div>

        {/* POSTER CARD */}
        <div style={{ position:'relative', margin:'6px 0 0' }}>
          <div style={{ position:'absolute', inset:0, background:'#0A0703', borderRadius:22, transform:'translate(5px, 8px)' }} />
          <div className="paper-grain" style={{
            position:'relative', borderRadius:22, overflow:'hidden',
            background:'var(--cream)', border:'2px solid var(--ink)',
            padding:'13px 14px 11px',
          }}>
            <Star4    size={11} color={p.c}            style={{ position:'absolute', top:50,  right:116 }} />
            <Sparkle  size={18} color="var(--primary)" style={{ position:'absolute', top:78,  right:14,  transform:'rotate(14deg)' }} />
            <Asterisk size={12} color="var(--green)"   style={{ position:'absolute', top:152, left:6 }} />
            <Star4    size={9}  color="var(--pink)"    style={{ position:'absolute', top:38,  left:110 }} />
            <Squiggle width={36} height={9} color="var(--accent)" strokeWidth={2.2} style={{ position:'absolute', top:168, right:16, transform:'rotate(-10deg)' }} />

            {/* HEADER */}
            <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <Pill size="s" color="var(--ink)">未来专业人格卡</Pill>
              <span className="num-display" style={{ fontSize:11, color:'var(--ink-faint)', letterSpacing:'0.08em', fontWeight:800 }}>NO.{p.code === '多线' ? '16' : String(PERSONAS.findIndex(x => x.code === p.code) + 1).padStart(2,'0')} / 16</span>
            </div>

            {/* HERO row */}
            <div style={{ position:'relative', marginTop:10, display:'flex', alignItems:'flex-start', gap:10 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div className="h-en" style={{
                  fontSize:16, color:p.c, display:'inline-block',
                  transform:'rotate(-3deg)', lineHeight:1, marginLeft:2, marginBottom:6, fontWeight:700,
                }}>I am · {p.en}</div>
                <div className="h-display" style={{ fontSize:30, lineHeight:1.02, color:'var(--ink)', letterSpacing:'-0.02em' }}>{p.name.slice(0,2)}</div>
                <div style={{ marginTop:2 }}>
                  <MarkerBlob color={p.bg} tilt={-2}>
                    <span className="h-display" style={{ fontSize:30, lineHeight:1.02, color:p.c, letterSpacing:'-0.02em' }}>
                      {p.name.slice(2)}
                    </span>
                  </MarkerBlob>
                </div>
                <Underline width={120} height={11} color={p.c} sw={2.6} style={{ marginTop:2, marginLeft:-2 }} />

                {/* RIASEC code badges */}
                <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:8 }}>
                  {p.code !== '多线' ? p.code.split('-').map((l, i) => (
                    <React.Fragment key={l}>
                      {i > 0 && <span style={{ color:'var(--ink-faint)', fontWeight:800 }}>·</span>}
                      <RiasecBadge letter={l} size={22} />
                    </React.Fragment>
                  )) : <Pill size="s" color={p.c}>MULTI</Pill>}
                  <span className="h-en" style={{ fontSize:13, color:'var(--ink-soft)', marginLeft:4, fontWeight:700 }}>{p.code}</span>
                </div>
              </div>

              {/* character block */}
              <div style={{ position:'relative', width:96, flexShrink:0, marginTop:4 }}>
                <div style={{ position:'absolute', inset:0, background:'var(--ink)', borderRadius:14, transform:'translate(3px, 4px)' }} />
                <div style={{
                  position:'relative', height:112,
                  background: p.bg,
                  border:'2px solid var(--ink)', borderRadius:14,
                  display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column',
                  overflow:'hidden',
                }}>
                  <div style={{ position:'absolute', inset:6, borderRadius:10, border:'1.2px dashed rgba(42,34,24,0.35)' }} />
                  <div style={{ fontSize:50, lineHeight:1, position:'relative' }}>{p.icon}</div>
                  <div className="h-en" style={{ fontSize:9.5, color:p.c, marginTop:4, position:'relative', fontWeight:700, letterSpacing:'0.06em' }}>{p.en.toUpperCase()}</div>
                </div>
                <div style={{
                  position:'absolute', top:-10, left:-14,
                  background:'var(--ink)', color:'var(--cream)',
                  fontSize:9, fontWeight:800, letterSpacing:'0.14em',
                  padding:'3px 9px', borderRadius:999, transform:'rotate(-12deg)',
                }}>YOU ✦</div>
              </div>
            </div>

            {/* KEYWORDS */}
            <div style={{ display:'flex', justifyContent:'center', gap:0, marginTop:10 }}>
              {p.keywords.map((k, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ color:'var(--ink-faint)', margin:'0 7px', fontWeight:700 }}>｜</span>}
                  <span style={{ fontSize:12, fontWeight:800, color:'var(--ink)' }}>{k}</span>
                </React.Fragment>
              ))}
            </div>

            {/* SUMMARY */}
            <div style={{ position:'relative', marginTop:8, padding:'7px 11px 7px 12px', borderLeft:`3px solid ${p.c}` }}>
              <div style={{ fontSize:11.5, lineHeight:1.55, color:'var(--ink)' }}>
                "{p.summary}"
              </div>
            </div>

            {/* MAJORS row (3 only, PRD 11.1) */}
            <div style={{ marginTop:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
                <span style={{ height:1, width:14, background:'var(--ink-faint)' }} />
                <span style={{ fontSize:10, fontWeight:800, color:'var(--ink-soft)', letterSpacing:'0.16em' }}>优先探索专业大类</span>
                <span style={{ flex:1, height:1, background:'var(--ink-faint)' }} />
              </div>
              <div style={{ display:'flex', gap:4 }}>
                {majors.map((m, i) => (
                  <div key={i} style={{
                    flex:1, background:'var(--paper)', border:'1.4px solid var(--ink)', borderRadius:10,
                    padding:'6px 4px', textAlign:'center', minWidth:0,
                  }}>
                    <div style={{ fontSize:11, fontWeight:800, color:'var(--ink)' }}>{m.cat}</div>
                    <div style={{ fontSize:9, color:'var(--ink-soft)', marginTop:2 }}>{m.kw[0]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CAREERS row (3 only) */}
            <div style={{ marginTop:9 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
                <span style={{ height:1, width:14, background:'var(--ink-faint)' }} />
                <span style={{ fontSize:10, fontWeight:800, color:'var(--ink-soft)', letterSpacing:'0.16em' }}>热门职业出口</span>
                <span style={{ flex:1, height:1, background:'var(--ink-faint)' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'center', gap:0, fontSize:11.5, fontWeight:700, color:'var(--ink)' }}>
                {careers.map((c, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span style={{ color:'var(--ink-faint)', margin:'0 5px' }}>｜</span>}
                    {c}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* FOOTER QR */}
            <div style={{ marginTop:11, paddingTop:9, borderTop:'1.4px dashed rgba(42,34,24,0.35)',
              display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:50, height:50, flexShrink:0,
                background:'#fff', border:'1.4px solid var(--ink)', borderRadius:8,
                display:'grid', gridTemplateColumns:'repeat(8, 1fr)', gap:1, padding:3, boxSizing:'border-box' }}>
                {Array.from({ length:64 }).map((_, i) => {
                  const row = Math.floor(i/8), col = i%8;
                  const isCorner = (row<2 && col<2) || (row<2 && col>5) || (row>5 && col<2);
                  const seed = (i*13 + 7) % 11;
                  return <div key={i} style={{ background: isCorner || seed < 5 ? 'var(--ink)' : 'transparent' }} />;
                })}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div className="h-display" style={{ fontSize:13, color:'var(--ink)', lineHeight:1.2 }}>测测你是哪种未来专业人格</div>
                <div style={{ fontSize:10, color:'var(--ink-soft)', marginTop:2 }}>18 道大学场景题 · 3 分钟生成你的卡</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div className="h-display" style={{ fontSize:13, color:'var(--ink)', lineHeight:1, letterSpacing:'-0.01em' }}>未来专业人格卡</div>
                <div className="h-en" style={{ fontSize:10, color:'var(--ink-faint)', marginTop:2, letterSpacing:'0.04em' }}>major-card.cn</div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION SHEET */}
        <div style={{ marginTop:'auto', marginBottom:40 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginBottom:7 }}>
            <span style={{ height:1, width:24, background:'rgba(255,255,255,0.25)' }} />
            <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.55)', letterSpacing:'0.18em' }}>SHARE</span>
            <span style={{ height:1, width:24, background:'rgba(255,255,255,0.25)' }} />
          </div>
          <div style={{
            display:'flex', gap:8, padding:8,
            background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.14)',
            backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
            borderRadius:16,
          }}>
            <ActionBtn icon="⬇" label={saved ? '已保存到相册' : '保存图片'} primary
              onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800); }}
              highlighted={saved} />
            <ActionBtn icon="🔗" label={copied ? '链接已复制' : '复制链接'}
              onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }}
              highlighted={copied} />
            <ActionBtn icon="✉" label="发给朋友" onClick={() => {}} />
          </div>
        </div>
      </div>
      <HomeIndicator dark={true} />
    </ScreenShell>
  );
}

function ActionBtn({ icon, label, onClick, primary = false, highlighted = false }) {
  return (
    <div onClick={onClick} style={{
      flex:1, cursor:'pointer',
      display:'flex', flexDirection:'column', alignItems:'center', gap:3,
      padding:'8px 4px', borderRadius:12,
      background: highlighted ? 'var(--primary)' : (primary ? 'rgba(233,107,60,0.18)' : 'rgba(255,255,255,0.04)'),
      border: highlighted ? '1px solid var(--primary)' : (primary ? '1px solid rgba(233,107,60,0.6)' : '1px solid rgba(255,255,255,0.08)'),
      color: highlighted ? '#fff' : 'var(--cream)', transition:'all 0.18s',
    }}>
      <span style={{ fontSize:18 }}>{icon}</span>
      <span style={{ fontSize:11, fontWeight:700 }}>{label}</span>
    </div>
  );
}

Object.assign(window, {
  ScreenLanding, ScreenIntro, ScreenQuiz, ScreenGenerating,
  ScreenResult, ScreenMajors, ScreenLibrary, ScreenPoster,
  DEMO_RESULT,
});
