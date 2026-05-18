// app.jsx — root: switches between Canvas mode (all artboards) and Prototype mode (live flow).

const { DesignCanvas, DCSection, DCArtboard } = window;
const { IOSDevice } = window;
const { TweaksPanel, useTweaks, TweakSection } = window;
const { QUIZ_BANK, PERSONAS, scoreAll } = window;
const { ScreenLanding, ScreenIntro, ScreenQuiz, ScreenGenerating,
        ScreenResult, ScreenMajors, ScreenLibrary, ScreenPoster, DEMO_RESULT } = window;

// ──────────────────────────────────────────────────────────
// Theme palettes for the Tweaks color swatches
// ──────────────────────────────────────────────────────────
const THEMES = {
  '暖橙奶油': { bg:'#E9DCC3', cream:'#F4E9D2', paper:'#FBF4E0', ink:'#2A2218', inkSoft:'#7A6A52', inkFaint:'#B5A687', primary:'#E96B3C', primaryDeep:'#C24A1F', primarySoft:'#FBD8C5', accent:'#4A6FA5', green:'#6B8E4E', pink:'#E89BAA', yellow:'#F4C84A' },
  '科技蓝':   { bg:'#D9E1EC', cream:'#EDF1F7', paper:'#F8FAFD', ink:'#1A2235', inkSoft:'#5A6680', inkFaint:'#9AA4BC', primary:'#2E5BE5', primaryDeep:'#1A3FB0', primarySoft:'#C9D7FA', accent:'#E96B3C', green:'#1F8A5B', pink:'#E89BAA', yellow:'#F4C84A' },
  '校园粉':   { bg:'#F2D8DC', cream:'#FBEAEC', paper:'#FFF5F6', ink:'#3A2230', inkSoft:'#806272', inkFaint:'#C5A0AE', primary:'#E2547A', primaryDeep:'#A82F58', primarySoft:'#FBD3DE', accent:'#7A5BA1', green:'#6B8E4E', pink:'#E89BAA', yellow:'#F4C84A' },
  '森野绿':   { bg:'#D9E2CC', cream:'#ECF1DF', paper:'#F6F9EB', ink:'#1F2A1A', inkSoft:'#5D6B4A', inkFaint:'#A0AC8C', primary:'#3F8E4A', primaryDeep:'#246030', primarySoft:'#CDE5C8', accent:'#C84A1F', green:'#6B8E4E', pink:'#E89BAA', yellow:'#F4C84A' },
};
function applyTheme(name) {
  const p = THEMES[name]; if (!p) return;
  const r = document.documentElement.style;
  Object.entries({
    '--bg': p.bg, '--cream': p.cream, '--paper': p.paper, '--ink': p.ink,
    '--ink-soft': p.inkSoft, '--ink-faint': p.inkFaint,
    '--primary': p.primary, '--primary-deep': p.primaryDeep, '--primary-soft': p.primarySoft,
    '--accent': p.accent, '--green': p.green, '--pink': p.pink, '--yellow': p.yellow,
  }).forEach(([k, v]) => r.setProperty(k, v));
}

function ThemeSwatchPicker({ themes, value, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {themes.map((th) => {
        const selected = th.name === value;
        return (
          <button key={th.name} onClick={() => onChange(th.name)}
            style={{
              background: '#fff', border: selected ? '2px solid #111' : '1.5px solid #d4d4d4',
              borderRadius: 12, padding: '10px 10px 8px', cursor: 'pointer', textAlign: 'left',
              fontFamily: 'inherit', position: 'relative',
              boxShadow: selected ? '0 4px 14px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s',
            }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              <div style={{ width: 32, height: 36, borderRadius: 6, background: th.colors[0] }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                <div style={{ height: 16, borderRadius: 4, background: th.colors[1], border: '1px solid rgba(0,0,0,0.08)' }} />
                <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                  <div style={{ flex: 1, borderRadius: 4, background: th.colors[2] }} />
                  <div style={{ flex: 1, borderRadius: 4, background: th.colors[3] }} />
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {th.name}{selected && <span style={{ fontSize: 10, color: '#666' }}>✓</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// PrototypePlayer — the live, clickable flow on a single iPhone
// ──────────────────────────────────────────────────────────
function PrototypePlayer({ onExit }) {
  const total = QUIZ_BANK.length;
  const [screen, setScreen]   = React.useState('landing');     // landing|intro|quiz|generating|result|majors|library|poster
  const [qIndex, setQIndex]   = React.useState(0);
  const [answers, setAnswers] = React.useState([]);            // [{ qIndex, first, second }]
  const [history, setHistory] = React.useState([]);

  // Compute the live result whenever we hit the result family of screens
  const liveResult = React.useMemo(() => {
    if (!answers.length) return DEMO_RESULT;
    try { return scoreAll(answers); } catch { return DEMO_RESULT; }
  }, [answers]);

  // Current question's pick state
  const curAnswer = answers.find(a => a.qIndex === qIndex);
  const first  = curAnswer?.first  ?? null;
  const second = curAnswer?.second ?? null;

  const goto = (next, opts = {}) => {
    setHistory((h) => [...h, screen]);
    setScreen(next);
    if (opts.qIndex != null) setQIndex(opts.qIndex);
  };
  const back = () => {
    setHistory((h) => {
      const copy = [...h];
      const prev = copy.pop();
      if (prev) setScreen(prev);
      return copy;
    });
  };
  const reset = () => {
    setScreen('landing'); setQIndex(0); setAnswers([]); setHistory([]);
  };

  // Helper: update current question's first/second
  const updateAnswer = (updates) => {
    setAnswers((prev) => {
      const filtered = prev.filter(a => a.qIndex !== qIndex);
      const cur = prev.find(a => a.qIndex === qIndex) || { qIndex, first:null, second:null };
      return [...filtered, { ...cur, ...updates }];
    });
  };

  // Per-screen navigation handlers
  const onNav = (target, payload = {}) => {
    if (screen === 'landing') {
      if (target === 'start') goto('intro');
    }
    else if (screen === 'intro') {
      if (target === 'start') goto('quiz', { qIndex: 0 });
      else if (target === 'back') back();
    }
    else if (screen === 'quiz') {
      if (target === 'pick') {
        const L = payload.letter;
        // Toggle / pick logic for 最想 + 第二想
        if (first === L) {
          // tapped current first → unset (and promote second to first? simpler: just clear first)
          updateAnswer({ first: second, second: null });
        } else if (second === L) {
          updateAnswer({ second: null });
        } else if (!first) {
          updateAnswer({ first: L });
        } else if (!second) {
          updateAnswer({ second: L });
          // auto advance after a brief beat
          setTimeout(() => {
            if (qIndex >= total - 1) {
              setHistory(h => [...h, 'quiz']); setScreen('generating');
            } else setQIndex(qIndex + 1);
          }, 480);
        } else {
          // both filled — replace first, push old first to second? Simplest: reset to L
          updateAnswer({ first: L, second: null });
        }
      } else if (target === 'next') {
        if (first && second) {
          if (qIndex >= total - 1) { setHistory(h => [...h, 'quiz']); setScreen('generating'); }
          else setQIndex(qIndex + 1);
        }
      } else if (target === 'back') {
        if (qIndex === 0) setScreen('intro');
        else setQIndex(qIndex - 1);
      }
    }
    else if (screen === 'generating') {
      if (target === 'done') goto('result');
    }
    else if (screen === 'result') {
      if (target === 'share' || target === 'poster')   goto('poster');
      else if (target === 'majors')                     goto('majors');
      else if (target === 'library')                    goto('library');
      else if (target === 'back')                       reset();
    }
    else if (screen === 'majors') {
      if      (target === 'poster')   goto('poster');
      else if (target === 'consult')  alert('已为你预约 1v1 咨询 · 我们会在 24h 内联系');
      else if (target === 'back')     back();
    }
    else if (screen === 'library') {
      if      (target === 'result')   goto('result');
      else if (target === 'poster')   goto('poster');
      else if (target === 'locked')   { /* could show a locked-toast */ }
      else if (target === 'back')     back();
    }
    else if (screen === 'poster') {
      if (target === 'back') back();
    }
  };

  // Header step label
  const stepLabel = {
    landing:    ['STEP 1 / 8', '首页 · 准备开始'],
    intro:      ['STEP 2 / 8', '题前说明'],
    quiz:       ['STEP 3 / 8', `答题中 · 第 ${qIndex + 1} / ${total} 题`],
    generating: ['STEP 4 / 8', '正在生成你的人格卡 …'],
    result:     ['STEP 5 / 8', `结果 · ${liveResult.persona?.name || '未来专业人格卡'}`],
    majors:     ['STEP 6 / 8', '完整专业报告'],
    library:    ['STEP 7 / 8', '16 张人格卡图鉴'],
    poster:     ['STEP 8 / 8', '分享海报'],
  }[screen];

  // Quiz progress %: first selected = +0.5q, second selected = +1q
  const quizPct = first || second
    ? Math.round(((qIndex + (second ? 1 : 0.5)) / total) * 100)
    : Math.round((qIndex / total) * 100);

  // Render the current screen
  const renderScreen = () => {
    const quizState = {
      qIndex, first, second,
      answeredCount: answers.filter(a => a.first && a.second).length,
    };
    switch (screen) {
      case 'landing':    return <ScreenLanding    onNav={onNav}/>;
      case 'intro':      return <ScreenIntro      onNav={onNav}/>;
      case 'quiz':       return <ScreenQuiz       state={quizState}                  onNav={onNav}/>;
      case 'generating': return <ScreenGenerating live={true}                        onNav={onNav}/>;
      case 'result':     return <ScreenResult     result={liveResult}                onNav={onNav}/>;
      case 'majors':     return <ScreenMajors     result={liveResult}                onNav={onNav}/>;
      case 'library':    return <ScreenLibrary    result={liveResult}                onNav={onNav}/>;
      case 'poster':     return <ScreenPoster     result={liveResult}                onNav={onNav}/>;
      default:           return <ScreenLanding onNav={onNav}/>;
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(circle at 50% 0%, rgba(233,107,60,0.10), transparent 70%), var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      overflow: 'hidden',
    }}>
      {/* top bar */}
      <div style={{
        width: '100%', padding: '16px 24px', boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', gap: 14,
        background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(42,34,24,0.08)',
        zIndex: 20,
      }}>
        <button onClick={onExit} style={{
          background: 'var(--ink)', color: 'var(--cream)', border: 'none',
          padding: '8px 14px', borderRadius: 999, fontFamily: 'inherit',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: 14 }}>🖼️</span>
          画布视图
        </button>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="h-en" style={{ fontSize: 16, color: 'var(--primary)', letterSpacing: '0.04em' }}>
            {stepLabel[0]}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{stepLabel[1]}</span>
          {screen === 'quiz' && (
            <div style={{ flex: 1, maxWidth: 240, marginLeft: 8, height: 6, background: 'var(--paper)', border: '1px solid var(--ink)', borderRadius: 999, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${quizPct}%`, background: 'var(--primary)', transition: 'width 0.3s' }} />
            </div>
          )}
        </div>

        <QuickJump screen={screen} onJump={(s) => { setHistory(h => [...h, screen]); setScreen(s); }} />

        <button onClick={reset} style={{
          background: 'transparent', color: 'var(--ink-soft)', border: '1.4px solid var(--ink-soft)',
          padding: '7px 13px', borderRadius: 999, fontFamily: 'inherit',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span>↺</span> 重置
        </button>
      </div>

      {/* phone center stage */}
      <PhoneStage>
        <IOSDevice width={390} height={844}>
          {renderScreen()}
        </IOSDevice>
      </PhoneStage>
    </div>
  );
}

// Auto-scales the phone to fit available height/width inside its parent.
function PhoneStage({ children }) {
  const wrapRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const recalc = () => {
      const el = wrapRef.current; if (!el) return;
      const availH = el.clientHeight - 40;
      const availW = el.clientWidth  - 40;
      setScale(Math.min(1, availH / 844, availW / 390));
    };
    recalc();
    const ro = new ResizeObserver(recalc); if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', recalc);
    return () => { window.removeEventListener('resize', recalc); ro.disconnect(); };
  }, []);
  return (
    <div ref={wrapRef} style={{
      flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden', boxSizing: 'border-box',
    }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center', flexShrink: 0 }}>
        {children}
      </div>
      <div style={{
        position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
        fontSize: 11, color: 'var(--ink-soft)',
        background: 'rgba(255,255,255,0.7)', padding: '5px 12px', borderRadius: 999,
        backdropFilter: 'blur(8px)', whiteSpace: 'nowrap',
      }}>
        点击屏幕中的按钮、选项、卡片来推进流程 · 真机体验
      </div>
    </div>
  );
}

function QuickJump({ screen, onJump }) {
  const [open, setOpen] = React.useState(false);
  const items = [
    ['landing',    '01 首页'],
    ['intro',      '02 题前说明'],
    ['quiz',       '03 答题'],
    ['generating', '04 生成'],
    ['result',     '05 结果'],
    ['majors',     '06 专业报告'],
    ['library',    '07 16 张图鉴'],
    ['poster',     '08 分享海报'],
  ];
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        background: 'rgba(42,34,24,0.06)', color: 'var(--ink)', border: '1.4px solid rgba(42,34,24,0.15)',
        padding: '7px 13px', borderRadius: 999, fontFamily: 'inherit',
        fontSize: 13, fontWeight: 700, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>跳转 ▾</button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: '#fff', border: '1px solid rgba(42,34,24,0.18)',
          borderRadius: 12, padding: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column', minWidth: 150, zIndex: 50,
        }}>
          {items.map(([k, lbl]) => (
            <div key={k} onClick={() => { setOpen(false); onJump(k); }} style={{
              padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
              background: screen === k ? 'rgba(233,107,60,0.12)' : 'transparent',
              color: screen === k ? 'var(--primary-deep)' : 'var(--ink)',
              fontSize: 13, fontWeight: 600,
            }}>{lbl}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Canvas mode — all 9 static artboards side by side
// ──────────────────────────────────────────────────────────
function CanvasMode({ onEnter }) {
  const PhoneW = 390, PhoneH = 844;
  const artW = PhoneW + 24, artH = PhoneH + 24;
  const frame = (kid) => (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IOSDevice width={PhoneW} height={PhoneH}>{kid}</IOSDevice>
    </div>
  );
  // demo quiz state showing Q3 with both picks made (for static preview)
  const quizDemo = { qIndex: 2, first: 'I', second: 'C', answeredCount: 2 };

  return (
    <React.Fragment>
      <DesignCanvas>
        <DCSection id="flow" title="未来专业人格卡 H5 · 全流程" subtitle="9 屏高保真稿 · PRD v1.1 · 暖橙奶油 + 手绘插画 · 点击右上角进入真机体验">
          <DCArtboard id="01-landing"    label="01 · 首页"                width={artW} height={artH}>{frame(<ScreenLanding/>)}</DCArtboard>
          <DCArtboard id="02-intro"      label="02 · 题前说明"             width={artW} height={artH}>{frame(<ScreenIntro/>)}</DCArtboard>
          <DCArtboard id="03-quiz"       label="03 · 答题 · 最想 + 第二想"  width={artW} height={artH}>{frame(<ScreenQuiz state={quizDemo}/>)}</DCArtboard>
          <DCArtboard id="04-generating" label="04 · 生成动画"             width={artW} height={artH}>{frame(<ScreenGenerating live={false}/>)}</DCArtboard>
          <DCArtboard id="05-result"     label="05 · 结果 · 数据侦探 I-C"   width={artW} height={artH}>{frame(<ScreenResult/>)}</DCArtboard>
          <DCArtboard id="06-majors"     label="06 · 完整专业报告"          width={artW} height={artH}>{frame(<ScreenMajors/>)}</DCArtboard>
          <DCArtboard id="07-library"    label="07 · 16 张人格卡图鉴"       width={artW} height={artH}>{frame(<ScreenLibrary/>)}</DCArtboard>
          <DCArtboard id="08-poster"     label="08 · 分享海报"             width={artW} height={artH}>{frame(<ScreenPoster/>)}</DCArtboard>
        </DCSection>
      </DesignCanvas>

      <button onClick={onEnter} style={{
        position: 'fixed', top: 18, right: 24, zIndex: 100,
        background: 'var(--primary)', color: '#fff', border: '2px solid var(--ink)',
        padding: '10px 18px', borderRadius: 999, fontFamily: 'inherit',
        fontSize: 14, fontWeight: 800, cursor: 'pointer',
        boxShadow: '3px 4px 0 var(--ink)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ fontSize: 16 }}>▶</span>
        走完整流程
      </button>
    </React.Fragment>
  );
}

// ──────────────────────────────────────────────────────────
// App root
// ──────────────────────────────────────────────────────────
function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "theme": "暖橙奶油",
    "defaultMode": "prototype"
  }/*EDITMODE-END*/;
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [mode, setMode] = React.useState(t.defaultMode || 'canvas');

  React.useEffect(() => { applyTheme(t.theme); }, [t.theme]);

  return (
    <React.Fragment>
      {mode === 'canvas'
        ? <CanvasMode onEnter={() => setMode('prototype')} />
        : <PrototypePlayer onExit={() => setMode('canvas')} />}

      <TweaksPanel title="设计调节">
        <TweakSection title="主题色系">
          <ThemeSwatchPicker
            themes={[
              { name: '暖橙奶油', colors: ['#E96B3C', '#F4E9D2', '#4A6FA5', '#6B8E4E'] },
              { name: '科技蓝',   colors: ['#2E5BE5', '#EDF1F7', '#E96B3C', '#1F8A5B'] },
              { name: '校园粉',   colors: ['#E2547A', '#FBEAEC', '#7A5BA1', '#F4C84A'] },
              { name: '森野绿',   colors: ['#3F8E4A', '#ECF1DF', '#C84A1F', '#F4C84A'] },
            ]}
            value={t.theme}
            onChange={(v) => setTweak('theme', v)}
          />
        </TweakSection>
        <TweakSection title="查看模式">
          <div style={{ display: 'flex', gap: 6 }}>
            {[['canvas', '画布架构'], ['prototype', '真机体验']].map(([k, label]) => (
              <button key={k} onClick={() => setMode(k)} style={{
                flex: 1, padding: '10px 6px', borderRadius: 10,
                border: mode === k ? '2px solid #111' : '1.5px solid #d4d4d4',
                background: mode === k ? '#f6f0e2' : '#fff',
                fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>{label}</button>
            ))}
          </div>
          <div style={{ marginTop: 6, fontSize: 10.5, color: '#888', lineHeight: 1.5 }}>
            画布：9 屏并排展示 · 真机：单台 iPhone 跑完整 PRD 流程
          </div>
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
