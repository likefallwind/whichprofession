// score.ts — 双层打分（PRD §8），对齐需求文档
// 修订 1：优先/继续了解的专业从「人格卡专属范围」取，全量 50 排名只供深度报告
// 修订 2：置信度为可叠加布尔标记（PRD §8.2 五条独立规则）
// 修订 3：未来多面手按前三高维度动态生成 3 条探索线

import {
  QUIZ_BANK, PERSONAS, MAJORS, RIASEC_ORDER, findMajor,
  type Letter, type Major, type Persona,
} from '../data/quiz';

export interface Answer {
  qIndex: number;
  first: Letter | null;
  second: Letter | null;
}

export interface Confidence {
  mainClear: boolean;   // 第1名比第2名高 ≥5 分 → 主线很清晰
  dualCore: boolean;    // 第1名与第2名差 0–4 分 → 双核心人格
  thirdColor: boolean;  // 第2名与第3名差 0–2 分 → 潜在第三色
  multi: boolean;       // 最高与最低差 <8 分 → 未来多面手
  lowDims: Letter[];    // 显著偏低的维度（用「当前吸引力较低」措辞）
}

export interface MultiTrack {
  dim: Letter;
  majors: Major[];
}

export interface ScoreResult {
  dim: Record<Letter, number>;
  ordered: [Letter, number][];
  top: Letter;
  second: Letter;
  third: Letter;
  persona: Persona;
  confidence: Confidence;
  priorityMajors: Major[];   // 修订1：persona 范围内推荐分前 3
  continueMajors: Major[];   // 修订1：persona 范围内推荐分第 4–6
  deepReport: Major[];       // 全量 50 排名（≥8），供深度报告
  multiTracks?: MultiTrack[];
}

const personaByCode = (code: string): Persona =>
  PERSONAS.find((p) => p.code === code) ?? PERSONAS[PERSONAS.length - 1];

// 把两个维度按 RIASEC 规范序拼成人格代码（如 C,I → "I-C"）
function canonicalCode(a: Letter, b: Letter): string {
  const [x, y] = [a, b].sort(
    (m, n) => RIASEC_ORDER.indexOf(m) - RIASEC_ORDER.indexOf(n),
  );
  return `${x}-${y}`;
}

// 专业推荐分（PRD §8.1）：0.65×RIASEC匹配分 + 0.35×题目专业提示分
function recommendScore(
  m: Major,
  top3: Letter[],
  hintScore: Record<string, number>,
): number {
  let r = 0;
  if (m.riasec.includes(top3[0])) r += 5; // 第1维度命中
  if (m.riasec.includes(top3[1])) r += 3; // 第2维度命中
  if (m.riasec.includes(top3[2])) r += 1; // 第3维度命中
  const hint = hintScore[m.cat] ?? 0;
  return 0.65 * r + 0.35 * hint;
}

export function scoreAll(answers: Answer[]): ScoreResult {
  // ── 第一层：RIASEC 兴趣分（最想 +2 / 第二想 +1）───────────
  const dim: Record<Letter, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  // ── 第二层：专业大类提示分（最想 +1.0 / 第二想 +0.5）──────
  const hintScore: Record<string, number> = {};

  for (const { qIndex, first, second } of answers) {
    const q = QUIZ_BANK[qIndex];
    if (!q) continue;
    if (first) {
      dim[first] += 2;
      const opt = q.options.find((o) => o.letter === first);
      opt?.majors.forEach((mc) => { hintScore[mc] = (hintScore[mc] ?? 0) + 1.0; });
    }
    if (second) {
      dim[second] += 1;
      const opt = q.options.find((o) => o.letter === second);
      opt?.majors.forEach((mc) => { hintScore[mc] = (hintScore[mc] ?? 0) + 0.5; });
    }
  }

  // 六维降序；同分按 RIASEC 规范序固定，保证确定性
  const ordered = (Object.entries(dim) as [Letter, number][]).sort(
    (a, b) => b[1] - a[1] ||
      RIASEC_ORDER.indexOf(a[0]) - RIASEC_ORDER.indexOf(b[0]),
  );
  const [top, second, third] = [ordered[0][0], ordered[1][0], ordered[2][0]];
  const top3: Letter[] = [top, second, third];

  // ── 置信度（PRD §8.2，可叠加）─────────────────────────────
  const gap12 = ordered[0][1] - ordered[1][1];
  const gap23 = ordered[1][1] - ordered[2][1];
  const spread = ordered[0][1] - ordered[5][1];
  const topScore = ordered[0][1];
  const multi = spread < 8;
  const confidence: Confidence = {
    mainClear: !multi && gap12 >= 5,
    dualCore: !multi && gap12 <= 4,
    thirdColor: !multi && gap23 <= 2,
    multi,
    lowDims: multi ? [] : ordered
      .filter(([, v]) => topScore - v >= 10)
      .map(([l]) => l),
  };

  // ── 人格卡 ────────────────────────────────────────────────
  const persona = multi
    ? personaByCode('多线')
    : personaByCode(canonicalCode(top, second));

  // ── 修订 1：优先 / 继续了解 = 人格卡专属专业按推荐分排序 ───
  const personaMajors = persona.majors
    .map((cat) => findMajor(cat))
    .filter((m): m is Major => Boolean(m))
    .sort(
      (a, b) =>
        recommendScore(b, top3, hintScore) - recommendScore(a, top3, hintScore) ||
        a.rank - b.rank,
    );
  const priorityMajors = personaMajors.slice(0, 3);
  const continueMajors = personaMajors.slice(3, 6);

  // 全量 50 大类排名 → 深度报告（≥8 项）
  const deepReport = [...MAJORS]
    .sort(
      (a, b) =>
        recommendScore(b, top3, hintScore) - recommendScore(a, top3, hintScore) ||
        a.rank - b.rank,
    )
    .slice(0, 10);

  // ── 修订 3：未来多面手 → 前三高维度各一条探索线 ───────────
  let multiTracks: MultiTrack[] | undefined;
  if (multi) {
    const used = new Set<string>();
    multiTracks = top3.map((d) => {
      const majors = [...MAJORS]
        .filter((m) => m.riasec.includes(d) && !used.has(m.cat))
        .sort(
          (a, b) =>
            recommendScore(b, top3, hintScore) -
              recommendScore(a, top3, hintScore) || a.rank - b.rank,
        )
        .slice(0, 2);
      majors.forEach((m) => used.add(m.cat));
      return { dim: d, majors };
    });
  }

  return {
    dim, ordered, top, second, third,
    persona, confidence,
    priorityMajors, continueMajors, deepReport, multiTracks,
  };
}

// ── 演示用结果：用一组真实答案跑 scoreAll，避免与算法漂移 ────
const DEMO_ANSWERS: Answer[] = QUIZ_BANK.map((_, i) => ({
  qIndex: i, first: 'I' as Letter, second: 'C' as Letter,
}));
export const DEMO_RESULT: ScoreResult = scoreAll(DEMO_ANSWERS);
