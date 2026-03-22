export type SupportedPlatform = "darwin" | "linux";

export class UnsupportedPlatformError extends Error {
  readonly platform: string;
  constructor(platform: string) {
    super(`portkill is not supported on this platform (${platform}). Supported: macOS, Linux.`);
    this.name = "UnsupportedPlatformError";
    this.platform = platform;
  }
}

export function getSupportedPlatform(): SupportedPlatform {
  const p = process.platform;
  if (p === "darwin" || p === "linux") return p;
  throw new UnsupportedPlatformError(p);
}
