const EM: Record<string, string> = {
  heart: '💝',
  lock:  '🪬',
};

export function Ico({ k, s = 22 }: { k: string; s?: number }) {
  const em = EM[k];
  return em
    ? <span style={{ fontSize: s, lineHeight: 1, display: 'inline-flex', userSelect: 'none' }}>{em}</span>
    : null;
}
