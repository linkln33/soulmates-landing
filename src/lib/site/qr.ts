/**
 * QR codes rendered on the server as one SVG path (no client JS). Encoder: qrcode-generator
 * (MIT, no dependencies); this module only turns its module grid into a path, so the colours
 * stay dark-on-light in both themes (inverted codes scan poorly).
 */
import qrcode from 'qrcode-generator';
import { SITE_URL } from './config.ts';
import { normalizeReferralCode } from './referral.ts';

/** Quiet zone in modules on each side (the QR specification asks for 4). */
export const QR_QUIET_ZONE = 4;

/** The invitation link a QR carries: the canonical host, no language, no query. Null for a malformed code. */
export function referralWebUrl(raw: unknown): string | null {
  const code = normalizeReferralCode(raw);
  return code ? `${SITE_URL}/r/${code}` : null;
}

/** The module grid for `text` (error correction M, smallest version that fits). */
export function qrMatrix(text: string): boolean[][] {
  const qr = qrcode(0, 'M');
  qr.addData(text, 'Byte');
  qr.make();
  const n = qr.getModuleCount();
  return Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => qr.isDark(r, c)));
}

/** SVG geometry for `text`: the viewBox side (modules plus quiet zone) and one path of 1x1 dark squares. */
export function qrSvgPath(text: string): { size: number; d: string } {
  const grid = qrMatrix(text);
  const parts: string[] = [];
  grid.forEach((row, r) => {
    row.forEach((dark, c) => {
      if (dark) parts.push(`M${c + QR_QUIET_ZONE} ${r + QR_QUIET_ZONE}h1v1h-1z`);
    });
  });
  return { size: grid.length + QR_QUIET_ZONE * 2, d: parts.join('') };
}
