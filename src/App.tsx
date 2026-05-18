// App.tsx — 屏幕状态机：landing → intro → quiz → generating → result → majors → library → poster
import { useMemo, useState } from 'react';
import { QUIZ_BANK, type Letter } from './data/quiz';
import { scoreAll, DEMO_RESULT, type Answer } from './lib/score';
import type { NavPayload } from './screens/nav';
import ScreenLanding from './screens/ScreenLanding';
import ScreenIntro from './screens/ScreenIntro';
import ScreenQuiz, { type QuizState } from './screens/ScreenQuiz';
import ScreenGenerating from './screens/ScreenGenerating';
import ScreenResult from './screens/ScreenResult';
import ScreenMajors from './screens/ScreenMajors';
import ScreenLibrary from './screens/ScreenLibrary';
import ScreenPoster from './screens/ScreenPoster';

type Screen =
  | 'landing' | 'intro' | 'quiz' | 'generating'
  | 'result' | 'majors' | 'library' | 'poster';

const TOTAL = QUIZ_BANK.length;

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [, setHistory] = useState<Screen[]>([]);

  // 答完才计算；未答时用演示结果
  const liveResult = useMemo(() => {
    if (!answers.length) return DEMO_RESULT;
    try { return scoreAll(answers); } catch { return DEMO_RESULT; }
  }, [answers]);

  const curAnswer = answers.find((a) => a.qIndex === qIndex);
  const first = curAnswer?.first ?? null;
  const second = curAnswer?.second ?? null;

  const goto = (next: Screen) => {
    setHistory((h) => [...h, screen]);
    setScreen(next);
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

  const updateAnswer = (updates: Partial<Answer>) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.qIndex !== qIndex);
      const cur = prev.find((a) => a.qIndex === qIndex) ?? { qIndex, first: null, second: null };
      return [...filtered, { ...cur, ...updates }];
    });
  };

  const onNav = (target: string, payload: NavPayload = {}) => {
    if (screen === 'landing') {
      if (target === 'start') goto('intro');
    } else if (screen === 'intro') {
      if (target === 'start') { setQIndex(0); goto('quiz'); }
      else if (target === 'back') back();
    } else if (screen === 'quiz') {
      if (target === 'pick') {
        const L = payload.letter as Letter;
        if (first === L) {
          updateAnswer({ first: second, second: null });
        } else if (second === L) {
          updateAnswer({ second: null });
        } else if (!first) {
          updateAnswer({ first: L });
        } else if (!second) {
          updateAnswer({ second: L });
          setTimeout(() => {
            if (qIndex >= TOTAL - 1) { setHistory((h) => [...h, 'quiz']); setScreen('generating'); }
            else setQIndex(qIndex + 1);
          }, 480);
        } else {
          updateAnswer({ first: L, second: null });
        }
      } else if (target === 'next') {
        if (first && second) {
          if (qIndex >= TOTAL - 1) { setHistory((h) => [...h, 'quiz']); setScreen('generating'); }
          else setQIndex(qIndex + 1);
        }
      } else if (target === 'back') {
        if (qIndex === 0) setScreen('intro');
        else setQIndex(qIndex - 1);
      }
    } else if (screen === 'generating') {
      if (target === 'done') goto('result');
    } else if (screen === 'result') {
      if (target === 'share' || target === 'poster') goto('poster');
      else if (target === 'majors') goto('majors');
      else if (target === 'library') goto('library');
      else if (target === 'restart' || target === 'back') reset();
    } else if (screen === 'majors') {
      if (target === 'poster') goto('poster');
      else if (target === 'consult') alert('已收到你的咨询意向 · 我们会在 24h 内联系你');
      else if (target === 'back') back();
    } else if (screen === 'library') {
      if (target === 'result') goto('result');
      else if (target === 'poster') goto('poster');
      else if (target === 'back') back();
      // 'locked'：未抽到的卡，暂不处理
    } else if (screen === 'poster') {
      if (target === 'restart') reset();
      else if (target === 'back') back();
    }
  };

  const quizState: QuizState = {
    qIndex, first, second,
    answeredCount: answers.filter((a) => a.first && a.second).length,
  };

  const renderScreen = () => {
    switch (screen) {
      case 'landing': return <ScreenLanding onNav={onNav} />;
      case 'intro': return <ScreenIntro onNav={onNav} />;
      case 'quiz': return <ScreenQuiz state={quizState} onNav={onNav} />;
      case 'generating': return <ScreenGenerating live onNav={onNav} />;
      case 'result': return <ScreenResult result={liveResult} onNav={onNav} />;
      case 'majors': return <ScreenMajors result={liveResult} onNav={onNav} />;
      case 'library': return <ScreenLibrary result={liveResult} onNav={onNav} />;
      case 'poster': return <ScreenPoster result={liveResult} onNav={onNav} />;
      default: return <ScreenLanding onNav={onNav} />;
    }
  };

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--bg)',
      display: 'flex', justifyContent: 'center', alignItems: 'stretch',
    }}>
      <div style={{
        width: '100%', maxWidth: 430, minHeight: '100dvh',
        background: 'var(--cream)', position: 'relative', overflowX: 'hidden',
        boxShadow: '0 0 40px rgba(26,34,53,0.12)',
      }}>
        {renderScreen()}
      </div>
    </div>
  );
}
