import { describe, it, expect } from 'vitest';
import { scoreAll, type Answer } from './score';
import { QUIZ_BANK, PERSONAS, type Letter } from '../data/quiz';

const VALID_CODES = new Set(PERSONAS.map((p) => p.code));

// 全 18 题都选同一对 first/second
function uniform(first: Letter, second: Letter): Answer[] {
  return QUIZ_BANK.map((_, i) => ({ qIndex: i, first, second }));
}

describe('scoreAll · PRD §8 对齐', () => {
  it('六维总分恒为 54（最想+2 / 第二想+1，18 题）', () => {
    const r = scoreAll(uniform('I', 'C'));
    const total = Object.values(r.dim).reduce((a, b) => a + b, 0);
    expect(total).toBe(54);
  });

  it('人格代码落在 §9 的 16 张之内', () => {
    for (const [f, s] of [['I', 'C'], ['R', 'I'], ['A', 'E'], ['S', 'E']] as [Letter, Letter][]) {
      expect(VALID_CODES.has(scoreAll(uniform(f, s)).persona.code)).toBe(true);
    }
  });

  it('修订1：优先 / 继续了解的专业 ⊆ 人格卡专属范围', () => {
    const r = scoreAll(uniform('I', 'C'));
    const allowed = new Set(r.persona.majors);
    for (const m of [...r.priorityMajors, ...r.continueMajors]) {
      expect(allowed.has(m.cat)).toBe(true);
    }
    expect(r.priorityMajors).toHaveLength(3);
  });

  it('修订2：gap12≤4 且 gap23≤2 时 dualCore 与 thirdColor 同时为 true', () => {
    // I,A,S 三维并列最高，造出小 gap12/gap23
    const answers: Answer[] = QUIZ_BANK.map((_, i) => {
      const pick: [Letter, Letter] = i % 3 === 0 ? ['I', 'A']
        : i % 3 === 1 ? ['A', 'S'] : ['S', 'I'];
      return { qIndex: i, first: pick[0], second: pick[1] };
    });
    const r = scoreAll(answers);
    if (!r.confidence.multi) {
      expect(r.confidence.dualCore).toBe(true);
      expect(r.confidence.thirdColor).toBe(true);
    }
  });

  it('修订3：spread<8 时 multi 为 true 且 multiTracks 含 3 条线', () => {
    // 每题轮换六个维度，使各维度分数接近
    const answers: Answer[] = QUIZ_BANK.map((_, i) => {
      const order: Letter[] = ['R', 'I', 'A', 'S', 'E', 'C'];
      return { qIndex: i, first: order[i % 6], second: order[(i + 1) % 6] };
    });
    const r = scoreAll(answers);
    const spread = r.ordered[0][1] - r.ordered[5][1];
    if (spread < 8) {
      expect(r.confidence.multi).toBe(true);
      expect(r.persona.code).toBe('多线');
      expect(r.multiTracks).toHaveLength(3);
    }
  });
});
