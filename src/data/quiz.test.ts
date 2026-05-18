import { describe, it, expect } from 'vitest';
import {
  QUIZ_BANK, PERSONAS, MAJORS, RIASEC, RIASEC_ORDER, findMajor,
  type Letter,
} from './quiz';

const LETTERS: Letter[] = ['R', 'I', 'A', 'S', 'E', 'C'];
const majorNames = new Set(MAJORS.map((m) => m.cat));

describe('数据层 · 题库 QUIZ_BANK', () => {
  it('恰好 18 道题（PRD §6）', () => {
    expect(QUIZ_BANK).toHaveLength(18);
  });

  it('题目 id 为 1–18 且唯一', () => {
    expect(QUIZ_BANK.map((q) => q.id)).toEqual(
      Array.from({ length: 18 }, (_, i) => i + 1),
    );
  });

  it('每题恰好 6 个选项，且字母覆盖完整 RIASEC 六维', () => {
    for (const q of QUIZ_BANK) {
      expect(q.options).toHaveLength(6);
      expect(new Set(q.options.map((o) => o.letter))).toEqual(new Set(LETTERS));
    }
  });

  it('每个选项都有图标、标题、提示文案', () => {
    for (const q of QUIZ_BANK) {
      for (const o of q.options) {
        expect(o.icon.length).toBeGreaterThan(0);
        expect(o.title.length).toBeGreaterThan(0);
        expect(o.hint.length).toBeGreaterThan(0);
      }
    }
  });

  it('每个选项绑定至少 1 个专业大类，且都能在 MAJORS 中解析', () => {
    for (const q of QUIZ_BANK) {
      for (const o of q.options) {
        expect(o.majors.length).toBeGreaterThan(0);
        for (const m of o.majors) {
          expect(majorNames.has(m), `Q${q.id}/${o.letter} 引用不存在的大类「${m}」`).toBe(true);
        }
      }
    }
  });

  it('每题有场景、问题、题型文案', () => {
    for (const q of QUIZ_BANK) {
      expect(q.scene.length).toBeGreaterThan(0);
      expect(q.q.length).toBeGreaterThan(0);
      expect(q.kind.length).toBeGreaterThan(0);
    }
  });
});

describe('数据层 · 人格卡 PERSONAS', () => {
  it('恰好 16 张人格卡（PRD §9）', () => {
    expect(PERSONAS).toHaveLength(16);
  });

  it('人格代码唯一', () => {
    expect(new Set(PERSONAS.map((p) => p.code)).size).toBe(16);
  });

  it('15 个双维组合恰好覆盖全部 C(6,2)=15 种 RIASEC 组合，且按规范序书写', () => {
    const dual = PERSONAS.filter((p) => p.code !== '多线').map((p) => p.code);
    expect(dual).toHaveLength(15);
    const expected = new Set<string>();
    for (let i = 0; i < LETTERS.length; i++) {
      for (let j = i + 1; j < LETTERS.length; j++) {
        expected.add(`${LETTERS[i]}-${LETTERS[j]}`);
      }
    }
    expect(new Set(dual)).toEqual(expected);
    // 每个代码均为规范序（前字母在 RIASEC_ORDER 中靠前）
    for (const code of dual) {
      const [a, b] = code.split('-') as Letter[];
      expect(RIASEC_ORDER.indexOf(a)).toBeLessThan(RIASEC_ORDER.indexOf(b));
    }
  });

  it('含且仅含 1 张「多线」卡', () => {
    expect(PERSONAS.filter((p) => p.code === '多线')).toHaveLength(1);
  });

  it('每张卡的推荐专业大类非空且都能解析', () => {
    for (const p of PERSONAS) {
      expect(p.majors.length).toBeGreaterThan(0);
      for (const m of p.majors) {
        expect(majorNames.has(m), `人格 ${p.code} 引用不存在的大类「${m}」`).toBe(true);
      }
    }
  });

  it('双维卡推荐专业够拆出「优先 3」并尽量满足「继续了解」', () => {
    // PRD §9：多数卡 6–7 个，A-C「审美规划师」按 PRD 原文仅 5 个
    // （→ 优先 3 + 继续 2，结果页可优雅降级）。此处守住 ≥5 的下限。
    for (const p of PERSONAS) {
      if (p.code === '多线') continue;
      expect(p.majors.length, `人格 ${p.code} 推荐专业少于 5 个`).toBeGreaterThanOrEqual(5);
    }
  });

  it('每张卡都有名称、英文名、简介、关键词、职业出口、两周任务', () => {
    for (const p of PERSONAS) {
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.en.length).toBeGreaterThan(0);
      expect(p.summary.length).toBeGreaterThan(0);
      expect(p.keywords.length).toBeGreaterThan(0);
      expect(p.careers.length).toBeGreaterThan(0);
      expect(p.task.length).toBeGreaterThan(0);
    }
  });

  it('文案不含 MBTI / 最适合 / 命定 等违规词（PRD §13）', () => {
    const banned = ['MBTI', '最适合', '命定'];
    for (const p of PERSONAS) {
      const blob = `${p.name}${p.summary}${p.task}${p.careers.join('')}`;
      for (const w of banned) {
        expect(blob.includes(w), `人格 ${p.code} 含违规词「${w}」`).toBe(false);
      }
    }
  });
});

describe('数据层 · 专业大类 MAJORS', () => {
  it('恰好 50 个专业大类（PRD §7.1）', () => {
    expect(MAJORS).toHaveLength(50);
  });

  it('rank 为 1–50 且唯一', () => {
    expect([...MAJORS].map((m) => m.rank).sort((a, b) => a - b))
      .toEqual(Array.from({ length: 50 }, (_, i) => i + 1));
  });

  it('专业大类名称唯一', () => {
    expect(new Set(MAJORS.map((m) => m.cat)).size).toBe(50);
  });

  it('每个大类的 RIASEC 标签为 2–3 个合法维度', () => {
    for (const m of MAJORS) {
      expect(m.riasec.length).toBeGreaterThanOrEqual(2);
      expect(m.riasec.length).toBeLessThanOrEqual(3);
      for (const l of m.riasec) expect(LETTERS).toContain(l);
    }
  });

  it('每个大类都有学科门类、关键词、职业出口', () => {
    for (const m of MAJORS) {
      expect(m.disc.length).toBeGreaterThan(0);
      expect(m.kw.length).toBeGreaterThan(0);
      expect(m.exits.length).toBeGreaterThan(0);
    }
  });
});

describe('数据层 · 工具函数与元数据', () => {
  it('findMajor 命中已知大类、未知返回 undefined', () => {
    expect(findMajor('计算机类')?.cat).toBe('计算机类');
    expect(findMajor('不存在的大类')).toBeUndefined();
  });

  it('RIASEC 六维都有完整元数据', () => {
    for (const l of LETTERS) {
      expect(RIASEC[l].label.length).toBeGreaterThan(0);
      expect(RIASEC[l].c).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(RIASEC[l].bg).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
    expect(RIASEC_ORDER).toEqual(LETTERS);
  });
});
