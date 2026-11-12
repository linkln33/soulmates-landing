/**
 * Server-rendered QR of the invitation link (https://www.soulmates.quest/r/<code>), for opening the
 * invitation on a phone from a desktop screen. Inline SVG, no client JS; smaller on narrow screens.
 * Dark modules on a white square in both themes, so phone cameras read it.
 */
import { qrSvgPath, referralWebUrl } from '@/lib/site/qr';

export default function ReferralQr({ code, label, caption }: { code: string; label: string; caption: string }) {
  const url = referralWebUrl(code);
  if (!url) return null;
  const { size, d } = qrSvgPath(url);
  return (
    <figure className="stack" style={{ gap: 8, margin: 0, alignItems: 'flex-start' }}>
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${size} ${size}`}
        shapeRendering="crispEdges"
        style={{ width: 'clamp(120px, 28vw, 168px)', height: 'auto', borderRadius: 8, display: 'block' }}
      >
        <rect width={size} height={size} fill="#fff" />
        <path d={d} fill="#000" />
      </svg>
      <figcaption className="small muted">{caption}</figcaption>
    </figure>
  );
}
