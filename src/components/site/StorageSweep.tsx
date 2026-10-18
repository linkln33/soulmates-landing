'use client';
/** Applies the Tarot storage expiry on every page load (see src/lib/readings/tarotStorage.ts). */
import { useEffect } from 'react';
import { sweepTarot } from '@/lib/readings/local';
import { visitorZone } from '@/lib/readings/api';

export default function StorageSweep() {
  useEffect(() => {
    sweepTarot(visitorZone());
  }, []);
  return null;
}
