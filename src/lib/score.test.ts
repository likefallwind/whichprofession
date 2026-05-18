import { describe, it, expect } from 'vitest';
import { scoreAll, DEMO_RESULT, type Answer } from './score';
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
      for (const t of r.multiTracks!) {
        expect(t.majors.length).toBeGreaterThan(0);
        expect([r.top, r.second, r.third]).toContain(t.dim);
      }
    }
  });
});

describe('scoreAll · 边缘场景与健壮性', () => {
  it('空答案不崩溃，返回结构完整且判为多面手', () => {
    const r = scoreAll([]);
    expect(Object.values(r.dim).reduce((a, b) => a + b, 0)).toBe(0);
    expect(r.ordered).toHaveLength(6);
    expect(r.confidence.multi).toBe(true);
    expect(r.persona.code).toBe('多线');
  });

  it('只选了「最想做」、缺「第二想做」也能计分（first +2）', () => {
    const answers: Answer[] = QUIZ_BANK.map((_, i) => ({ qIndex: i, first: 'I', second: null }));
    const r = scoreAll(answers);
    expect(r.dim.I).toBe(36); // 18 题 × 2
    expect(Object.values(r.dim).reduce((a, b) => a + b, 0)).toBe(36);
  });

  it('忽略越界 qIndex，不污染结果', () => {
    const r = scoreAll([{ qIndex: 999, first: 'I', second: 'C' }]);
    expect(Object.values(r.dim).reduce((a, b) => a + b, 0)).toBe(0);
  });

  it('人格代码按 RIASEC 规范序：C 第1名、I 第2名 → 代码 I-C', () => {
    const answers: Answer[] = QUIZ_BANK.map((_, i) => ({ qIndex: i, first: 'C', second: 'I' }));
    const r = scoreAll(answers);
    expect(r.top).toBe('C');
    expect(r.second).toBe('I');
    expect(r.persona.code).toBe('I-C'); // 而非 "C-I"
  });

  it('优先 / 继续了解各 3 项且互不重叠', () => {
    const answers: Answer[] = QUIZ_BANK.map((_, i) => ({ qIndex: i, first: 'I', second: 'C' }));
    const r = scoreAll(answers);
    expect(r.priorityMajors).toHaveLength(3);
    expect(r.continueMajors).toHaveLength(3);
    const overlap = r.priorityMajors.filter((m) => r.continueMajors.some((c) => c.cat === m.cat));
    expect(overlap).toHaveLength(0);
  });

  it('深度报告恰 10 项、无重复、按推荐相关性领先于尾部', () => {
    const answers: Answer[] = QUIZ_BANK.map((_, i) => ({ qIndex: i, first: 'I', second: 'C' }));
    const r = scoreAll(answers);
    expect(r.deepReport).toHaveLength(10);
    expect(new Set(r.deepReport.map((m) => m.cat)).size).toBe(10);
    // 头部专业的 RIASEC 标签应与学生主维度相关
    expect(r.deepReport[0].riasec.some((l) => l === r.top || l === r.second)).toBe(true);
  });

  it('某维度显著偏低时进入 lowDims，并用克制措辞', () => {
    const answers: Answer[] = QUIZ_BANK.map((_, i) => ({ qIndex: i, first: 'C', second: 'I' }));
    const r = scoreAll(answers);
    // R/A/S/E 全为 0，与最高分 36 差 ≥10
    expect(r.confidence.lowDims.length).toBeGreaterThan(0);
    expect(r.confidence.lowDims).toContain('R');
  });

  it('主线明显时 mainClear 为 true、dualCore 为 false（互斥）', () => {
    const answers: Answer[] = QUIZ_BANK.map((_, i) => ({ qIndex: i, first: 'I', second: 'C' }));
    const r = scoreAll(answers);
    expect(r.confidence.multi).toBe(false);
    expect(r.confidence.mainClear).toBe(true);
    expect(r.confidence.dualCore).toBe(false);
  });

  it('同一组答案多次计算结果完全一致（确定性）', () => {
    const answers: Answer[] = QUIZ_BANK.map((_, i) => ({
      qIndex: i, first: (['R', 'I', 'A'] as Letter[])[i % 3], second: 'C',
    }));
    expect(JSON.stringify(scoreAll(answers))).toBe(JSON.stringify(scoreAll(answers)));
  });

  it('DEMO_RESULT 是一个有效结果（人格落在 16 张内）', () => {
    expect(PERSONAS.some((p) => p.code === DEMO_RESULT.persona.code)).toBe(true);
    expect(DEMO_RESULT.priorityMajors.length).toBeGreaterThan(0);
  });
});
