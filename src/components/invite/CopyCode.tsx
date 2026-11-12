'use client';
/** The invitation code, shown large, with a Copy button. Without clipboard access the code is selected for manual copying. */
import { useRef, useState } from 'react';

export default function CopyCode({ code, label, copy, copied, copyFailed }: { code: string; label: string; copy: string; copied: string; copyFailed: string }) {
  const codeRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle');

  async function onCopy() {
    try {
      if (!navigator.clipboard) throw new Error('no clipboard');
      await navigator.clipboard.writeText(code);
      setState('copied');
    } catch {
      const node = codeRef.current;
      const selection = typeof window !== 'undefined' ? window.getSelection() : null;
      if (node && selection) {
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setState('manual');
    }
  }

  return (
    <div className="stack" style={{ gap: 10 }}>
      <p className="small muted">{label}</p>
      <div className="row" style={{ gap: 14 }}>
        <code
          ref={codeRef}
          translate="no"
          style={{ fontFamily: 'inherit', fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', wordBreak: 'break-all', userSelect: 'all' }}
        >
          {code}
        </code>
        <button type="button" className="btn btn-secondary" onClick={onCopy}>
          {state === 'copied' ? copied : copy}
        </button>
      </div>
      <p className="small muted" role="status" aria-live="polite">
        {state === 'manual' ? copyFailed : ''}
      </p>
    </div>
  );
}
