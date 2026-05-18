import type { Letter } from '../data/quiz';

export type NavPayload = { letter?: Letter; code?: string };
export type OnNav = (target: string, payload?: NavPayload) => void;
