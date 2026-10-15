const password = process.env.USER_PASSWORD ?? 'secret_sauce';

export const users = {
  standard: { username: process.env.STANDARD_USER ?? 'standard_user', password },
  lockedOut: { username: 'locked_out_user', password },
  problem: { username: 'problem_user', password },
  performanceGlitch: { username: 'performance_glitch_user', password },
  error: { username: 'error_user', password },
  visual: { username: 'visual_user', password },
} as const;

export type User = { username: string; password: string };
