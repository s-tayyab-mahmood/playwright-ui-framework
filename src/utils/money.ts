export function parsePrice(text: string): number {
  const match = text.match(/\$(\d+(?:\.\d{2})?)/);
  if (!match) throw new Error(`No price found in "${text}"`);
  return Number(match[1]);
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
