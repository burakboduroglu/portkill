/**
 * Node puts two different things on `code` when a child process fails: the
 * errno string when the spawn itself failed (`"ENOENT"`, `"EPERM"`), and the
 * numeric exit status when the child ran and exited non-zero. `lsof` exiting 1
 * for "no matches" arrives as the number 1, so the union matters — typing it as
 * `NodeJS.ErrnoException` makes `code === 1` an error TypeScript is right about.
 */
export type ExecErrorCode = string | number | undefined;

export function execErrorCode(err: unknown): ExecErrorCode {
  if (err && typeof err === "object" && "code" in err) {
    return (err as { code?: string | number }).code;
  }
  return undefined;
}
