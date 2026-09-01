export function levelForXP(xp: number) {
  return Math.max(1, Math.floor(xp / 500) + 1);
}
export function levelName(level: number) {
  if (level >= 10) return "Psychology Scholar";
  if (level >= 7) return "Researcher";
  if (level >= 4) return "Analyst";
  if (level >= 2) return "Learner";
  return "Observer";
}
