const SINGLE = /^(\d+)$/;
const RANGE = /^(\d+)-(\d+)$/;

/** Inclusive port range width limit (avoids huge expansions). */
export const MAX_PORTS_PER_RANGE = 4096;

function assertPort(n: number, label: string): void {
  if (!Number.isFinite(n) || n < 1 || n > 65535) {
    throw new Error(`invalid port in ${label}`);
  }
}

/**
 * Expand one CLI token: `3000` or inclusive range `3000-3005`.
 */
export function expandPortToken(token: string): number[] {
  const t = token.trim();
  if (!t) {
    throw new Error(`invalid port: ${JSON.stringify(token)}`);
  }

  const rangeMatch = t.match(RANGE);
  if (rangeMatch) {
    const start = Number.parseInt(rangeMatch[1]!, 10);
    const end = Number.parseInt(rangeMatch[2]!, 10);
    assertPort(start, "range start");
    assertPort(end, "range end");
    if (start > end) {
      throw new Error(`invalid port range: ${t} (start must be <= end)`);
    }
    const count = end - start + 1;
    if (count > MAX_PORTS_PER_RANGE) {
      throw new Error(`port range too large: ${count} ports (max ${MAX_PORTS_PER_RANGE} per range)`);
    }
    const out: number[] = [];
    for (let p = start; p <= end; p++) {
      out.push(p);
    }
    return out;
  }

  const singleMatch = t.match(SINGLE);
  if (singleMatch) {
    const n = Number.parseInt(singleMatch[1]!, 10);
    assertPort(n, t);
    return [n];
  }

  throw new Error(`invalid port: ${t}`);
}

/** Parse all positional port arguments; dedupe preserving first-seen order. */
export function parsePortArguments(tokens: string[]): number[] {
  const result: number[] = [];
  const seen = new Set<number>();
  for (const token of tokens) {
    for (const port of expandPortToken(token)) {
      if (!seen.has(port)) {
        seen.add(port);
        result.push(port);
      }
    }
  }
  return result;
}
